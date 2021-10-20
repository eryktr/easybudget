import jwt
from jwt.exceptions import InvalidSignatureError, DecodeError


def get_jwt(username: str, secret: str) -> str:
    return jwt.encode({'username': username}, secret)


def decode(token: str, secret: str) -> dict | None:
    try:
        return jwt.decode(token, secret, algorithms=['HS256'])
    except (InvalidSignatureError, DecodeError):
        return None
