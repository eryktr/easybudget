from easybudget.db.db import DbService
from http import HTTPStatus
import hashing


def register(db_service: DbService, request) -> tuple[dict, int]:
    username = request.json['username']
    password = request.json['password']

    if db_service.user_exists(username):
        return {'status': 'User exists'}, HTTPStatus.BAD_REQUEST
    password_sha = hashing.sha512(password)

    db_service.add_user(username, password_sha)
    return {'status': 'OK'}, HTTPStatus.CREATED


def login(db_service: DbService, request):
    username = request.json['username']
    password = request.json['password']

    password_sha = hashing.sha512(password)

    if db_service.credentials_ok(username, password_sha):
        import os
        return {'status': 'OK', }, HTTPStatus.OK

    return {'status': 'BAD'}, HTTPStatus.BAD_REQUEST


def get_users(db_service: DbService) -> dict[str, list]:
    users = list(db_service.users)

    return {'users': [{'username': u.username, 'password': u.password_sha2} for u in users]}
