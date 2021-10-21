import math
from http import HTTPStatus
from typing import Callable, Any

import easybudget.hashing as hashing
import easybudget.jwt_provider as jwt_provider
from easybudget.db.db import DbService

HttpResp = tuple[dict, int]


def require_jwt(f):
    def inner(db, request, jwt_secret):
        token = _fetch_token(request)
        payload = jwt_provider.decode(token, jwt_secret)
        if payload is None:
            return {"status": "Invalid token"}, HTTPStatus.BAD_REQUEST
        request.jwt_payload = payload
        return f(db, request, jwt_secret)

    return inner


def register(db_service: DbService, request) -> HttpResp:
    username = request.json["username"]
    password = request.json["password"]

    if db_service.user_exists(username):
        return {"status": "User exists"}, HTTPStatus.ALREADY_REPORTED
    password_sha = hashing.sha512(password)

    db_service.add_user(username, password_sha)
    return {"status": "OK"}, HTTPStatus.CREATED


def login(db_service: DbService, request, jwt_secret) -> HttpResp:
    username = request.json["username"]
    password = request.json["password"]

    password_sha = hashing.sha512(password)

    if db_service.credentials_ok(username, password_sha):
        token = jwt_provider.get_jwt(username, jwt_secret)
        return {"status": "OK", "jwt": token}, HTTPStatus.OK

    return {"status": "BAD"}, HTTPStatus.NO_CONTENT


def get_users(db_service: DbService) -> HttpResp:
    users = list(db_service.users)

    return {"users": [u.serialize() for u in users]}, HTTPStatus.OK


@require_jwt
def get_budgets(db: DbService, request, jwt_secret: str) -> tuple[dict, int]:
    page = int(request.args.get("page") or 0)
    items_per_page = 3
    type_ = request.args["type"]
    getter: Callable[[str], Any] = (
        db.budgets_of if type_ == "own" else db.budgets_shared_with
    )
    budgets = getter(request.jwt_payload["username"])
    num_pages = math.ceil(budgets.count() / items_per_page)
    data = budgets.skip(page * items_per_page).limit(items_per_page)
    return {
               "budgets": [b.serialize() for b in data],
               "page": page,
               "num_pages": num_pages,
           }, 200


@require_jwt
def create_budget(db: DbService, request, jwt_secret: str) -> HttpResp:
    author = db.get_user(request.jwt_payload["username"])
    amount = request.json["amount"]
    name = request.json["name"]
    contributor_usernames = request.json["contributors"]

    contributors = (
        [db.get_user(username) for username in contributor_usernames]
        if contributor_usernames
        else []
    )

    budget = db.add_budget(name, author, amount, contributors=contributors)
    return budget.serialize(), HTTPStatus.OK


@require_jwt
def patch_budget(db: DbService, request, jwt_secret: str) -> HttpResp:
    budget_id = request.json["budget_id"]
    budget = db.get_budget(budget_id)
    contributors_nicknames = request.json.get("contributors")

    contributors = [db.get_user(nick) for nick in contributors_nicknames]

    if contributors:
        budget.contributors = contributors

    budget.save()
    return budget.serialize(), HTTPStatus.OK


@require_jwt
def delete_budget(db: DbService, request, jwt_secret: str) -> HttpResp:
    budget_id = request.json["budget_id"]
    budget = db.get_budget(budget_id)
    budget.delete()
    return {"id": budget_id}, HTTPStatus.OK


@require_jwt
def add_transaction(db: DbService, request, jwt_secret: str) -> HttpResp:
    owner = db.get_user(request.jwt_payload["username"])
    budget_id = request.json["budget_id"]
    budget = db.get_budget(budget_id)
    type_ = request.json["type"]
    description = request.json["description"]
    amount = request.json["amount"]

    transaction = db.add_transaction(owner, budget, type_, description, amount)

    return transaction.serialize(), HTTPStatus.OK


def _fetch_token(request) -> str:
    return request.headers.get("Authorization").split()[1]
