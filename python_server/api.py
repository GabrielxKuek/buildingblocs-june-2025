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
from controllers.emojiController import convert_text_to_emoji
# from controllers.classificationController import load_word_vectors, match_category, list_categories, download_word2vec_model

app = Flask(__name__)

# default api route
@app.route('/')
def home():
    return '<h1>API is Running</h1>'

# text to emoji route
@app.route('/api/convert-emoji', methods=['POST'])
def convert_text_to_emoji_route():
    try:
        # Get JSON data from request body
        data = request.get_json()
        
        # Validate input
        if not data or 'text' not in data:
            return jsonify({'error': 'Text field is required in request body'}), 400
        
        output = convert_text_to_emoji(data)
        return output
        
    except Exception as e:
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500

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

# For standalone testing
if __name__ == '__main__':
    # download_word2vec_model()
    # load_word_vectors()
    app.run(debug=True)