from ..services.image_processing import process_image
from ..services.gi_calculator import calculate_gi
from ..rules import rice_rules
from ..config.constants import VARIETY_PARAMS

def calculate_rice_fertilizer(kaafi_file, aam_file, variety, dat):
    if variety not in VARIETY_PARAMS:
        raise ValueError(f"Unknown variety: {variety}")
        
    params = VARIETY_PARAMS[variety]
    
    # 1. Process Images
    gp_nl, tp_nl, r_nl, g_nl, b_nl = process_image(kaafi_file)
    ratio_nl = gp_nl / tp_nl if tp_nl > 0 else 0
    
    gp_t, tp_t, r_t, g_t, b_t = process_image(aam_file)
    ratio_t = gp_t / tp_t if tp_t > 0 else 0
    
    # 2. Calculate GI
    gi_nl = calculate_gi(params['formula'], r_nl, g_nl, b_nl)
    gi_t = calculate_gi(params['formula'], r_t, g_t, b_t)
    
    # 3. Calculate NDVI
    x_nl = gi_nl * ratio_nl
    x_t = gi_t * ratio_t
    
    ndvi_nl = rice_rules.calculate_ndvi(params['m'], params['c'], x_nl)
    ndvi_t = rice_rules.calculate_ndvi(params['m'], params['c'], x_t)
    
    # 4. Calculate IEY
    iey = rice_rules.calculate_iey(ndvi_t, dat)
    
    # 5. Calculate PYP
    pyp_kg_ha = rice_rules.calculate_pyp(iey)
    
    # 6. Calculate RI
    ri = rice_rules.calculate_ri(ndvi_nl, ndvi_t)
    
    # 7. Calculate PYPN
    pypn_kg_ha = pyp_kg_ha * ri
    
    # 8. Calculate N rate
    n_rate_kg_ha = rice_rules.calculate_n_rate(pypn_kg_ha, pyp_kg_ha)
    
    # 9. Calculate Fertilizers
    recommendations = rice_rules.calculate_fertilizers(n_rate_kg_ha)
    
    return {
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
            "PYP_kg_ha": float(pyp_kg_ha),
            "RI": float(ri),
            "PYPN_kg_ha": float(pypn_kg_ha),
            "N_rate_kg_ha": float(n_rate_kg_ha)
        },
        "recommendations_kg_acre": recommendations
    }
