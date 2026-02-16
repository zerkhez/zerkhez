# Fertilizer Service

FERTILIZERS = {
    "Group 1": {
        "DAP (18:46:0)": (18, 46, 0),
        "SSP (0:18:0)": (0, 18, 0),
        "Nitrophos (23:23:0)": (23, 23, 0),
        "TSP (0:46:0)": (0, 46, 0),
        "MAP (13:52:0)": (13, 52, 0),
    },
    "Group 2": {
        "Urea (46:0:0)": (46, 0, 0),
        "CAN (26:0:0)": (26, 0, 0),
        "Ammonium Sulfate (21:0:0)": (21, 0, 0),
    },
    "Group 3": {
        "SOP (0:0:50)": (0, 0, 50),
        "MOP (0:0:60)": (0, 0, 60),
    },
}

def calculate_fertilizer_package(n_req, p_req, k_req, selected_fertilizers):
    """
    Calculates fertilizer amounts based on N, P, K requirements and selected fertilizers.
    
    Args:
        n_req (float): Nitrogen requirement in kg
        p_req (float): Phosphorus requirement in kg
        k_req (float): Potash requirement in kg
        selected_fertilizers (dict): { "Group 1": "name", "Group 2": "name", "Group 3": "name" }
        
    Returns:
        dict: Calculated amounts and warnings
    """
    results = {}
    warnings = {}
    remaining_n = n_req
    remaining_p = p_req
    remaining_k = k_req

    # Group 1 (P fertilizers)
    p_fertilizer_name = selected_fertilizers.get("Group 1")
    if p_fertilizer_name in FERTILIZERS["Group 1"]:
        p_percent = FERTILIZERS["Group 1"][p_fertilizer_name][1] / 100
        # Avoid division by zero if someone adds a 0% P fertilizer to Group 1 (though unlikely based on current data)
        if p_percent > 0:
            p_amount = remaining_p / p_percent
            results[p_fertilizer_name] = round(p_amount, 2)
            
            # Subtract N from complex fertilizers (e.g., DAP)
            n_percent = FERTILIZERS["Group 1"][p_fertilizer_name][0] / 100
            remaining_n -= n_percent * p_amount
        else:
            results[p_fertilizer_name] = 0
    else:
        warnings["Group 1"] = f"Invalid fertilizer selected: {p_fertilizer_name}"

    # Group 2 (N fertilizers)
    n_fertilizer_name = selected_fertilizers.get("Group 2")
    if n_fertilizer_name in FERTILIZERS["Group 2"]:
        n_percent = FERTILIZERS["Group 2"][n_fertilizer_name][0] / 100
        if n_percent > 0:
            n_amount = remaining_n / n_percent
            results[n_fertilizer_name] = round(n_amount, 2)
            
            # Check for negative values as in original code
            if n_amount < 0:
                warnings[n_fertilizer_name] = (
                    "منفی کی علامت ظاہر کرتی ہے کہ نائٹروجن اوپر والی کھاد سے پہلے ہی زیادہ "
                    "ڈل جائے گی اس لیے یہ کھاد ڈالنے کی ضرورت نہیں"
                )
        else:
            results[n_fertilizer_name] = 0
    else:
        warnings["Group 2"] = f"Invalid fertilizer selected: {n_fertilizer_name}"

    # Group 3 (K fertilizers)
    k_fertilizer_name = selected_fertilizers.get("Group 3")
    if k_fertilizer_name in FERTILIZERS["Group 3"]:
        k_percent = FERTILIZERS["Group 3"][k_fertilizer_name][2] / 100
        if k_percent > 0:
            k_amount = remaining_k / k_percent
            results[k_fertilizer_name] = round(k_amount, 2)
        else:
            results[k_fertilizer_name] = 0
    else:
        warnings["Group 3"] = f"Invalid fertilizer selected: {k_fertilizer_name}"

    return {
        "results": results,
        "warnings": warnings,
        "requirements": {
            "n": n_req,
            "p": p_req,
            "k": k_req
        }
    }
