from easybudget.db.db import DbService
from http import HTTPStatus
import hashlib


def register(db_service: DbService, request):
    username = request.json['username']
    password = request.json['password']

    if db_service.user_exists(username):
        return {'status': 'User exists'}, HTTPStatus.BAD_REQUEST
    password_sha = hashlib.sha512(password.encode()).hexdigest()

    db_service.add_user(username, password_sha)
    return {'status': 'OK'}, HTTPStatus.CREATED


def get_users(db_service: DbService):
    users = list(db_service.users)

    return {'users': [{'username': u.username, 'password': u.password_sha2} for u in users]}
