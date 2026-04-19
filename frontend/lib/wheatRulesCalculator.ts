import { calculate_fertilizers, calculate_gi, calculate_ri } from "./riceRulesCalculator";

export const WHEAT_M = 0.003;
export const WHEAT_C = 0.1087;

export function calculate_wheat_ndvi(x: number): number {
    return (WHEAT_M * x) + WHEAT_C;
}

export function calculate_wheat_iey(ndvi_t: number, das: number): number {
    if (das === 0) {
        throw new Error("DAS cannot be zero");
    }
    return ndvi_t / das;
}

export function calculate_wheat_pyp(iey: number): number {
    // PYP = 6084.6 * IEY / 1.61
    return (6084.6 * iey) / 1.61;
}

export function calculate_wheat_n_rate(pypn: number, pyp: number): number {
    // N rate = 10 * (PYPN - PYP) * 1.85 / 50
    return 10 * (pypn - pyp) * 1.85 / 50.0;
}
