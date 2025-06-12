from flask import Flask, request, jsonify
from models.TmojiModel import convert_to_emojis

app = Flask(__name__)

@app.route('/api/convert-emoji', methods=['POST'])
def convert_text_to_emoji():
    try:
        # Get JSON data from request body
        data = request.get_json()
        
        # Validate input
        if not data or 'text' not in data:
            return jsonify({'error': 'Text field is required in request body'}), 400
        
        input_text = data['text']
        if not input_text or not input_text.strip():
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Convert text to emojis
        emoji_result = convert_to_emojis(input_text)
        
        # Return response
        return jsonify({
            'original_text': input_text,
            'emoji_text': emoji_result,
            'success': True
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500

@app.route('/')
def home():
    return '<h1>Text to Emoji Converter API</h1>'


if __name__ == '__main__':
    app.run(debug=True)