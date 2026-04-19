// Defines the rules and constants for Wheat Fertilizer logic in the frontend
// Ported from backend/app/rules/wheat_rules.py

import { WHEAT_M, WHEAT_C } from './riceRulesCalculator';

export function calculate_ndvi(x: number): number {
    return (WHEAT_M * x) + WHEAT_C;
}

export function calculate_iey(ndvi_t: number, das: number): number {
    if (das === 0) {
        throw new Error("DAS cannot be zero");
    }
    return ndvi_t / das;
}

export function calculate_pyp(iey: number): number {
    // PYP = 6084.6 * IEY / 1.61
    return (6084.6 * iey) / 1.61;
}

export function calculate_ri(ndvi_nl: number, ndvi_t: number): number {
    if (ndvi_t === 0) {
        return 0;
    }
    return ndvi_nl / ndvi_t;
}

export function calculate_n_rate(pypn: number, pyp: number): number {
    // N rate = 10 * (PYPN - PYP) * 1.85 / 50
    return 10 * (pypn - pyp) * 1.85 / 50.0;
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
        Urea: Math.max(0, Math.round(urea_kg_acre * 100) / 100), // round to 2 decimals
        CAN: Math.max(0, Math.round(can_kg_acre * 100) / 100),
        Ammonium_Sulfate: Math.max(0, Math.round(amm_sulf_kg_acre * 100) / 100)
    };
}
