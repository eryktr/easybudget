from easybudget.db.db import _build_uri


def test_build_uri():
    assert (
        _build_uri("user", "pass", "server", "testdb")
        == "mongodb://user:pass@server/testdb"
    )
