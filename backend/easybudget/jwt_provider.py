import jwt


def get_jwt(username: str, secret: str) -> str:
    return jwt.encode({'username': username}, secret)


def decode(token: str, secret: str) -> dict:
    return jwt.decode(token, secret, algorithms=['HS256'])
