import easybudget.jwt_provider as jwt_provider
from easybudget.db.db import DbService
from http import HTTPStatus
import easybudget.hashing as hashing
from jwt.exceptions import InvalidSignatureError, DecodeError


def register(db_service: DbService, request) -> tuple[dict, int]:
    username = request.json['username']
    password = request.json['password']

    if db_service.user_exists(username):
        return {'status': 'User exists'}, HTTPStatus.ALREADY_REPORTED
    password_sha = hashing.sha512(password)

    db_service.add_user(username, password_sha)
    return {'status': 'OK'}, HTTPStatus.CREATED


def login(db_service: DbService, request, jwt_secret):
    username = request.json['username']
    password = request.json['password']

    password_sha = hashing.sha512(password)

    if db_service.credentials_ok(username, password_sha):
        token = jwt_provider.get_jwt(username, jwt_secret)
        return {'status': 'OK', 'jwt': token}, HTTPStatus.OK

    return {'status': 'BAD'}, HTTPStatus.NO_CONTENT


def get_users(db_service: DbService) -> dict[str, list]:
    users = list(db_service.users)

    return {'users': [u.serialize() for u in users]}


def get_budgets(db_service: DbService, request, jwt_secret: str) -> tuple[dict, int]:
    token = _fetch_token(request)
    payload = jwt_provider.decode(token, jwt_secret)
    if payload is None:
        return {'status': 'Invalid token'}, HTTPStatus.BAD_REQUEST
    budgets = db_service.budgets_of(payload['username'])
    return {'budgets': [b.serialize() for b in budgets]}, 200


def create_budget(db_service: DbService, request, jwt_secret: str):
    token = _fetch_token(request)
    payload = jwt_provider.decode(token, jwt_secret)
    if payload is None:
        return {'status': 'Invalid token.'}, HTTPStatus.UNAUTHORIZED

    author = db_service.get_user(payload['username'])
    amount = request.json['amount']
    name = request.json['name']

    db_service.add_budget(name, author, amount)
    return {'status': 'OK'}, 200


def _fetch_token(request) -> str:
    return request.headers.get('Authorization').split()[1]
