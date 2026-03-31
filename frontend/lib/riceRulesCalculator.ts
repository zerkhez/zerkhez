// Defines the rules and constants for Rice Fertilizer logic in the frontend

export const VARIETY_PARAMS: Record<string, { formula: string; m: number; c: number }> = {
    "Sona super Basmati": { formula: "R+B", m: -0.0026, c: 1.1418 },
    "Kisan Basmati": { formula: "2G-B-R", m: 0.0038, c: 0.26 },
    "Super Basmati": { formula: "G/R", m: 1.1652, c: -0.9624 },
    "Basmati 515": { formula: "(G-B)/(R+G+B)", m: 1.3994, c: 0.397 },
    "PK 1121 Aromatic": { formula: "R-G", m: -0.0084, c: 0.3879 },
    "Pk 2021 Aromatic": { formula: "B", m: -0.0065, c: 1.2172 }
};

export const WHEAT_M = 0.003;
export const WHEAT_C = 0.1087;

export function calculate_gi(formula_type: string, R: number, G: number, B: number): number {
    try {
        if (formula_type === "R+B") {
            return R + B;
        } else if (formula_type === "2G-B-R") {
            return (2 * G) - B - R;
        } else if (formula_type === "G/R") {
            return R !== 0 ? G / R : 0;
        } else if (formula_type === "(G-B)/(R+G+B)") {
            const denominator = (R + G + B);
            return denominator !== 0 ? (G - B) / denominator : 0;
        } else if (formula_type === "R-G") {
            return R - G;
        } else if (formula_type === "B") {
            return B;
        } else {
            return 0;
        }
    } catch (e) {
        console.error(`Error calculating GI:`, e);
        return 0;
    }
}

export function calculate_ndvi(m: number, c: number, x: number): number {
    return (m * x) + c;
}

export function calculate_iey(ndvi_t: number, dat: number): number {
    if (dat === 0) {
        throw new Error("DAT cannot be zero");
    }
    return ndvi_t / dat;
}

export function calculate_pyp(iey: number): number {
    // PYP = 76.05*(IEY)^0.8845 + 34.97*(IEY)^0.669 + 23.97*(IEY)^0.5558
    const iey_safe = Math.max(0, iey);
    const pyp_t_ha = (76.05 * Math.pow(iey_safe, 0.8845)) +
                     (34.97 * Math.pow(iey_safe, 0.669)) +
                     (23.97 * Math.pow(iey_safe, 0.5558));
    return pyp_t_ha * 1000; // Convert to kg/ha
}

export function calculate_ri(ndvi_nl: number, ndvi_t: number): number {
    if (ndvi_t === 0) {
        return 0;
    }
    return ndvi_nl / ndvi_t;
}

export function calculate_n_rate(pypn_kg_ha: number, pyp_kg_ha: number): number {
    // N rate = (PYPN - PYP) * 1.2 / 50
    return ((pypn_kg_ha - pyp_kg_ha) * 1.2) / 50.0;
}

export function calculate_fertilizers(n_rate_kg_ha: number): { Urea: number; CAN: number; Ammonium_Sulfate: number } {
    // 1 ha = 2.47105 acres
    const factor = 2.47105;
    
    const urea_kg_ha = n_rate_kg_ha * 100 / 46;
    const urea_kg_acre = urea_kg_ha / factor;
    
    const can_kg_ha = n_rate_kg_ha * 100 / 26;
    const can_kg_acre = can_kg_ha / factor;
    
    const amm_sulf_kg_ha = n_rate_kg_ha * 100 / 21;
    const amm_sulf_kg_acre = amm_sulf_kg_ha / factor;
    
    return {
        Urea: Math.max(0, Math.round(urea_kg_acre * 100) / 100),
        CAN: Math.max(0, Math.round(can_kg_acre * 100) / 100),
        Ammonium_Sulfate: Math.max(0, Math.round(amm_sulf_kg_acre * 100) / 100)
    };
}
