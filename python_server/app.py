# havent fix :(

from flask import Flask
import os
from dotenv import load_dotenv

# load env
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # config
    DATABASE_URL = os.getenv("DATABASE_CONNECTION_STRING")
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # init
    from buildingblocsjune2025.api import initialize_app
    initialize_app(app)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)