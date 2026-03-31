import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import i18n from '@/lib/i18n';
import { horizontalScale, verticalScale, moderateScale } from '@/styles/common';

const LANGUAGE_KEY = 'appLanguage';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Height of the half-circle panel
const HALF_CIRCLE_H = verticalScale(240);

export default function LanguageSelectScreen() {
    const router = useRouter();
    const weatherParams = useLocalSearchParams<Record<string, string>>();
    const [selecting, setSelecting] = useState(false);

    // ── Entrance animations ──────────────────────────────────────────
    // Half-circle slides down from above
    const halfCircleY = useSharedValue(-HALF_CIRCLE_H);
    // Card slides up from below + fades in
    const cardY = useSharedValue(verticalScale(60));
    const cardOpacity = useSharedValue(0);

    useEffect(() => {
        // Half-circle drops in
        halfCircleY.value = withSpring(0, {
            damping: 18,
            stiffness: 120,
        });
        // Card rises up with a slight delay
        setTimeout(() => {
            cardY.value = withSpring(0, { damping: 20, stiffness: 130 });
            cardOpacity.value = withTiming(1, {
                duration: 500,
                easing: Easing.out(Easing.quad),
            });
        }, 200);
    }, []);

    const halfCircleStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: halfCircleY.value }],
    }));

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: cardY.value }],
        opacity: cardOpacity.value,
    }));

    // ── Button press animations ──────────────────────────────────────
    const enScale = useSharedValue(1);
    const urScale = useSharedValue(1);
    const enStyle = useAnimatedStyle(() => ({ transform: [{ scale: enScale.value }] }));
    const urStyle = useAnimatedStyle(() => ({ transform: [{ scale: urScale.value }] }));

    // ── Language selection ───────────────────────────────────────────
    const selectLanguage = async (lang: 'en' | 'ur') => {
        if (selecting) return;
        setSelecting(true);
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
        await i18n.changeLanguage(lang);
        router.replace({
            pathname: '/home',
            params: weatherParams || {},
        });
    };

    return (
        <View style={styles.container}>
            {/* ── Half-circle green panel (slides down) ── */}
            <Animated.View style={[styles.halfCircleWrapper, halfCircleStyle]}>
                <View style={styles.halfCircle} />
            </Animated.View>

            {/* ── Language card (slides up + fades in) ── */}
            <Animated.View style={[styles.card, cardStyle]}>
                <Text style={styles.heading}>Choose Language</Text>
                <Text style={styles.headingUr}>زبان منتخب کریں</Text>

                <View style={styles.buttonRow}>
                    {/* English */}
                    <Animated.View style={enStyle}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.langBtn,
                                pressed && styles.pressed,
                            ]}
                            onPressIn={() => { enScale.value = withSpring(0.93); }}
                            onPressOut={() => { enScale.value = withSpring(1); }}
                            onPress={() => selectLanguage('en')}
                        >
                            <Text style={styles.langLabel}>English</Text>
                        </Pressable>
                    </Animated.View>

                    {/* Urdu */}
                    <Animated.View style={urStyle}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.langBtn,
                                pressed && styles.pressed,
                            ]}
                            onPressIn={() => { urScale.value = withSpring(0.93); }}
                            onPressOut={() => { urScale.value = withSpring(1); }}
                            onPress={() => selectLanguage('ur')}
                        >
                            <Text style={[styles.langLabel, styles.langLabelUr]}>اردو</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F0',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ── Half-circle ──────────────────────────────────────────────────
    halfCircleWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HALF_CIRCLE_H,
        // overflow: 'hidden', // clips the circle to the panel height
    },
    halfCircle: {
        width: SCREEN_WIDTH * 1.05,
        height: SCREEN_WIDTH * 1.05,
        borderRadius: (SCREEN_WIDTH * 1.05) / 2,
        backgroundColor: '#8BCB6B',
        alignSelf: 'center',
        // Pull it up so only the bottom half is visible
        marginTop: -(SCREEN_WIDTH * 1.05 - HALF_CIRCLE_H),
    },

    // ── Card ─────────────────────────────────────────────────────────
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: moderateScale(24),
        paddingVertical: verticalScale(36),
        paddingHorizontal: horizontalScale(28),
        width: '82%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.09,
        shadowRadius: 18,
        elevation: 7,
        marginTop: verticalScale(80), // push card below the half-circle
    },
    heading: {
        fontSize: moderateScale(20),
        fontFamily: 'Montserrat-SemiBold',
        color: '#2D5016',
        marginBottom: verticalScale(4),
        letterSpacing: 0.3,
    },
    headingUr: {
        fontSize: moderateScale(18),
        fontFamily: 'NotoSansArabic-Regular',
        color: '#5A8A3C',
        marginBottom: verticalScale(28),
    },

    // ── Buttons ──────────────────────────────────────────────────────
    buttonRow: {
        flexDirection: 'row',
        gap: horizontalScale(16),
    },
    langBtn: {
        width: horizontalScale(110),
        height: verticalScale(52),       // fixed height
        borderRadius: moderateScale(14),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F8EA',
        borderWidth: 2,
        borderColor: '#8BCB6B',
    },
    pressed: {
        opacity: 0.82,
    },
    langLabel: {
        fontSize: moderateScale(15),
        fontFamily: 'Montserrat-SemiBold',
        color: '#2D5016',
    },
    langLabelUr: {
        fontFamily: 'NotoSansArabic-Bold',
        fontSize: moderateScale(17),
    },
});
