from ..services.image_processing import process_image
from ..rules import maize_rules

def calculate_maize_fertilizer(kaafi_file, aam_file, variety):
    """
    Calculate fertilizer for maize based on two images (Kaafi/F and Aam/T).
    """
    
    # 1. Process Images to get Green Channel Mean (y)
    # process_image returns: GP, TP, mean_R, mean_G, mean_B
    _, _, _, mean_G_f, _ = process_image(kaafi_file)
    _, _, _, mean_G_t, _ = process_image(aam_file)
    
    # 2. Calculate SPAD
    spad_f = maize_rules.calculate_spad(mean_G_f)
    spad_t = maize_rules.calculate_spad(mean_G_t)
    
    # 3. Calculate SI
    si = maize_rules.calculate_si(spad_t, spad_f)
    
    # 4. Calculate Fertilizer Needs
    fertilizer_result = maize_rules.calculate_fertilizer_needs(si, variety)
    
    # restructure recommendations to match other crops
    recommendations_kg_acre = {}
    if fertilizer_result.get("need_of_fertilizer"):
        recommendations_kg_acre = {
            "Urea": fertilizer_result.get("urea"),
            "CAN": fertilizer_result.get("can"),
            "Ammonium_Sulfate": fertilizer_result.get("ammonium_sulfate")
        }

    return {
        "giveFertilizer": fertilizer_result.get("need_of_fertilizer", False),
        "inputs": {
            "variety": variety,
            "kaafi_stats": {
                "mean_green_channel": float(mean_G_f)
            },
            "aam_stats": {
                "mean_green_channel": float(mean_G_t)
            }
        },
        "calculations": {
            "SPAD_F": float(spad_f),
            "SPAD_T": float(spad_t),
            "SI": float(si),
            "N_rate_kg_ha": fertilizer_result.get("n_rate", 0)
        },
        "recommendations_kg_acre": recommendations_kg_acre,
        "message": fertilizer_result.get("message", "")
    }
