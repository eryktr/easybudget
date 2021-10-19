from flask import Flask, request

from easybudget.db.db import DbService
import routes


def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY='dev',
    )
    db_service = DbService('root', 'example', '127.0.0.1', 'admin')

    @app.route('/register', methods=['POST'])
    def register():
        return routes.register(db_service, request)

    @app.route('/users', methods=['GET'])
    def get_users():
        return routes.get_users(db_service)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run()
