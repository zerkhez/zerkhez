from flask import Flask, jsonify
from flask_cors import CORS
from app.routes.rice_routes import rice_bp
from app.routes.wheat_routes import wheat_bp
from app.routes.maize_routes import maize_bp
from app.routes.fertilizer_routes import fertilizer_bp
from app.routes.chat_routes import chat_bp
from app.routes.announcements_routes import announcements_bp
from datetime import datetime

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Health check route
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Nitrogen Calculator API is running',
            'timestamp': datetime.utcnow().isoformat(),
            'service': 'nitrogen-backend'
        }), 200

    # Register Blueprints
    app.register_blueprint(rice_bp, url_prefix='/api')
    app.register_blueprint(wheat_bp, url_prefix='/api')
    app.register_blueprint(maize_bp, url_prefix='/api')
    app.register_blueprint(fertilizer_bp, url_prefix='/api')
    app.register_blueprint(chat_bp, url_prefix='/api')
    app.register_blueprint(announcements_bp, url_prefix='/api')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
