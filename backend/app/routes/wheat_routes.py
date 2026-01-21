from flask import Blueprint, request, jsonify
from ..services.wheat_service import calculate_wheat_fertilizer

wheat_bp = Blueprint('wheat', __name__)

@wheat_bp.route('/calculate_fertilizer/wheat', methods=['POST'])
def calculate():
    try:
        # Check inputs
        if 'kaafi_image' not in request.files or 'aam_image' not in request.files:
            return jsonify({"error": "Missing image files (kaafi_image, aam_image)"}), 400
        
        kaafi_file = request.files['kaafi_image']
        aam_file = request.files['aam_image']
        
        variety = request.form.get('variety')
        try:
            das = float(request.form.get('dat')) # Days After Sowing (frontend sends 'dat')
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid or missing DAS (Days After Sowing)"}), 400
            
        result = calculate_wheat_fertilizer(kaafi_file, aam_file, variety, das)
        return jsonify(result)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
