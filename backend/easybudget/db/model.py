from pymodm import MongoModel, fields

x = 10
y = 10


class User(MongoModel):
    username = fields.CharField(min_length=3, max_length=20)
    password_sha2 = fields.CharField()

    class Meta:
        cascade = True


class Transaction(MongoModel):
    owner = fields.EmbeddedDocumentField(User)
    type_ = fields.CharField(choices=('INCOME', 'EXPENSE'))
    amount = fields.FloatField(min_value=0)


class Budget(MongoModel):
    author = fields.EmbeddedDocumentField(User)
    amount = fields.FloatField(min_value=0)
    contributors = fields.EmbeddedDocumentListField(User, default=list)
    transactions = fields.EmbeddedDocumentListField(Transaction, default=list)
