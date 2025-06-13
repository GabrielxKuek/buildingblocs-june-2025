# from flask import Flask, request, jsonify
# from models.TmojiModel import convert_to_emojis

# app = Flask(__name__)

# def convert_text_to_emoji(data):
#     try:        
#         # Validate input
#         if not data or 'text' not in data:
#             return jsonify({'error': 'Text field is required in request body'}), 400
        
#         input_text = data['text']
#         if not input_text or not input_text.strip():
#             return jsonify({'error': 'Text cannot be empty'}), 400
        
#         # Convert text to emojis
#         emoji_result = convert_to_emojis(input_text)
        
#         # Return response
#         return jsonify({
#             'original_text': input_text,
#             'emoji_text': emoji_result,
#             'success': True
#         }), 200
        
#     except Exception as e:
#         return jsonify({'error': f'Processing failed: {str(e)}'}), 500

# @app.route('/')
# def home():
#     return '<h1>Text to Emoji Converter API</h1>'


# if __name__ == '__main__':
#     app.run(debug=True)

# python_server/controllers/emojiController.py - Updated with better error handling

from flask import Flask, request, jsonify
import logging
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

def convert_text_to_emoji(data):
    """
    Convert text to emoji representation using the TmojiModel
    """
    try:
        logger.info(f"🔄 Starting emoji conversion process")
        
        # Validate input data
        if not data or not isinstance(data, dict):
            logger.error("❌ Invalid data format - expected dictionary")
            return jsonify({
                'error': 'Invalid data format - expected JSON object',
                'success': False,
                'received_type': type(data).__name__
            }), 400
        
        if 'text' not in data:
            logger.error("❌ Missing 'text' field")
            return jsonify({
                'error': 'Text field is required in request body',
                'success': False,
                'received_fields': list(data.keys())
            }), 400
        
        input_text = data['text']
        
        # Validate text content
        if not input_text or not isinstance(input_text, str):
            logger.error(f"❌ Invalid text content: {type(input_text)}")
            return jsonify({
                'error': 'Text must be a non-empty string',
                'success': False,
                'received_type': type(input_text).__name__
            }), 400
            
        if not input_text.strip():
            logger.error("❌ Empty text after stripping")
            return jsonify({
                'error': 'Text cannot be empty or only whitespace',
                'success': False
            }), 400
        
        logger.info(f"📝 Processing text: '{input_text}'")
        
        # Import and use the TmojiModel
        try:
            from models.TmojiModel import convert_to_emojis
            logger.info("✅ TmojiModel imported successfully")
            
            # Convert text to emojis
            emoji_result = convert_to_emojis(input_text.strip())
            logger.info(f"✅ Conversion successful: '{emoji_result}'")
            
        except ImportError as e:
            logger.error(f"❌ Failed to import TmojiModel: {e}")
            # Fallback emoji conversion
            emoji_result = simple_emoji_fallback(input_text)
            logger.warning(f"⚠️ Using fallback conversion: '{emoji_result}'")
            
        except Exception as e:
            logger.error(f"❌ Error in TmojiModel conversion: {e}")
            # Fallback emoji conversion
            emoji_result = simple_emoji_fallback(input_text)
            logger.warning(f"⚠️ Using fallback conversion: '{emoji_result}'")
        
        # Return successful response
        response_data = {
            'original_text': input_text,
            'emoji_text': emoji_result,
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'processing_info': {
                'input_length': len(input_text),
                'output_length': len(emoji_result),
                'word_count': len(input_text.split())
            }
        }
        
        logger.info(f"📤 Returning successful response")
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"❌ Unexpected error in convert_text_to_emoji: {str(e)}")
        return jsonify({
            'error': f'Processing failed: {str(e)}',
            'success': False,
            'timestamp': datetime.now().isoformat()
        }), 500

def simple_emoji_fallback(text):
    """
    Simple fallback emoji conversion for when TmojiModel fails
    """
    logger.info("🔄 Using simple emoji fallback")
    
    # Basic emoji mappings for common words
    simple_mappings = {
        # Greetings
        'hello': '👋', 'hi': '👋', 'hey': '👋', 'goodbye': '👋',
        
        # Basic needs
        'help': '🆘', 'water': '💧', 'food': '🍽️', 'eat': '🍽️', 'drink': '🥤',
        'bathroom': '🚻', 'toilet': '🚽', 'sleep': '😴', 'tired': '😴',
        
        # Medical
        'pain': '😣', 'hurt': '🤕', 'medicine': '💊', 'doctor': '👨‍⚕️', 'nurse': '👩‍⚕️',
        'hospital': '🏥', 'sick': '🤒',
        
        # Emotions
        'happy': '😊', 'sad': '😢', 'angry': '😠', 'love': '❤️', 'scared': '😨',
        'worried': '😟', 'good': '👍', 'bad': '👎',
        
        # Questions and responses
        'yes': '✅', 'no': '❌', 'please': '🙏', 'thank': '🙏', 'sorry': '😔',
        
        # Time
        'morning': '🌅', 'afternoon': '☀️', 'evening': '🌇', 'night': '🌙',
        'today': '📅', 'tomorrow': '📅',
        
        # Family
        'family': '👪', 'mom': '👩', 'dad': '👨', 'son': '👦', 'daughter': '👧',
        
        # Actions
        'go': '➡️', 'come': '⬅️', 'sit': '🪑', 'stand': '🧍', 'walk': '🚶',
        'call': '📞', 'visit': '👋',
        
        # Questions
        'what': '❓', 'how': '❓', 'where': '❓', 'when': '❓', 'who': '❓', 'why': '❓'
    }
    
    # Convert text to lowercase and split into words
    words = text.lower().split()
    emoji_words = []
    
    for word in words:
        # Remove punctuation from word
        clean_word = ''.join(char for char in word if char.isalpha())
        
        # Look for emoji mapping
        if clean_word in simple_mappings:
            emoji_words.append(simple_mappings[clean_word])
        else:
            # Keep original word if no mapping found
            emoji_words.append(word)
    
    result = ' '.join(emoji_words)
    logger.info(f"🔄 Fallback conversion complete: '{result}'")
    return result

# For testing the controller standalone
if __name__ == '__main__':
    app = Flask(__name__)
    
    @app.route('/')
    def home():
        return '<h1>Emoji Controller Test</h1>'
    
    @app.route('/test', methods=['POST'])
    def test_conversion():
        data = request.get_json()
        return convert_text_to_emoji(data)
    
    logging.basicConfig(level=logging.INFO)
    logger.info("🧪 Starting emoji controller test server...")
    app.run(debug=True, port=5001)