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
