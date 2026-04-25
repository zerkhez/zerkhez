from flask import Blueprint, request, jsonify
from app.services.chat_service import get_chat_response

chat_bp = Blueprint('chat', __name__)

def _detect_instruction_intent(message: str, language: str) -> dict:
    """
    Detect if the user is asking about instructions and suggest relevant page.
    Returns dict with 'action' and 'label' if detected, empty dict otherwise.
    """
    message_lower = message.lower()
    message_ur = message  # For Urdu detection

    # Video tutorials page
    if any(word in message_lower for word in ['video', 'tutorial', 'watch', 'disease identification', 'how to use app', 'use app']):
        return {
            'type': 'navigation',
            'target': '/instructions',
            'label': 'View Video Tutorials' if language == 'en' else 'ویڈیو ٹیوٹوریلز دیکھیں'
        }

    # Image capture tutorial
    if any(word in message_lower for word in ['capture', 'photo', 'picture', 'image', 'how to take']):
        return {
            'type': 'navigation',
            'target': '/video-tutorial',
            'label': 'How to Capture Images' if language == 'en' else 'تصویریں کیسے لیں'
        }

    # Nitrogen plot instructions
    if any(word in message_lower for word in ['nitrogen plot', 'sufficient', 'plot setup', 'instruction']):
        return {
            'type': 'navigation',
            'target': '/instruction-nitrogen',
            'label': 'Nitrogen Plot Instructions' if language == 'en' else 'نائٹروجن پلاٹ کی ہدایات'
        }

    # Urdu-specific checks
    if 'ویڈیو' in message_ur or 'سکھ' in message_ur or 'طریقہ' in message_ur:
        return {
            'type': 'navigation',
            'target': '/instructions',
            'label': 'ویڈیو ٹیوٹوریلز دیکھیں'
        }

    if 'تصویر' in message_ur or 'فوٹو' in message_ur:
        return {
            'type': 'navigation',
            'target': '/video-tutorial',
            'label': 'تصویریں کیسے لیں'
        }

    if 'نائٹروجن' in message_ur and 'پلاٹ' in message_ur:
        return {
            'type': 'navigation',
            'target': '/instruction-nitrogen',
            'label': 'نائٹروجن پلاٹ کی ہدایات'
        }

    return {}


@chat_bp.route('/chat', methods=['POST'])
def chat():
    """
    Chat endpoint for Kisan Dost chatbot.

    Request JSON:
    {
        "message": str (required),
        "history": [{"role": "user" | "assistant", "content": str}] (optional, default []),
        "language": str (optional, "en" or "ur", default auto-detect)
    }

    Response JSON:
    {
        "response": str,
        "action": {
            "type": "navigation",
            "target": str,
            "label": str
        } (optional)
    }

    Error responses:
    - 400: Missing 'message' field
    - 500: Groq API error or other server error
    """
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({"error": "message field is required"}), 400

        message = data.get('message', '').strip()
        if not message:
            return jsonify({"error": "message cannot be empty"}), 400

        history = data.get('history', [])
        if not isinstance(history, list):
            return jsonify({"error": "history must be a list"}), 400

        language = data.get('language', None)  # Will auto-detect if not provided

        response_text = get_chat_response(message, history, language)

        # Detect if user is asking about instructions
        action = _detect_instruction_intent(message, language or 'en')

        response_data = {"response": response_text}
        if action:
            response_data["action"] = action

        return jsonify(response_data), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"Chatbot error: {str(e)}"}), 500
