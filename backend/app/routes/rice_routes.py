from flask import Blueprint, request, jsonify
from ..services.rice_service import calculate_rice_fertilizer
import math

rice_bp = Blueprint('rice', __name__)

@rice_bp.route('/calculate_fertilizer/rice', methods=['POST'])
def calculate():
    try:
        # Check inputs
        if 'kaafi_image' not in request.files or 'aam_image' not in request.files:
            return jsonify({"error": "Missing image files (kaafi_image, aam_image)"}), 400
        
        kaafi_file = request.files['kaafi_image']
        aam_file = request.files['aam_image']
        
        variety = request.form.get('variety')
        dat_raw = request.form.get('dat')
        
        try:
            dat = float(dat_raw) # Days After Transplanting
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid or missing DAT (Days After Transplanting)"}), 400
            
        # Explicityly blocking NaN and infinity values
        if not math.isfinite(dat):
            return jsonify({
                "error": "DAT must be a finite numeric value"
            }), 400


        result = calculate_rice_fertilizer(kaafi_file, aam_file, variety, dat)
        return jsonify(result)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
