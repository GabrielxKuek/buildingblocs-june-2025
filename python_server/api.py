# from flask import Flask, request, jsonify
# from controllers.emojiController import convert_text_to_emoji
# from controllers.classificationController import load_word_vectors, match_category, list_categories, download_word2vec_model

# app = Flask(__name__)

# # default api route
# @app.route('/')
# def home():
#     return '<h1>API is Running</h1>'

# # text to emoji route
# @app.route('/api/convert-emoji', methods=['POST'])
# def convert_text_to_emoji_route():
#     try:
#         # Get JSON data from request body
#         data = request.get_json()
        
#         # Validate input
#         if not data or 'text' not in data:
#             return jsonify({'error': 'Text field is required in request body'}), 400
        
#         output = convert_text_to_emoji(data)
#         return output
        
#     except Exception as e:
#         return jsonify({'error': f'Processing failed: {str(e)}'}), 500

# # text classification route
# @app.route('/api/match', methods=['GET'])
# def match_category_route():
#     try:
#         phrase = request.args.get("q", "").strip()

#         if not phrase:
#             return jsonify({"error": "Missing 'q' query parameter"}), 400
        
#         output = match_category(phrase)

#         return output
        
#     except Exception as e:
#         return jsonify({'error': f'Processing failed: {str(e)}'}), 500

# @app.route('/api/categories')
# def list_categories_route():
#     try:
#         output = list_categories()

#         return output

#     except Exception as e:
#         return jsonify({'error': f'Processing failed: {str(e)}'}), 500

# if __name__ == '__main__':
#     download_word2vec_model()
#     load_word_vectors()
#     app.run(debug=True)

# python_server/api.py - Updated with better error handling and CORS

from flask import Flask, request, jsonify
from flask_cors import cross_origin
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def initialize_app(app):
    """Initialize the Flask app with routes"""
    
    # Import controllers
    try:
        from controllers.emojiController import convert_text_to_emoji
        from controllers.classificationController import load_word_vectors, match_category, list_categories, download_word2vec_model
        logger.info("✅ Controllers imported successfully")
    except ImportError as e:
        logger.error(f"❌ Error importing controllers: {e}")
        
        # Fallback function if controllers fail to import
        def convert_text_to_emoji(data):
            text = data.get('text', '')
            # Simple fallback emoji conversion
            simple_emojis = {
                'hello': '👋', 'hi': '👋', 'help': '🆘', 'water': '💧', 
                'food': '🍽️', 'pain': '😣', 'medicine': '💊', 'bathroom': '🚽'
            }
            words = text.lower().split()
            emoji_result = ' '.join([simple_emojis.get(word, word) for word in words])
            return jsonify({
                'original_text': text,
                'emoji_text': emoji_result,
                'success': True,
                'note': 'Using fallback emoji conversion'
            }), 200

    # Default home route
    @app.route('/')
    @cross_origin()
    def home():
        return jsonify({
            'message': 'Python Emoji API is Running',
            'version': '1.0.0',
            'timestamp': datetime.now().isoformat(),
            'endpoints': {
                'health': 'GET /health',
                'emoji_conversion': 'POST /api/convert-emoji',
                'text_classification': 'GET /api/match?q=<text>',
                'categories': 'GET /api/categories'
            }
        })

    # Enhanced emoji conversion route with better error handling
    @app.route('/api/convert-emoji', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def convert_text_to_emoji_route():
        try:
            # Handle preflight requests
            if request.method == 'OPTIONS':
                return '', 200
                
            # Log the incoming request
            logger.info(f"📥 Received emoji conversion request from {request.remote_addr}")
            
            # Get JSON data from request body
            data = request.get_json()
            
            # Validate input
            if not data:
                logger.warning("❌ No JSON data in request")
                return jsonify({
                    'error': 'No JSON data provided',
                    'success': False,
                    'help': 'Send JSON with {"text": "your text here"}'
                }), 400
                
            if 'text' not in data:
                logger.warning("❌ Missing 'text' field in request")
                return jsonify({
                    'error': 'Missing required field: text',
                    'success': False,
                    'received_fields': list(data.keys()) if data else [],
                    'help': 'Send JSON with {"text": "your text here"}'
                }), 400
            
            text = data['text']
            if not isinstance(text, str):
                return jsonify({
                    'error': 'Text field must be a string',
                    'success': False,
                    'received_type': type(text).__name__
                }), 400
                
            if not text.strip():
                logger.warning("❌ Empty text provided")
                return jsonify({
                    'error': 'Text cannot be empty',
                    'success': False
                }), 400
            
            logger.info(f"🔄 Converting text: '{text}'")
            
            # Call the emoji conversion function
            output = convert_text_to_emoji(data)
            
            logger.info(f"✅ Conversion successful")
            return output
            
        except Exception as e:
            logger.error(f"❌ Error in emoji conversion: {str(e)}")
            return jsonify({
                'error': f'Processing failed: {str(e)}',
                'success': False,
                'timestamp': datetime.now().isoformat()
            }), 500

    # Text classification route (if available)
    @app.route('/api/match', methods=['GET'])
    @cross_origin()
    def match_category_route():
        try:
            phrase = request.args.get("q", "").strip()

            if not phrase:
                return jsonify({
                    "error": "Missing 'q' query parameter",
                    "success": False,
                    "help": "Use: /api/match?q=your_text_here"
                }), 400
            
            logger.info(f"🔍 Matching category for: '{phrase}'")
            output = match_category(phrase)
            return output
            
        except Exception as e:
            logger.error(f"❌ Error in category matching: {str(e)}")
            return jsonify({
                'error': f'Processing failed: {str(e)}',
                'success': False
            }), 500

    # Categories listing route (if available)
    @app.route('/api/categories', methods=['GET'])
    @cross_origin()
    def list_categories_route():
        try:
            logger.info("📋 Listing categories")
            output = list_categories()
            return output

        except Exception as e:
            logger.error(f"❌ Error listing categories: {str(e)}")
            return jsonify({
                'error': f'Processing failed: {str(e)}',
                'success': False
            }), 500

    # Initialize word vectors if available
    try:
        logger.info("🔄 Initializing word vectors...")
        download_word2vec_model()
        load_word_vectors()
        logger.info("✅ Word vectors loaded successfully")
    except Exception as e:
        logger.warning(f"⚠️ Word vectors not available: {e}")

    logger.info("🚀 API routes initialized successfully")

# For standalone testing
if __name__ == '__main__':
    app = Flask(__name__)
    initialize_app(app)
    
    print("🐍 Starting Python API server in standalone mode...")
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )