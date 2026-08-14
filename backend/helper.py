import bcrypt, requests

# For Signup
def valid_name(name: str) -> bool:
    if not name.isalpha() or len(name) == 0:
        return False
    return True


# returns true if password is 8 - 20 characters long
def valid_password(password: str) -> bool:
    if len(password) < 8 or len(password) > 20:
        return False
    return True

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