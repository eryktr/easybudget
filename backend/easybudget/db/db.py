from typing import Iterator

from pymodm import connect
from pymongo import MongoClient

from easybudget.db.model import User


class DbService:
    _client: MongoClient

    def __init__(self, user: str, password: str, host: str, db: str) -> None:
        uri = f'mongodb://{user}:{password}@{host}/{db}'
        connect(uri)

    @property
    def users(self) -> Iterator[User]:
        return User.objects.all()
