// Defines the rules and constants for Maize Fertilizer logic in the frontend
// Ported from backend/app/rules/maize_rules.py

/**
 * Calculate SPAD based on mean green channel value (y).
 * Formula: SPAD = 3.1713 * y - 226.13
 */
export function calculate_spad(green_channel_mean: number): number {
    return 3.1713 * green_channel_mean - 226.13;
}

/**
 * Calculate Sufficiency Index (SI).
 * Formula: SI = (SPAD(T) / SPAD(F)) * 100
 */
export function calculate_si(spad_t: number, spad_f: number): number {
    if (spad_f === 0) {
        return 0;
    }
    return (spad_t / spad_f) * 100;
}

/**
 * Calculate fertilizer needs based on SI and variety (common/hybrid).
 * Returns an object with need_of_fertilizer boolean and amounts if applicable.
 */
export function calculate_fertilizer_needs(si: number, variety: string): {
    need_of_fertilizer: boolean;
    message?: string;
    n_rate: number;
    urea: number;
    can: number;
    ammonium_sulfate: number;
} {
    // Normalize variety string
    const varietyLower = (variety || "").toLowerCase().trim();
    // Check for 'hybrid' in English or Urdu
    const isHybrid = varietyLower.includes('hybrid') || varietyLower.includes('ہائبرڈ');

    let n_rate = 0;

    if (si > 95) {
        return {
            need_of_fertilizer: false,
            n_rate: 0,
            urea: 0,
            can: 0,
            ammonium_sulfate: 0
        };
    } else if (si >= 90 && si <= 95) {
        n_rate = isHybrid ? 12.14 : 10.12;
    } else {
        // si < 90
        n_rate = isHybrid ? 23.08 : 20.25;
    }

    // Calculate specific fertilizers
    // Urea = N * 100 / 46
    // CAN = N * 100 / 26
    // Ammonium Sulfate = N * 100 / 21
    const urea = (n_rate * 100) / 46;
    const can = (n_rate * 100) / 26;
    const ammonium_sulfate = (n_rate * 100) / 21;

    return {
        need_of_fertilizer: true,
        n_rate: n_rate,
        urea: Math.round(urea * 100) / 100, // round to 2 decimals
        can: Math.round(can * 100) / 100,
        ammonium_sulfate: Math.round(ammonium_sulfate * 100) / 100
    };
}
