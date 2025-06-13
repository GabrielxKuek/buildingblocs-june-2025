# # havent fix :(

# from flask import Flask
# import os
# from dotenv import load_dotenv

# # load env
# load_dotenv()

# def create_app():
#     app = Flask(__name__)
    
#     # config
#     DATABASE_URL = os.getenv("DATABASE_CONNECTION_STRING")
#     app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
#     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
#     # init
#     from python_server.api import initialize_app
#     initialize_app(app)
    
#     return app

# if __name__ == '__main__':
#     app = create_app()
#     app.run(debug=True)

# python_server/app.py - Updated with proper CORS and health check

from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from datetime import datetime

# load env
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Enhanced CORS configuration for your frontend
    CORS(app, origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative React dev server
        "http://127.0.0.1:5173",  # Alternative localhost format
        "http://127.0.0.1:3000",  # Alternative localhost format
    ], 
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"], 
    methods=["GET", "POST", "OPTIONS"])
    
    # Add health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint for frontend to verify Python server is running"""
        return jsonify({
            'status': 'healthy',
            'service': 'python-emoji-server',
            'version': '1.0.0',
            'timestamp': datetime.now().isoformat(),
            'message': 'Python server is running properly'
        }), 200

    # Add a simple test endpoint
    @app.route('/test', methods=['GET'])
    def test_endpoint():
        return jsonify({
            'message': 'Python server test endpoint working',
            'timestamp': datetime.now().isoformat()
        }), 200

    # CORS preflight handler
    @app.before_request
    def handle_preflight():
        from flask import request
        if request.method == "OPTIONS":
            response = jsonify({'status': 'OK'})
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add('Access-Control-Allow-Headers', "*")
            response.headers.add('Access-Control-Allow-Methods', "*")
            return response
    
    # config
    DATABASE_URL = os.getenv("DATABASE_CONNECTION_STRING")
    if DATABASE_URL:
        app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize your existing API routes
    try:
        from api import initialize_app
        initialize_app(app)
        print("✅ API routes initialized successfully")
    except ImportError as e:
        print(f"⚠️ Warning: Could not import API routes: {e}")
        # Add a fallback route
        @app.route('/')
        def fallback_home():
            return jsonify({
                'message': 'Python Emoji Server is running',
                'status': 'healthy',
                'endpoints': ['/health', '/test', '/api/convert-emoji']
            })
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("🐍 Starting Python Emoji Server...")
    print("📍 Available endpoints:")
    print("   GET  /health - Health check")
    print("   GET  /test - Test endpoint")
    print("   POST /api/convert-emoji - Convert text to emoji")
    print("🌐 Server will be available at: http://localhost:5000")
    
    # Run with specific host and port for better connectivity
    app.run(
        host='0.0.0.0',  # Allow connections from other machines
        port=5000,
        debug=True,
        threaded=True  # Enable threading for better performance
    )