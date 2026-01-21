# Rice Variety Data: (Formula Logic, Slope M, Intercept C)
VARIETY_PARAMS = {
    "Sona super Basmati": {"formula": "R+B", "m": -0.0026, "c": 1.1418},
    "Kisan Basmati": {"formula": "2G-B-R", "m": 0.0038, "c": 0.26},
    "Super Basmati": {"formula": "G/R", "m": 1.1652, "c": -0.9624},
    "Basmati 515": {"formula": "(G-B)/(R+G+B)", "m": 1.3994, "c": 0.397},
    "PK 1121 Aromatic": {"formula": "R-G", "m": -0.0084, "c": 0.3879},
    "Pk 2021 Aromatic": {"formula": "B", "m": -0.0065, "c": 1.2172}
}

# Wheat Fixed Parameters
WHEAT_M = 0.003
WHEAT_C = 0.1087
