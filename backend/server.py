from flask import Flask, request, jsonify
from flask_cors import CORS
from helper import *
from email_validator import validate_email, EmailNotValidError

app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"]
)

# To nuke old Flask servers: kill -9 $(lsof -t -i :5000)

@app.route('/api/signup', methods=['POST', 'OPTIONS'])
def new_user():

    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json()

    first_name = data["firstName"].strip()
    last_name = data["lastName"].strip()
    email = data["email"].strip().lower()
    password = data["password"]
    confirmed_password = data["confirmedPassword"]

    if not valid_name(first_name) and not len(first_name):
        return jsonify(field="firstName", error="First name cannot be empty or contain spaces"), 400
    elif not valid_name(first_name) and not first_name.isalpha():
        return jsonify(field="firstName", error="First name cannot have numbers"), 400
    if not valid_name(last_name) and not len(last_name):
        return jsonify(field="lastName", error="Last name cannot be empty or contain spaces"), 400
    elif not valid_name(last_name) and not last_name.isalpha():
        return jsonify(field="lastName", error="Last name cannot have numbers"), 400
    elif not valid_password(password):
        return jsonify(field="password", error="Passwords must be between 8 and 20 characters long"), 400
    elif confirmed_password != password:
        return jsonify(field="confirmedPassword", error="Passwords do not match"), 400

    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify(field="email", error="Email not formatted correctly"), 400

    hash_password_bcrypt(password)
    return jsonify(message="Signup successful"), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)