from easybudget.db.model import User


def test_user_serialize():
    user = User('theUsername', 'thePassSha')

    assert user.serialize() == {'username': 'theUsername', 'password': 'thePassSha'}