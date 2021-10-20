from easybudget.db.model import User, Budget, Transaction


def test_user_serialize():
    user = User('theUsername', 'thePassSha')
    user._id = 15

    assert user.serialize() == {'id': '15', 'username': 'theUsername', 'password': 'thePassSha'}


def test_budget_serialize():
    u1 = User('un1', 'pass1')
    u2 = User('u2', 'pass2')
    u3 = User('u3', 'pass3')
    t = Transaction(
        owner=u1,
        type_='EXPENSE',
        description='Fuel',
        amount=6.55,
    )
    t._id = 3
    budget = Budget(name='budgetName', author=u1, amount=500, contributors=[u2, u3], transactions=[t])
    budget._id = 2

    assert budget.serialize() == {
        'id': '2',
        'name': 'budgetName',
        'author': 'un1',
        'amount': 500.0,
        'contributors': [
            'u2',
            'u3'
        ],
        'transactions': [
            {
                'id': '3',
                'owner': 'un1',
                'type': 'EXPENSE',
                'description': 'Fuel',
                'amount': 6.55,
            }
        ]
    }
