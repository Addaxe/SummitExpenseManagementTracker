import bcrypt

# For Signup
def valid_name(position: str, name: str) -> bool:
    if not name.isalpha():
        return {"message": position + " name cannot contain numbers or spaces", "passed": False, "code": 400}
    elif not name:
            return {"message": position + " name cannot be empty", "passed": False, "code": 400}

    return {"message": "", "passed": True, "code": 200}

# NOTE: Returns true if password is 8 - 20 characters long
def valid_password(password: str) -> bool:
    if len(password) < 8 or len(password) > 20:
        return {"message": "Passwords must be between 8 and 20 characters long", "passed": False, "code": 400}
    return {"message": "", "passed": True, "code": 200}

def hash_password_bcrypt(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_bytes.decode('utf-8')

# For Login
def verify_password_bcrypt(stored_hash: str, provided_password: str) -> bool:
    password_bytes = provided_password.encode('utf-8')
    hash_bytes = stored_hash.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hash_bytes)