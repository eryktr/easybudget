from flask import Flask, request
from flask_cors import CORS

from easybudget.db.db import DbService
import easybudget.routes as routes


def create_app():
    app = Flask(__name__)
    CORS(app)
    jwt_secret = 'shouldBeRandomAndKeptSecretInProduction'
    app.config.from_mapping(
        SECRET_KEY='dev',
    )
    DB_HOST = 'mongo'
    db_service = DbService('root', 'example', DB_HOST, 'admin')

    @app.route('/register', methods=['POST'])
    def register():
        return routes.register(db_service, request)

    @app.route('/users', methods=['GET'])
    def get_users():
        return routes.get_users(db_service)

    @app.route('/login', methods=['POST'])
    def login():
        return routes.login(db_service, request, jwt_secret)

    @app.route('/budgets', methods=['GET'])
    def get_budgets():
        return routes.get_budgets(db_service, request, jwt_secret)

    @app.route('/budget', methods=['POST'])
    def create_budget():
        return routes.create_budget(db_service, request, jwt_secret)

    @app.route('/budget', methods=['PATCH', 'DELETE'])
    def patch_budget():
        if request.method == 'PATCH':
            return routes.patch_budget(db_service, request, jwt_secret)
        return routes.delete_budget(db_service, request, jwt_secret)

    @app.route('/budget/<name>', methods=['GET'])
    def get_budget():
        return routes.get_budget(db_service, request, jwt_secret)

    @app.route('/transaction', methods=['POST'])
    def add_transaction():
        return routes.add_transaction(db_service, request, jwt_secret)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run()
