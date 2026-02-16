from flask import Blueprint, request, jsonify
from app.services.fertilizer_service import calculate_fertilizer_package

fertilizer_bp = Blueprint('fertilizer', __name__)

@fertilizer_bp.route('/calculate-fertilizer', methods=['POST'])
def calculate_fertilizer():
    """
    Endpoint to calculate fertilizer requirements.
    Expects JSON body:
    {
        "n": float,
        "p": float,
        "k": float,
        "selected_fertilizers": {
            "Group 1": str,
            "Group 2": str,
            "Group 3": str
        }
    }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    try:
        n_req = float(data.get('n', 0))
        p_req = float(data.get('p', 0))
        k_req = float(data.get('k', 0))
        selected_fertilizers = data.get('selected_fertilizers', {})
        
        # Validation for required selections
        if not selected_fertilizers or len(selected_fertilizers) < 3:
             return jsonify({
                 "error": "Please select one fertilizer from each of the three groups."
             }), 400

        result = calculate_fertilizer_package(n_req, p_req, k_req, selected_fertilizers)
        return jsonify(result), 200
        
    except ValueError as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@fertilizer_bp.route('/fertilizer-info', methods=['GET'])
def get_fertilizer_info():
    """Returns the list of available fertilizers by group."""
    from app.services.fertilizer_service import FERTILIZERS
    return jsonify(FERTILIZERS), 200
