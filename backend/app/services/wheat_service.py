from ..services.image_processing import process_image
from ..services.gi_calculator import calculate_gi
from ..rules import wheat_rules

def calculate_wheat_fertilizer(kaafi_file, aam_file, variety, das):
    # Variety is captured for record, but formula uses fixed params for wheat currently
    
    # 1. Process Images
    gp_nl, tp_nl, r_nl, g_nl, b_nl = process_image(kaafi_file)
    ratio_nl = gp_nl / tp_nl if tp_nl > 0 else 0
    
    gp_t, tp_t, r_t, g_t, b_t = process_image(aam_file)
    ratio_t = gp_t / tp_t if tp_t > 0 else 0
    
    # 2. Calculate GI (Fixed formula 2G-B-R)
    gi_nl = calculate_gi("2G-B-R", r_nl, g_nl, b_nl)
    gi_t = calculate_gi("2G-B-R", r_t, g_t, b_t)
    
    # 3. Calculate X
    x_nl = gi_nl * ratio_nl
    x_t = gi_t * ratio_t
    
    # 4. Calculate NDVI
    ndvi_nl = wheat_rules.calculate_ndvi(x_nl)
    ndvi_t = wheat_rules.calculate_ndvi(x_t)
    
    # 5. Calculate IEY
    iey = wheat_rules.calculate_iey(ndvi_t, das)
    
    # 6. Calculate PYP
    pyp = wheat_rules.calculate_pyp(iey)
    
    # 7. Calculate RI
    ri = wheat_rules.calculate_ri(ndvi_nl, ndvi_t)
    
    # 8. Calculate PYPN
    pypn = pyp * ri
    
    # 9. Calculate N rate
    n_rate_kg_ha = wheat_rules.calculate_n_rate(pypn, pyp)
    
    # 10. Calculate Fertilizers
    recommendations = wheat_rules.calculate_fertilizers(n_rate_kg_ha)
    
    return {
        "inputs": {
            "variety": variety,
            "das": das,
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
            "X_nl": float(x_nl),
            "X_t": float(x_t),
            "NDVI_nl": float(ndvi_nl),
            "NDVI_t": float(ndvi_t),
            "IEY": float(iey),
            "PYP": float(pyp),
            "RI": float(ri),
            "PYPN": float(pypn),
            "N_rate_kg_ha": float(n_rate_kg_ha)
        },
        "recommendations_kg_acre": recommendations
    }
