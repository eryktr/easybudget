from http import HTTPStatus

import easybudget.hashing as hashing
import easybudget.jwt_provider as jwt_provider
from easybudget.db.db import DbService
from itertools import chain


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
    collaborates = db_service.budgets_shared_with(payload['username'])
    return {'budgets': [b.serialize() for b in chain(budgets, collaborates)]}, 200


def create_budget(db_service: DbService, request, jwt_secret: str):
    token = _fetch_token(request)
    payload = jwt_provider.decode(token, jwt_secret)
    if payload is None:
        return {'status': 'Invalid token.'}, HTTPStatus.UNAUTHORIZED

    author = db_service.get_user(payload['username'])
    amount = request.json['amount']
    name = request.json['name']

    budget = db_service.add_budget(name, author, amount)
    return budget.serialize(), 200


def get_budget(db_service: DbService, request, jwt_secret: str):
    token = _fetch_token(request)
    payload = jwt_provider.decode(token, jwt_secret)
    if payload is None:
        return {'status': 'Invalid token.'}, HTTPStatus.UNAUTHORIZED


def patch_budget(db_service: DbService, request, jwt_secret: str):
    token = _fetch_token(request)
    payload = jwt_provider.decode(token, jwt_secret)
    if payload is None:
        return {'status': 'Invalid token.'}, HTTPStatus.UNAUTHORIZED

    budget_id = request.json['budget_id']
    budget = db_service.get_budget(budget_id)
    contributors_nicknames = request.json.get('contributors')

    contributors = [db_service.get_user(nick) for nick in contributors_nicknames]

    if contributors:
        budget.contributors = contributors

    budget.save()
    return budget.serialize()


def _fetch_token(request) -> str:
    return request.headers.get('Authorization').split()[1]
