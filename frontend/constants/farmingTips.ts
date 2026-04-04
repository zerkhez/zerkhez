export interface FarmingTip {
    id: string;
    crop: 'wheat' | 'rice' | 'maize';
    season: 'rabi' | 'kharif';
    en: string;
    ur: string;
}

export const FARMING_TIPS: FarmingTip[] = [
    // ── Rice (Kharif: Apr-Sep) ──
    { id: 'rice-1', crop: 'rice', season: 'kharif', en: 'Apply nitrogen fertilizer in 2-3 splits for better rice yield.', ur: 'بہتر چاول کی پیداوار کے لیے نائٹروجن کھاد 2-3 قسطوں میں ڈالیں۔' },
    { id: 'rice-2', crop: 'rice', season: 'kharif', en: 'Maintain 2-3 inches of standing water during early tillering stage.', ur: 'ابتدائی ٹلرنگ مرحلے میں 2-3 انچ کھڑا پانی رکھیں۔' },
    { id: 'rice-3', crop: 'rice', season: 'kharif', en: 'Use the sufficient nitrogen plot as reference for accurate analysis.', ur: 'درست تجزیے کے لیے کافی نائٹروجن والے پلاٹ کو بطور حوالہ استعمال کریں۔' },
    { id: 'rice-4', crop: 'rice', season: 'kharif', en: 'Take crop images during morning hours for best color accuracy.', ur: 'بہترین رنگ کی درستگی کے لیے صبح کے وقت فصل کی تصویریں لیں۔' },
    { id: 'rice-5', crop: 'rice', season: 'kharif', en: 'Avoid applying nitrogen during heavy rainfall to prevent runoff.', ur: 'بہاؤ سے بچنے کے لیے شدید بارش کے دوران نائٹروجن نہ ڈالیں۔' },
    { id: 'rice-6', crop: 'rice', season: 'kharif', en: 'Yellowing of lower leaves often indicates nitrogen deficiency.', ur: 'نچلے پتوں کا پیلا ہونا اکثر نائٹروجن کی کمی کی نشاندہی کرتا ہے۔' },

    // ── Wheat (Rabi: Oct-Mar) ──
    { id: 'wheat-1', crop: 'wheat', season: 'rabi', en: 'Apply first dose of nitrogen at sowing time for strong root development.', ur: 'مضبوط جڑوں کی نشوونما کے لیے بوائی کے وقت نائٹروجن کی پہلی خوراک ڈالیں۔' },
    { id: 'wheat-2', crop: 'wheat', season: 'rabi', en: 'Second nitrogen application should be at first irrigation (21 days after sowing).', ur: 'نائٹروجن کی دوسری خوراک پہلی آبپاشی (بوائی کے 21 دن بعد) پر ہونی چاہیے۔' },
    { id: 'wheat-3', crop: 'wheat', season: 'rabi', en: 'Ensure adequate soil moisture before applying nitrogen fertilizer.', ur: 'نائٹروجن کھاد ڈالنے سے پہلے مٹی میں مناسب نمی یقینی بنائیں۔' },
    { id: 'wheat-4', crop: 'wheat', season: 'rabi', en: 'Avoid excessive nitrogen as it can cause lodging in wheat.', ur: 'زیادہ نائٹروجن سے بچیں کیونکہ اس سے گندم گر سکتی ہے۔' },
    { id: 'wheat-5', crop: 'wheat', season: 'rabi', en: 'Take leaf images from the top canopy for accurate nitrogen estimation.', ur: 'درست نائٹروجن تخمینے کے لیے اوپری چھتری سے پتوں کی تصاویر لیں۔' },
    { id: 'wheat-6', crop: 'wheat', season: 'rabi', en: 'Pale green leaves in wheat indicate the need for nitrogen topdressing.', ur: 'گندم میں ہلکے سبز پتے نائٹروجن کی ٹاپ ڈریسنگ کی ضرورت ظاہر کرتے ہیں۔' },

    // ── Maize (Kharif: Apr-Sep) ──
    { id: 'maize-1', crop: 'maize', season: 'kharif', en: 'Maize requires the most nitrogen at the V6-V8 growth stage.', ur: 'مکئی کو V6-V8 نشوونما کے مرحلے میں سب سے زیادہ نائٹروجن کی ضرورت ہوتی ہے۔' },
    { id: 'maize-2', crop: 'maize', season: 'kharif', en: 'Split nitrogen application into 3 doses for optimal maize growth.', ur: 'بہترین مکئی کی نشوونما کے لیے نائٹروجن کو 3 خوراکوں میں تقسیم کریں۔' },
    { id: 'maize-3', crop: 'maize', season: 'kharif', en: 'Ensure proper spacing between maize plants for uniform nitrogen uptake.', ur: 'یکساں نائٹروجن جذب کے لیے مکئی کے پودوں کے درمیان مناسب فاصلہ رکھیں۔' },
    { id: 'maize-4', crop: 'maize', season: 'kharif', en: 'Firing of lower leaves in maize is a classic sign of nitrogen stress.', ur: 'مکئی میں نچلے پتوں کا جلنا نائٹروجن کی کمی کی واضح نشانی ہے۔' },
    { id: 'maize-5', crop: 'maize', season: 'kharif', en: 'Apply nitrogen fertilizer close to the plant base for better absorption.', ur: 'بہتر جذب کے لیے نائٹروجن کھاد پودے کی بنیاد کے قریب ڈالیں۔' },
    { id: 'maize-6', crop: 'maize', season: 'kharif', en: 'Avoid waterlogging in maize fields as it reduces nitrogen availability.', ur: 'مکئی کے کھیتوں میں پانی کھڑا نہ ہونے دیں کیونکہ اس سے نائٹروجن کی دستیابی کم ہوتی ہے۔' },
];

/**
 * Get current season based on month.
 * Rabi: October-March, Kharif: April-September
 */
export function getCurrentSeason(): 'rabi' | 'kharif' {
    const month = new Date().getMonth(); // 0-indexed
    return month >= 3 && month <= 8 ? 'kharif' : 'rabi';
}

/**
 * Select 2-3 tips from a pool, rotated daily using date as seed.
 */
export function getDailyTips(tips: FarmingTip[], count: number = 3): FarmingTip[] {
    if (tips.length === 0) return [];
    if (tips.length <= count) return tips;

    // Simple hash from date string to get a daily seed
    const dateStr = new Date().toDateString();
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
        seed = ((seed << 5) - seed + dateStr.charCodeAt(i)) | 0;
    }
    seed = Math.abs(seed);

    const startIndex = seed % tips.length;
    const selected: FarmingTip[] = [];
    for (let i = 0; i < count; i++) {
        selected.push(tips[(startIndex + i) % tips.length]);
    }
    return selected;
}
