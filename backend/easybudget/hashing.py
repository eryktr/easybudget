import hashlib


def sha512(password: str) -> str:
    return hashlib.sha512(password.encode()).hexdigest()
