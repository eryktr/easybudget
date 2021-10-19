import easybudget.hashing as hashing


def test_sha512():
    input_ = '12345'
    expected_sha = (
        '3627909a29c31381a071ec27f7c9ca97'
        '726182aed29a7ddd2e54353322cfb30a'
        'bb9e3a6df2ac2c20fe23436311d678564d'
        '0c8d305930575f60e2d3d048184d79'
    )

    assert hashing.sha512(input_) == expected_sha
