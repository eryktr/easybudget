from typing import Iterator

from pymodm import connect
from pymongo import MongoClient

from easybudget.db.model import User, Budget
from bson.objectid import ObjectId


class DbService:
    _client: MongoClient

    def __init__(self, user: str, password: str, host: str, db: str) -> None:
        uri = _build_uri(user, password, host, db)
        connect(uri)

    def add_user(self, username: str, pass_sha: str) -> None:
        User(username, pass_sha).save()

    def add_budget(self, name: str, author: str, amount: float, contributors=None) -> Budget:
        if not contributors:
            return Budget(name, author, amount).save()
        return Budget(name, author, amount, contributors=contributors).save()

    def user_exists(self, username: str) -> bool:
        return User.objects.raw({'username': username}).count() > 0

    def credentials_ok(self, username: str, pass_sha: str) -> bool:
        return User.objects.raw({
            'username': username,
            'password_sha2': pass_sha,
        }).count() > 0

    def budgets_of(self, username: str) -> Iterator[Budget]:
        return Budget.objects.raw({'author.username': username})

    def budgets_shared_with(self, username: str) -> Iterator[Budget]:
        return Budget.objects.raw({'contributors': {'$elemMatch': {'username': username}}})

    def get_user(self, username: str) -> User:
        return User.objects.raw({'username': username}).first()

    def get_budget(self, budget_id: str) -> Budget:
        return Budget.objects.raw({'_id': ObjectId(budget_id)}).first()

    @property
    def users(self) -> Iterator[User]:
        return User.objects.all()


def _build_uri(user: str, password: str, host: str, db: str) -> str:
    return f'mongodb://{user}:{password}@{host}/{db}'
