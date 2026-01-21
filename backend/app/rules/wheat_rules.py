from ..config.constants import WHEAT_M, WHEAT_C

def calculate_ndvi(x):
    return (WHEAT_M * x) + WHEAT_C

def calculate_iey(ndvi_t, das):
    if das == 0:
        raise ValueError("DAS cannot be zero")
    return ndvi_t / das

def calculate_pyp(iey):
    # PYP = 6084.6 * IEY / 1.61
    return (6084.6 * iey) / 1.61

def calculate_ri(ndvi_nl, ndvi_t):
    if ndvi_t == 0:
        return 0
    return ndvi_nl / ndvi_t

def calculate_n_rate(pypn, pyp):
    # N rate = 10 * (PYPN - PYP) * 1.85 / 50
    return 10 * (pypn - pyp) * 1.85 / 50.0

def calculate_fertilizers(n_rate_kg_ha):
    # 1 ha = 2.47105 acres
    factor = 2.47105
    
    urea_kg_ha = n_rate_kg_ha * 100 / 46
    urea_kg_acre = urea_kg_ha / factor
    
    can_kg_ha = n_rate_kg_ha * 100 / 26
    can_kg_acre = can_kg_ha / factor
    
    amm_sulf_kg_ha = n_rate_kg_ha * 100 / 21
    amm_sulf_kg_acre = amm_sulf_kg_ha / factor
    
    return {
        "Urea": max(0, round(urea_kg_acre, 2)),
        "CAN": max(0, round(can_kg_acre, 2)),
        "Ammonium_Sulfate": max(0, round(amm_sulf_kg_acre, 2))
    }
