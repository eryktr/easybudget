import easybudget.jwt_provider as jwt_provider


def test_properly_decodes_jwt_produced_with_same_secret():
    secret = "12345"
    username = "user"

    token = jwt_provider.get_jwt(username, secret)
    payload = jwt_provider.decode(token, secret)

    assert payload == {"username": "user"}


def test_verification_fails_when_used_invalid_secret():
    secret = "12345"
    bad_secret = "ab"
    username = "user"

    token = jwt_provider.get_jwt(username, secret)
    payload = jwt_provider.decode(token, bad_secret)

    assert payload is None


def test_verification_fails_with_invalid_token():
    assert jwt_provider.decode("invalidtoken", "nonsense") is None
