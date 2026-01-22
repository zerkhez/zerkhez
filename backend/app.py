from flask import Flask
from flask_cors import CORS
from app.routes.rice_routes import rice_bp
from app.routes.wheat_routes import wheat_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(rice_bp, url_prefix='/api')
    app.register_blueprint(wheat_bp, url_prefix='/api')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
