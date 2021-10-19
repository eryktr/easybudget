from typing import Iterator

from pymodm import connect
from pymongo import MongoClient

from easybudget.db.model import User


class DbService:
    _client: MongoClient

    def __init__(self, user: str, password: str, host: str, db: str) -> None:
        uri = _build_uri(user, password, host, db)
        connect(uri)

    def add_user(self, username: str, pass_sha2: str) -> None:
        User(username, pass_sha2).save()

    def user_exists(self, username: str) -> bool:
        return User.objects.raw({'username': username}).count() > 0

    @property
    def users(self) -> Iterator[User]:
        return User.objects.all()


def _build_uri(user: str, password: str, host: str, db: str) -> str:
    return f'mongodb://{user}:{password}@{host}/{db}'
