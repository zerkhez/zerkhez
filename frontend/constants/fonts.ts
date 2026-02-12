/**
 * Font Configuration
 * 
 * Centralized font management for easy testing and modification.
 * Change font families here to test different fonts across the entire app.
 */

export const FONTS = {
    english: {
        regular: 'Montserrat-Regular',
        medium: 'Montserrat-Medium',
        semiBold: 'Montserrat-SemiBold',
        bold: 'Montserrat-Bold',
        italic: 'Montserrat-Italic',
    },
    urdu: {
        regular: 'NotoSansArabic-Regular',
        bold: 'NotoSansArabic-Bold',
    },
};

export type FontWeight = 'regular' | 'medium' | 'semiBold' | 'bold' | 'italic';

/**
 * Get the appropriate font family based on language and weight
 * @param language - Current language code ('en' or 'ur')
 * @param weight - Font weight/style to use
 * @returns Font family name
 */
export const getFont = (
    language: string,
    weight: FontWeight = 'regular'
): string => {
    const isUrdu = language === 'ur';

    if (isUrdu) {
        // Urdu only has regular and bold variants
        return weight === 'bold' || weight === 'semiBold'
            ? FONTS.urdu.bold
            : FONTS.urdu.regular;
    }

    // English has all weight variants
    return FONTS.english[weight] || FONTS.english.regular;
};
