from flask import Flask, request, jsonify
from flask_cors import CORS
from extensions import db
from helper import *
from email_validator import validate_email, EmailNotValidError
from models import *

app = Flask(__name__)

# Configure the PostgreSQL connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:your_password@localhost:5432/your_db_name'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database extension
db.init_app(app)

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

    password_hash = hash_password_bcrypt(password)

    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=password_hash
    )
    db.session.add(user)
    db.session.commit()

    return jsonify(message="Signup successful"), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)