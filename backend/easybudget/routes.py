import easybudget.jwt_provider as jwt_provider
from easybudget.db.db import DbService
from http import HTTPStatus
import easybudget.hashing as hashing


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

    return {'users': [{'username': u.username, 'password': u.password_sha2} for u in users]}
