
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from dotenv import load_dotenv
from extensions import db

from datetime import datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation
from html import escape
from urllib.parse import urlencode

import hashlib
import os
import secrets
import resend

from email_validator import validate_email, EmailNotValidError
from models import *
from helpers.validation_helpers import *
from helpers.card_helpers import create_employee_card


load_dotenv()

app = Flask(__name__)

resend.api_key = os.getenv("RESEND_API_KEY")

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=3)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

jwt = JWTManager(app)

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
    methods=["GET", "POST", "OPTIONS"],
)


# --------------------------------------------------
# Constants and helpers
# --------------------------------------------------

ALLOWED_ROLES = {
    "Employee",
    "Manager",
    "Admin",
    "Product Designer",
    "Financial Analyst",
    "Frontend Engineer",
    "HR Manager",
    "Data Scientist",
}

ALLOWED_FREQUENCIES = {
    "daily",
    "weekly",
    "monthly",
    "yearly",
}


def normalize_datetime(value):
    """Make a database datetime safe to compare with UTC timestamps."""
    if value is not None and value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def validate_spending_limits(raw_limits):
    """
    Validate the spending limits submitted by the frontend.

    Expected format:
    [
        {
            "category": "Travel",
            "amount": 500,
            "frequency": "monthly"
        }
    ]

    Returns (validated_limits, error_message).
    Amounts are stored as strings in JSON to preserve decimal precision.
    """

    if raw_limits is None:
        raw_limits = []

    if not isinstance(raw_limits, list):
        return None, "Spending limits must be a list"

    validated_limits = []
    seen_categories = set()

    for index, item in enumerate(raw_limits):
        if not isinstance(item, dict):
            return None, f"Spending limit {index + 1} must be an object"

        category = item.get("category")

        if not isinstance(category, str) or not category.strip():
            return None, f"Spending limit {index + 1} requires a category"

        category = category.strip()
        category_key = category.casefold()

        if category_key in seen_categories:
            return None, f"Duplicate spending category: {category}"

        seen_categories.add(category_key)

        raw_amount = item.get("amount")

        if isinstance(raw_amount, bool) or raw_amount is None:
            return None, f"Enter a valid amount for {category}"

        try:
            amount = Decimal(str(raw_amount))
        except (InvalidOperation, ValueError, TypeError):
            return None, f"Enter a valid amount for {category}"

        if not amount.is_finite() or amount <= 0:
            return None, f"The spending limit for {category} must be positive"

        # Your database's NUMERIC(12, 2) supports at most
        # 10 integer digits and 2 decimal places.
        if amount > Decimal("9999999999.99"):
            return None, f"The spending limit for {category} is too large"

        if amount.as_tuple().exponent < -2:
            return None, f"The spending limit for {category} cannot exceed 2 decimal places"

        frequency = item.get("frequency", "monthly")

        if frequency not in ALLOWED_FREQUENCIES:
            return None, f"Invalid reset frequency for {category}"

        validated_limits.append({
            "category": category,
            "amount": format(amount, ".2f"),
            "frequency": frequency,
        })

    return validated_limits, None


# --------------------------------------------------
# Login
# --------------------------------------------------

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email:
        return jsonify(
            field="email",
            error="Email cannot be empty"
        ), 400

    if not password:
        return jsonify(
            field="password",
            error="Password cannot be empty"
        ), 400

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify(
            field="email",
            error="No account found"
        ), 401

    if not verify_password_bcrypt(user.password_hash, password):
        return jsonify(
            field="password",
            error="Your password is incorrect"
        ), 401

    if not user.is_active:
        return jsonify(
            error="This account has been deactivated"
        ), 403

    access_token = create_access_token(identity=str(user.id))

    return jsonify(
        message="Login successful",
        accessToken=access_token,
        companySetupComplete=user.company_id is not None,
    ), 200


# --------------------------------------------------
# Signup
# --------------------------------------------------

@app.route("/api/signup", methods=["POST"])
def new_user():
    data = request.get_json(silent=True) or {}

    first_name = data.get("firstName", "").strip()
    last_name = data.get("lastName", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    confirmed_password = data.get("confirmedPassword", "")

    check_valid_first_name = valid_name("First", first_name)
    check_valid_last_name = valid_name("Last", last_name)
    check_valid_password = valid_password(password)

    if not check_valid_first_name["passed"]:
        return jsonify(
            field="firstName",
            error=check_valid_first_name["message"]
        ), check_valid_first_name["code"]

    if not check_valid_last_name["passed"]:
        return jsonify(
            field="lastName",
            error=check_valid_last_name["message"]
        ), check_valid_last_name["code"]

    if not check_valid_password["passed"]:
        return jsonify(
            field="password",
            error=check_valid_password["message"]
        ), check_valid_password["code"]

    if confirmed_password != password:
        return jsonify(
            field="confirmedPassword",
            error="Passwords do not match"
        ), 400

    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify(
            field="email",
            error="Email not formatted correctly"
        ), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify(
            field="email",
            error="An account with this email already exists"
        ), 409

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

    return jsonify(
        message="Signup successful",
        accessToken=access_token,
        companySetupComplete=False,
    ), 201


# --------------------------------------------------
# Company setup
# --------------------------------------------------

@app.route("/api/company-setup", methods=["POST"])
@jwt_required()
def company_setup():
    data = request.get_json(silent=True) or {}

    company_name = data.get("companyName", "").strip()
    company_website = data.get("companyWebsite", "").strip()

    if not company_name:
        return jsonify(
            field="companyName",
            error="Company name cannot be empty"
        ), 400

    check_valid_company_website = validate_company_website(
        company_website
    )

    if not check_valid_company_website["passed"]:
        return jsonify(
            field="companyWebsite",
            error=check_valid_company_website["message"]
        ), check_valid_company_website["code"]

    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify(
            error="User account could not be found"
        ), 404

    if not user.is_active:
        return jsonify(
            error="This account has been deactivated"
        ), 403

    if user.company_id is not None:
        return jsonify(
            error="This account is already associated with a company"
        ), 409

    existing_company = Company.query.filter_by(
        website=check_valid_company_website["url"]
    ).first()

    if existing_company:
        return jsonify(
            field="companyWebsite",
            error="This company website is already registered"
        ), 409

    company = Company(
        name=company_name,
        website=check_valid_company_website["url"],
    )

    try:
        db.session.add(company)
        db.session.flush()

        user.company_id = company.id

        db.session.commit()

    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to create company")

        return jsonify(
            error="Unable to create company right now"
        ), 500

    access_token = create_access_token(identity=str(user.id))

    return jsonify(
        message="Company creation successful",
        companyId=str(company.id),
        accessToken=access_token,
        companySetupComplete=True,
    ), 201


# --------------------------------------------------
# Dashboard
# --------------------------------------------------

@app.route("/api/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify(
            error="User account could not be found"
        ), 404

    if not user.is_active:
        return jsonify(
            error="This account has been deactivated"
        ), 403

    if user.company_id is None:
        return jsonify(
            error="Company setup is required",
            companySetupComplete=False,
            redirectTo="/company-setup",
        ), 403

    return jsonify(
        message="Dashboard access granted",
        userId=str(user.id),
        companyId=str(user.company_id),
        companySetupComplete=True,
    ), 200


# --------------------------------------------------
# Invite employee
# --------------------------------------------------

@app.route("/api/employees/invite", methods=["POST"])
@jwt_required()
def invite_employee():
    data = request.get_json(silent=True) or {}

    inviter_id = get_jwt_identity()
    inviter = db.session.get(User, inviter_id)

    if inviter is None or not inviter.is_active:
        return jsonify(
            error="Account not found or inactive"
        ), 403

    if inviter.company_id is None:
        return jsonify(
            error="Complete company setup first"
        ), 403

    if inviter.role not in ("Owner", "Admin"):
        return jsonify(
            error="You cannot invite employees"
        ), 403

    email = data.get("email", "").strip().lower()
    full_name = data.get("name", "").strip()
    role = data.get("role", "Employee")
    department = data.get("department", "").strip() or None

    if not isinstance(email, str) or not email:
        return jsonify(
            field="email",
            error="Email is required"
        ), 400

    if not isinstance(full_name, str) or not full_name:
        return jsonify(
            field="name",
            error="Name is required"
        ), 400

    if not isinstance(role, str) or role not in ALLOWED_ROLES:
        return jsonify(
            field="role",
            error="Invalid role"
        ), 400

    if department is not None and not isinstance(department, str):
        return jsonify(
            field="department",
            error="Invalid department"
        ), 400

    try:
        email = validate_email(email).normalized
    except EmailNotValidError:
        return jsonify(
            field="email",
            error="Invalid email address"
        ), 400

    parts = full_name.split(maxsplit=1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else ""

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify(
            field="email",
            error="An account with this email already exists"
        ), 409

    now = datetime.now(timezone.utc)

    # Check for an existing pending invitation.
    existing_invite = EmployeeInvitation.query.filter_by(
        company_id=inviter.company_id,
        email=email,
        accepted_at=None,
        revoked_at=None,
    ).first()

    if existing_invite:
        expires_at = normalize_datetime(existing_invite.expires_at)

        if expires_at and expires_at > now:
            return jsonify(
                error="An active invitation already exists"
            ), 409

        # Revoke expired invitations so the new invitation is distinct.
        existing_invite.revoked_at = now

    # Validate category-based spending limits from the modal.
    spending_limits, limit_error = validate_spending_limits(
        data.get("spendingLimits", [])
    )

    if limit_error:
        return jsonify(
            field="spendingLimits",
            error=limit_error
        ), 400

    frontend_url = os.getenv("FRONTEND_URL")

    if not frontend_url:
        app.logger.error("FRONTEND_URL is not configured")

        return jsonify(
            error="Invitation service is not configured"
        ), 500

    if not os.getenv("RESEND_API_KEY"):
        app.logger.error("RESEND_API_KEY is not configured")

        return jsonify(
            error="Invitation email service is not configured"
        ), 500

    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    invitation = EmployeeInvitation(
        company_id=inviter.company_id,
        invited_by_id=inviter.id,
        email=email,
        first_name=first_name,
        last_name=last_name,
        role=role,
        department=department,
        spending_limits=spending_limits,
        token_hash=token_hash,
        expires_at=now + timedelta(hours=24),
    )

    try:
        db.session.add(invitation)
        db.session.flush()

        invite_url = (
            f"{frontend_url.rstrip('/')}"
            f"/accept-invitation?"
            f"{urlencode({'token': raw_token})}"
        )

        invitation_html = f"""
        <html>
          <body>
            <h2>You're invited to Summit!</h2>
            <p>Hi {escape(first_name)},</p>
            <p>
              {escape(inviter.first_name)}
              invited you to join Summit Expense Management.
            </p>
            <p>
              Accept your invitation and set up your account:
            </p>
            <p>
              <a href="{escape(invite_url, quote=True)}">
                Accept invitation
              </a>
            </p>
            <p>
              This invitation expires in 24 hours.
              If you weren't expecting this invitation,
              you can ignore this email.
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
        app.logger.exception(
            "Failed to create or send employee invitation"
        )

        return jsonify(
            error="Unable to send invitation right now"
        ), 500

    return jsonify(
        message="Invitation sent successfully",
        invitationId=str(invitation.id),
    ), 201


if __name__ == "__main__":
    app.run(debug=True, port=5000)
