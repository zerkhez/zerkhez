from flask import Flask, request, jsonify
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

# Rice Variety Data: (Formula Logic, Slope M, Intercept C)
# Formula Logic keys: 'R+B', '2G-B-R', 'G/R', '(G-B)/(R+G+B)', 'R-G', 'B'
# We will implement a helper to calculate GI based on these keys.

VARIETY_PARAMS = {
    "Sona super Basmati": {"formula": "R+B", "m": -0.0026, "c": 1.1418},
    "Kisan Basmati": {"formula": "2G-B-R", "m": 0.0038, "c": 0.26},
    "Super Basmati": {"formula": "G/R", "m": 1.1652, "c": -0.9624},
    "Basmati 515": {"formula": "(G-B)/(R+G+B)", "m": 1.3994, "c": 0.397},
    "PK 1121 Aromatic": {"formula": "R-G", "m": -0.0084, "c": 0.3879},
    "Pk 2021 Aromatic": {"formula": "B", "m": -0.0065, "c": 1.2172}
}

def process_image(image_file):
    """
    Process image to find Green Pixels (GP), Total Pixels (TP), and mean RGB of Green Pixels.
    Green Pixel Condition: G > R and G > B
    """
    img = Image.open(image_file).convert('RGB')
    img_arr = np.array(img)
    
    # Extract channels
    R = img_arr[:, :, 0]
    G = img_arr[:, :, 1]
    B = img_arr[:, :, 2]
    
    # Mask for green pixels
    # Note: Using > (strictly greater) as per common simple heuristics, or >=? 
    # Usually strictly greater avoids grayscale where R=G=B.
    mask = (G > R) & (G > B)
    
    green_pixels = img_arr[mask]
    
    GP = len(green_pixels)
    TP = img_arr.shape[0] * img_arr.shape[1]
    
    if GP == 0:
        return 0, TP, 0, 0, 0 # Avoid division by zero later
        
    # Mean RGB of green pixels
    mean_R = np.mean(green_pixels[:, 0])
    mean_G = np.mean(green_pixels[:, 1])
    mean_B = np.mean(green_pixels[:, 2])
    
    return GP, TP, mean_R, mean_G, mean_B

def calculate_gi(formula_type, R, G, B):
    """
    Calculate Green Index based on formula type and mean RGB values.
    """
    try:
        if formula_type == "R+B":
            return R + B
        elif formula_type == "2G-B-R":
            return (2 * G) - B - R
        elif formula_type == "G/R":
            return G / R if R != 0 else 0
        elif formula_type == "(G-B)/(R+G+B)":
            denominator = (R + G + B)
            return (G - B) / denominator if denominator != 0 else 0
        elif formula_type == "R-G":
            return R - G
        elif formula_type == "B":
            return B
        else:
            return 0
    except Exception as e:
        print(f"Error calculating GI: {e}")
        return 0

@app.route('/calculate_fertilizer', methods=['POST'])
def calculate_fertilizer():
    try:
        # Check inputs
        if 'kaafi_image' not in request.files or 'aam_image' not in request.files:
            return jsonify({"error": "Missing image files (kaafi_image, aam_image)"}), 400
        
        kaafi_file = request.files['kaafi_image']
        aam_file = request.files['aam_image']
        
        variety = request.form.get('variety')
        try:
            dat = float(request.form.get('dat')) # Days After Transplanting
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid or missing DAT (Days After Transplanting)"}), 400

        if variety not in VARIETY_PARAMS:
            return jsonify({"error": f"Unknown variety: {variety}. Available: {list(VARIETY_PARAMS.keys())}"}), 400
            
        params = VARIETY_PARAMS[variety]
        
        # 1. Process Images
        # Kaafi / Non-limiting
        gp_nl, tp_nl, r_nl, g_nl, b_nl = process_image(kaafi_file)
        ratio_nl = gp_nl / tp_nl if tp_nl > 0 else 0
        
        # Aam / Test
        gp_t, tp_t, r_t, g_t, b_t = process_image(aam_file)
        ratio_t = gp_t / tp_t if tp_t > 0 else 0
        
        # 2. Calculate GI
        gi_nl = calculate_gi(params['formula'], r_nl, g_nl, b_nl)
        gi_t = calculate_gi(params['formula'], r_t, g_t, b_t)
        
        # 3. Calculate NDVI
        # x = GI * (GP/TP)
        x_nl = gi_nl * ratio_nl
        x_t = gi_t * ratio_t
        
        # y = mx + c
        ndvi_nl = (params['m'] * x_nl) + params['c']
        ndvi_t = (params['m'] * x_t) + params['c']
        
        # 4. Calculate IEY (In-season Estimation of Yield)
        # IEY = NDVIt / DAT
        if dat == 0:
             return jsonify({"error": "DAT cannot be zero"}), 400
        iey = ndvi_t / dat
        
        # 5. Calculate PYP (Potential Yield in t/ha)
        # PYP = 76.05*(IEY)^0.8845 + 34.97*(IEY)^0.669 + 23.97*(IEY)^0.5558
        # Using abs(iey) just in case to avoid complex numbers if extrapolation goes negative, 
        # though yield shouldn't be negative.
        iey_safe = max(0, iey) 
        pyp_t_ha = (76.05 * (iey_safe ** 0.8845)) + \
                   (34.97 * (iey_safe ** 0.669)) + \
                   (23.97 * (iey_safe ** 0.5558))
                   
        pyp_kg_ha = pyp_t_ha * 1000
        
        # 6. Calculate RI (Response Index)
        # RI = NDVInl / NDVIt
        if ndvi_t == 0:
            ri = 0 # Handle division by zero
        else:
            ri = ndvi_nl / ndvi_t
            
        # 7. Calculate PYPN
        pypn_kg_ha = pyp_kg_ha * ri
        
        # 8. Calculate N rate (kg/ha)
        # N rate = (PYPN - PYP) * 1.2 / (100 * 0.5)
        # (100 * 0.5) = 50
        n_rate_kg_ha = ((pypn_kg_ha - pyp_kg_ha) * 1.2) / 50.0
        
        # 9. Calculate Fertilizer Doses (kg/acre)
        # First convert N rate to fertilizer amount (kg/ha), then to kg/acre
        # 1 ha = 2.47105 acres => kg/acre = kg/ha / 2.47105
        
        # Urea (46% N) -> User Formula: N * 100 / 46
        urea_kg_ha = n_rate_kg_ha * 100 / 46
        urea_kg_acre = urea_kg_ha / 2.47105
        
        # CAN (26% N) -> User Formula: N * 100 / 26
        can_kg_ha = n_rate_kg_ha * 100 / 26
        can_kg_acre = can_kg_ha / 2.47105
        
        # Ammonium Sulfate (21% N) -> User Formula: N * 100 / 21
        amm_sulf_kg_ha = n_rate_kg_ha * 100 / 21
        amm_sulf_kg_acre = amm_sulf_kg_ha / 2.47105
        
        # 10. Prepare Response
        response = {
            "inputs": {
                "variety": variety,
                "dat": dat,
                "kaafi_stats": {
                    "total_pixels": int(tp_nl),
                    "green_pixels": int(gp_nl),
                    "ratio": float(ratio_nl),
                    "mean_rgb": [float(r_nl), float(g_nl), float(b_nl)]
                },
                "aam_stats": {
                    "total_pixels": int(tp_t),
                    "green_pixels": int(gp_t),
                    "ratio": float(ratio_t),
                    "mean_rgb": [float(r_t), float(g_t), float(b_t)]
                }
            },
            "calculations": {
                "GI_nl": float(gi_nl),
                "GI_t": float(gi_t),
                "NDVI_nl": float(ndvi_nl),
                "NDVI_t": float(ndvi_t),
                "IEY": float(iey),
                "PYP_t_ha": float(pyp_t_ha),
                "PYP_kg_ha": float(pyp_kg_ha),
                "RI": float(ri),
                "PYPN_kg_ha": float(pypn_kg_ha),
                "N_rate_kg_ha": float(n_rate_kg_ha)
            },
            "recommendations_kg_acre": {
                "Urea": max(0, round(urea_kg_acre, 2)),
                "CAN": max(0, round(can_kg_acre, 2)),
                "Ammonium_Sulfate": max(0, round(amm_sulf_kg_acre, 2))
            }
        }
        
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
