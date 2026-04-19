export function calculate_maize_spad(green_channel_mean: number): number {
    // Formula: SPAD = 3.1713 * y - 226.13
    return 3.1713 * green_channel_mean - 226.13;
}

export function calculate_maize_si(spad_t: number, spad_f: number): number {
    // Formula: SI = (SPAD(T) / SPAD(F)) * 100
    if (spad_f === 0) {
        return 0;
    }
    return (spad_t / spad_f) * 100;
}

export interface MaizeFertilizerNeeds {
    need_of_fertilizer: boolean;
    n_rate: number;
    urea: number;
    can: number;
    ammonium_sulfate: number;
    message?: string;
}

export function calculate_maize_fertilizer_needs(si: number, variety: string): MaizeFertilizerNeeds {
    const variety_lower = variety.toLowerCase().trim();
    const is_hybrid = variety_lower.includes('hybrid') || variety_lower.includes('ہائبرڈ');
    
    let n_rate = 0;
    let need_fertilizer = false;
    let message = "";
    
    if (si > 95) {
        return {
            need_of_fertilizer: false,
            n_rate: 0,
            urea: 0,
            can: 0,
            ammonium_sulfate: 0,
            message: "آپ کی فصل کو اس وقت کھاد کی ضرورت نہیں ہے! لہذا، براہ کرم 10 دن بعد دوبارہ کوشش کریں۔"
        };
    } else if (si >= 90 && si <= 95) {
        need_fertilizer = true;
        n_rate = is_hybrid ? 12.14 : 10.12;
    } else {
        need_fertilizer = true;
        n_rate = is_hybrid ? 23.08 : 20.25;
    }
    
    const urea = (n_rate * 100) / 46;
    const can = (n_rate * 100) / 26;
    const ammonium_sulfate = (n_rate * 100) / 21;
    
    return {
        need_of_fertilizer: true,
        n_rate: n_rate,
        urea: Math.round(urea * 100) / 100,
        can: Math.round(can * 100) / 100,
        ammonium_sulfate: Math.round(ammonium_sulfate * 100) / 100,
    };
}
