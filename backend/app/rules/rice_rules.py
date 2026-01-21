def calculate_ndvi(m, c, x):
    return (m * x) + c

def calculate_iey(ndvi_t, dat):
    if dat == 0:
        raise ValueError("DAT cannot be zero")
    return ndvi_t / dat

def calculate_pyp(iey):
    # PYP = 76.05*(IEY)^0.8845 + 34.97*(IEY)^0.669 + 23.97*(IEY)^0.5558
    iey_safe = max(0, iey)
    pyp_t_ha = (76.05 * (iey_safe ** 0.8845)) + \
               (34.97 * (iey_safe ** 0.669)) + \
               (23.97 * (iey_safe ** 0.5558))
    return pyp_t_ha * 1000  # Convert to kg/ha

def calculate_ri(ndvi_nl, ndvi_t):
    if ndvi_t == 0:
        return 0
    return ndvi_nl / ndvi_t

def calculate_n_rate(pypn_kg_ha, pyp_kg_ha):
    # N rate = (PYPN - PYP) * 1.2 / 50
    return ((pypn_kg_ha - pyp_kg_ha) * 1.2) / 50.0

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
