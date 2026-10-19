from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from extensions import db

from datetime import datetime, timedelta, timezone
import os
import hashlib
import secrets
from html import escape
from urllib.parse import urlencode
import resend

from email_validator import validate_email, EmailNotValidError
from models import *
from helpers.validation_helpers import *
from helpers.card_helpers import create_employee_card

load_dotenv()

app = Flask(__name__)
\
resend.api_key = os.getenv("RESEND_API_KEY")

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=3)
jwt = JWTManager(app)

# Configure the PostgreSQL connection
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database extension
db.init_app(app)
migrate = Migrate(app, db)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "http://localhost:5173"
        }
    },
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"]
)
# To nuke old Flask servers: kill -9 $(lsof -t -i :5000)
# To run the Flask backend: python backend/app.py   

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data["email"].strip().lower()
    password = data["password"]

    if not email:
        return jsonify(field="email", error="Email cannot be empty"), 400

    if not password:
        return jsonify(field="password", error="Password cannot be empty"), 400

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify(field="email", error="No account found"), 401

    if not verify_password_bcrypt(user.password_hash, password):
        return jsonify(field="password", error="Your password is incorrect"), 401

    if not user.is_active:
        return jsonify(error="This account has been deactivated"), 403

    access_token = create_access_token(identity=str(user.id))

    return jsonify(message="Login successful", accessToken=access_token, companySetupComplete=user.company_id is not None), 200


@app.route("/api/signup", methods=["POST"])
def new_user():
    data = request.get_json()

    first_name = data["firstName"].strip()
    last_name = data["lastName"].strip()
    email = data["email"].strip().lower()
    password = data["password"]
    confirmed_password = data["confirmedPassword"]

    check_valid_first_name = valid_name("First", first_name)
    check_valid_last_name = valid_name("Last", last_name)
    check_valid_password = valid_password(password)

    if not check_valid_first_name["passed"]:
        return jsonify(field="firstName", error=check_valid_first_name["message"]), check_valid_first_name["code"]
    if not check_valid_last_name["passed"]:
        return jsonify(field="lastName", error=check_valid_last_name["message"]), check_valid_last_name["code"]
    elif not check_valid_password["passed"]:
        return jsonify(field="password", error=check_valid_password["message"]), check_valid_password["code"]
    elif confirmed_password != password:
        return jsonify(field="confirmedPassword", error="Passwords do not match"), 400

    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify(field="email", error="Email not formatted correctly"), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify(field="email", error="An account with this email already exists"), 409

    password_hash = hash_password_bcrypt(password)

    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=password_hash,
        role="Owner",
    )
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify(message="Signup successful", accessToken=access_token, companySetupComplete=False), 201

@app.route("/api/company-setup", methods=["POST"])
@jwt_required()
def company_setup():
    data = request.get_json()
    company_name = data["companyName"].strip()
    company_website= data["companyWebsite"].strip()

    check_valid_company_website = validate_company_website(company_website)
    if not company_name:
        return jsonify(field="companyName", error="Company name cannot be empty"), 400

    if not check_valid_company_website["passed"]:
        return jsonify(field="companyWebsite", error=check_valid_company_website["message"]), check_valid_company_website["code"]
    
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify(error="User account could not be found"), 404

    if user.company_id is not None:
        return jsonify( error="This account is already associated with a company"), 409

    existing_company = Company.query.filter_by(
        website=check_valid_company_website["url"]
    ).first()

    if existing_company:
        return jsonify(field="companyWebsite", error="This company website is already registered"), 409

    company = Company(
        name=company_name,
        website=check_valid_company_website["url"]
    )

    db.session.add(company)
    db.session.flush()

    user.company_id = company.id

    db.session.commit()

    # Creating a new JWT
    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify( message="Company creation successful", companyId=company.id, accessToken=access_token, companySetupComplete=True), 201

@app.route("/api/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify(error="User account could not be found"), 404

    if not user.is_active:
        return jsonify(error="This account has been deactivated"), 403

    if user.company_id is None:
        return jsonify(
            error="Company setup is required",
            companySetupComplete=False,
            redirectTo="/company-setup"
        ), 403

    return jsonify(
        message="Dashboard access granted",
        userId=str(user.id),
        companyId=str(user.company_id),
        companySetupComplete=True
    ), 200

@app.route("/api/employees/invite", methods=["POST"])
@jwt_required()
def invite_employee():
    data = request.get_json(silent=True) or {}

    inviter_id = get_jwt_identity()
    inviter = db.session.get(User, inviter_id)

    if inviter is None or not inviter.is_active:
        return jsonify(error="Account not found or inactive"), 403

    if inviter.company_id is None:
        return jsonify(error="Complete company setup first"), 403

    # Replace/extend this check with your actual permission system.
    if inviter.role not in ("Owner", "Admin"):
        return jsonify(error="You cannot invite employees"), 403

    email = data.get("email", "").strip().lower()
    full_name = data.get("name", "").strip()
    role = data.get("role", "Employee")
    department = data.get("department", "").strip() or None

    if not full_name or not email:
        return jsonify(error="Name and email are required"), 400

    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify(error="Invalid email address"), 400

    if role not in (
        "Employee",
        "Manager",
        "Admin",
        "Product Designer",
        "Financial Analyst",
        "Frontend Engineer",
        "HR Manager",
        "Data Scientist",
    ):
        return jsonify(error="Invalid role"), 400

    parts = full_name.split(maxsplit=1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else ""

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify(error="An account with this email already exists"), 409

    # Prevent duplicate pending invitations for the same company/email.
    existing_invite = EmployeeInvitation.query.filter_by(
        company_id=inviter.company_id,
        email=email,
        accepted_at=None,
        revoked_at=None,
    ).first()

    if existing_invite and existing_invite.expires_at and existing_invite.expires_at > datetime.now(timezone.utc):
        return jsonify(error="An active invitation already exists"), 409

    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()

    raw_limit = data.get("cardLimit")
    card_limit = None

    if raw_limit is not None:
        try:
            from decimal import Decimal, InvalidOperation

            card_limit = Decimal(str(raw_limit))
        except (InvalidOperation, ValueError):
            return jsonify(error="Invalid card limit"), 400

        if not card_limit.is_finite() or card_limit <= 0:
            return jsonify(error="Card limit must be positive"), 400

    frequency = data.get("cardLimitFrequency", "monthly")

    if frequency not in ("daily", "weekly", "monthly", "yearly"):
        return jsonify(error="Invalid reset frequency"), 400

    invitation = EmployeeInvitation(
        company_id=inviter.company_id,
        invited_by_id=inviter.id,
        email=email,
        first_name=first_name,
        last_name=last_name,
        role=role,
        department=department,
        card_limit=card_limit,
        card_limit_frequency=frequency,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=3)
    )

    try:
        db.session.add(invitation)
        db.session.flush()

        invite_url = (
            f"{os.environ['FRONTEND_URL'].rstrip('/')}"
            f"/accept-invitation?{urlencode({'token': raw_token})}"
        )

        invitation_html = f"""
            <html>
            <body>
                <h2 >You're invited to Summit!</h2>
                <p>Hi {escape(first_name)},</p>
                <p>
                {escape(inviter.first_name)} invited you to join Summit
                Expense Management.
                </p>
                <p>Accept your invitation and set up your account:</p>
                <p>
                <a href="{escape(invite_url, quote=True)}">
                    Accept invitation
                </a>
                </p>
                <p>
                If you weren't expecting this invitation, you can ignore
                this email.
                </p>
            </body>
            </html>
            """

        resend.Emails.send({
            "from": "Summit <onboarding@resend.dev>",
            "to": [email],
            "subject": "You're invited to Summit",
            "html": invitation_html,
        })

        db.session.commit()

    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to create or send employee invitation")
        return jsonify(error="Unable to send invitation right now"), 500

    return jsonify(
        message="Invitation sent successfully",
        invitationId=str(invitation.id),
    ), 201



if __name__ == "__main__":
    app.run(debug=True, port=5000)