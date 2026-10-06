import dns.resolver
from urllib.parse import urlparse
import requests
from flask import Flask, jsonify, request
import validators
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

def validate_company_website(url: str):
    """Performs structural, DNS, and live HTTP checks on a business domain."""
    # 1. Structural Validation
    # Cleans input and ensures the URL is syntactically valid
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    if not validators.url(url):
        return {"message": "Invalid URL structure", "passed": False, "code": 400}

    parsed = urlparse(url)
    domain = parsed.netloc

    # Prohibit public email/consumer hosts from registering as company domains
    blocked_domains = {
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "live.com",
        "aol.com",
    }
    if domain.lower() in blocked_domains:
        return {"message": "Public email domains cannot be used as company URLs", "passed": False, "code": 400}

    # 2. DNS MX/A Record Lookup
    # Verifies the domain actually exists and can actively route internet traffic
    try:
        # Check for A (IP) records or MX (Mail) records
        dns.resolver.resolve(domain, "A")
    except (
        dns.resolver.NoAnswer,
        dns.resolver.NXDOMAIN,
        dns.exception.Timeout,
    ):
        try:
            dns.resolver.resolve(domain, "MX")
        except:
            return {"message": "Domain does not exist or has no valid DNS records", "passed": False, "code": 400}

    # 3. Live HTTP Ping Check
    # Ensures the site is live and not a parked/dead domain
    try:
        # Use a short timeout (3s) and a browser User-Agent to avoid getting blocked by Cloudflare
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.head(
            url, headers=headers, timeout=3, allow_redirects=True
        )

        # Fallback to GET if HEAD request is explicitly rejected by the server
        if response.status_code in (404, 405):
            response = requests.get(url, headers=headers, timeout=3)

        if response.status_code >= 400:
            return {"message": "Website returned an error status: " + {response.status_code}, "passed": False, "code": response.status_code}

    except requests.RequestException:
        return {"message": "Failed to connect to the website", "passed": False, "code": 502}

    return {"message": "", "passed": True, "code": 201, "url": url}

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