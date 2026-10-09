from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from extensions import db
import os
from dotenv import load_dotenv
from email_validator import validate_email, EmailNotValidError
from models import *
from helpers.validation_helpers import *
from helpers.card_helpers import create_employee_card

load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
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
        return jsonify(field="email",error="Email cannot be empty"), 400

    if not password:
        return jsonify(field="password", error="Password cannot be empty"), 400

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify(error="Invalid email or password"), 401

    if not verify_password_bcrypt(user.password_hash, password):
        return jsonify(error="Invalid email or password"), 401

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

    return jsonify(message="Dashboard access granted", userId=user.id, companySetupComplete=user.company_id is not None), 200

with app.app_context():
    db.drop_all()
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)