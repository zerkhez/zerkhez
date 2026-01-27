from flask import Blueprint, request, jsonify
from ..services.maize_service import calculate_maize_fertilizer

maize_bp = Blueprint('maize', __name__)

@maize_bp.route('/calculate_fertilizer/maize', methods=['POST'])
def calculate():
    try:
        # Check inputs
        if 'kaafi_image' not in request.files or 'aam_image' not in request.files:
            return jsonify({"error": "Missing image files (kaafi_image, aam_image)"}), 400
        
        kaafi_file = request.files['kaafi_image']
        aam_file = request.files['aam_image']
        
        variety = request.form.get('variety')
        if not variety:
            return jsonify({"error": "Missing 'variety' field (common or hybrid)"}), 400
            
        result = calculate_maize_fertilizer(kaafi_file, aam_file, variety)
        return jsonify(result)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
