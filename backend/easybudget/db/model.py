from pymodm import MongoModel, fields


class User(MongoModel):
    username = fields.CharField(min_length=3, max_length=20)
    password_sha2 = fields.CharField()

    def serialize(self):
        return {
            "id": str(self._id),
            "username": self.username,
            "password": self.password_sha2,
        }


class Transaction(MongoModel):
    owner = fields.EmbeddedDocumentField(User)
    type_ = fields.CharField(choices=("INCOME", "EXPENSE"))
    amount = fields.FloatField(min_value=0)
    description = fields.CharField()

    def serialize(self):
        return {
            "id": str(self._id),
            "owner": self.owner.username,
            "type": self.type_,
            "description": self.description,
            "amount": self.amount,
        }


class Budget(MongoModel):
    name = fields.CharField()
    author = fields.EmbeddedDocumentField(User)
    amount = fields.FloatField(min_value=0)
    contributors = fields.EmbeddedDocumentListField(
        User,
        default=list,
        blank=True
    )
    transactions = fields.EmbeddedDocumentListField(
        Transaction, default=list, blank=True
    )

    def serialize(self):
        return {
            "id": str(self._id),
            "name": self.name,
            "author": self.author.username,
            "amount": self.amount,
            "contributors": [u.username for u in self.contributors],
            "transactions": [t.serialize() for t in self.transactions],
        }
