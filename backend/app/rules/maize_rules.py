def calculate_spad(green_channel_mean):
    """
    Calculate SPAD based on mean green channel value (y).
    Formula: SPAD = 3.1713 * y - 226.13
    """
    y = green_channel_mean
    return 3.1713 * y - 226.13

def calculate_si(spad_t, spad_f):
    """
    Calculate Sufficiency Index (SI).
    Formula: SI = (SPAD(T) / SPAD(F)) * 100
    """
    if spad_f == 0:
        return 0
    return (spad_t / spad_f) * 100

def calculate_fertilizer_needs(si, variety):
    """
    Calculate fertilizer needs based on SI and variety (common/hybrid).
    Returns a dictionary with need_of_fertilizer boolean and amounts if applicable.
    """
    
    # Normalize variety string
    variety_lower = variety.lower().strip()
    # Check for 'hybrid' in English or Urdu
    is_hybrid = 'hybrid' in variety_lower or 'ہائبرڈ' in variety_lower
    
    # Defaults
    n_rate = 0
    need_fertilizer = False
    
    if si > 95:
        return {
            "need_of_fertilizer": False,
            "message": "آپ کی فصل کو اس وقت کھاد کی ضرورت نہیں ہے! لہذا، براہ کرم 10 دن بعد دوبارہ کوشش کریں۔"
        }
        
    elif 90 <= si <= 95:
        need_fertilizer = True
        if is_hybrid:
            n_rate = 12.14
        else:
            n_rate = 10.12 # Common
            
    else: # SI < 90 
        need_fertilizer = True
        if is_hybrid:
            n_rate = 23.08
        else:
            n_rate = 20.25 # Common
            
    # Calculate specific fertilizers
    # Urea = N * 100 / 46
    # CAN = N * 100 / 26
    # Ammonium Sulfate = N * 100 / 21
    
    urea = (n_rate * 100) / 46
    can = (n_rate * 100) / 26
    ammonium_sulfate = (n_rate * 100) / 21
    
    return {
        "need_of_fertilizer": True,
        "n_rate": n_rate,
        "urea": round(urea, 2),
        "can": round(can, 2),
        "ammonium_sulfate": round(ammonium_sulfate, 2)
    }
