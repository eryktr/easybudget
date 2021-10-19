import pytest
from http import HTTPStatus
from easybudget.routes import register


@pytest.fixture
def dummy_db(mocker):
    db = mocker.Mock()

    def fake_user_exists(username):
        return username == 'realUser'

    db.user_exists = fake_user_exists
    return db


def test_register_fails_when_user_exists(dummy_db, mocker):
    request = mocker.Mock(json={'username': 'realUser', 'password': '12345'})

    _, status = register(dummy_db, request)

    assert status == HTTPStatus.ALREADY_REPORTED


def test_register_creates_user_when_username_does_not_exist(dummy_db, mocker):
    request = mocker.Mock(json={'username': 'iDontExist', 'password': '12345'})

    _, status = register(dummy_db, request)

    assert status == HTTPStatus.CREATED
