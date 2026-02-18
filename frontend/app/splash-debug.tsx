/**
 * SPLASH DEBUG PAGE
 * ─────────────────
 * Static snapshot of the splash screen with the blob un-expanded.
 * Use this page to tweak image positions, sizes, and rotations.
 * When happy, copy the <Image> style props back into index.tsx.
 *
 * Navigate to it in Expo by going to the route:  /splash-debug
 */

import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { horizontalScale, verticalScale } from '@/styles/common';

export default function SplashDebug() {
    return (
        <View style={styles.container}>
            {/* ── Label ── */}
            <View style={styles.debugBanner}>
                <Text style={styles.debugText}>🛠 SPLASH DEBUG — edit splash-debug.tsx</Text>
            </View>

            {/* ── Static blob (un-expanded) ── */}
            <View style={styles.blob} />

            {/* ── Logo placeholder ── */}
            <View style={styles.logoWrapper}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>

            {/* ══════════════════════════════════════════════
          DECORATIVE ICONS
          Adjust top / left / right / bottom / width /
          height / rotate freely here, then copy back.
         ══════════════════════════════════════════════ */}

            {/* ── Top-left ── */}
            <Image
                source={require('../assets/images/splash/leaf.png')}
                style={[styles.icon, {
                    top: verticalScale(40),
                    left: horizontalScale(20),
                    width: horizontalScale(50),
                    height: horizontalScale(50),
                    transform: [{ rotate: '-15deg' }],
                }]}
                resizeMode="contain"
            />
            <Image
                source={require('../assets/images/splash/wheat2.png')}
                style={[styles.icon, {
                    top: verticalScale(30),
                    left: horizontalScale(85),
                    width: horizontalScale(45),
                    height: horizontalScale(45),
                    transform: [{ rotate: '10deg' }],
                }]}
                resizeMode="contain"
            />
            <Image
                source={require('../assets/images/splash/crop.png')}
                style={[styles.icon, {
                    top: verticalScale(98),
                    left: horizontalScale(55),
                    width: horizontalScale(55),
                    height: horizontalScale(55),
                }]}
                resizeMode="contain"
            />

            {/* ── Top-center ── */}
            <Image
                source={require('../assets/images/splash/farmer.png')}
                style={[styles.icon, {
                    top: verticalScale(25),
                    left: '38%',
                    width: horizontalScale(60),
                    height: horizontalScale(60),
                }]}
                resizeMode="contain"
            />

            {/* ── Top-right ── */}
            <Image
                source={require('../assets/images/splash/crop2.png')}
                style={[styles.icon, {
                    top: verticalScale(35),
                    right: horizontalScale(10),
                    width: horizontalScale(65),
                    height: horizontalScale(65),
                    transform: [{ rotate: '8deg' }],
                }]}
                resizeMode="contain"
            />
            <Image
                source={require('../assets/images/splash/seeds.png')}
                style={[styles.icon, {
                    top: verticalScale(100),
                    right: horizontalScale(10),
                    width: horizontalScale(60),
                    height: horizontalScale(60),
                    transform: [{ rotate: '-5deg' }],
                }]}
                resizeMode="contain"
            />

            <Image
                source={require('../assets/images/splash/leaf2.png')}
                style={[styles.icon, {
                    top: verticalScale(100),
                    left: horizontalScale(140),
                    width: horizontalScale(80),
                    height: horizontalScale(55),
                    transform: [{ rotate: '-50deg' }],
                }]}
                resizeMode="contain"
            />

            <Image
                source={require('../assets/images/splash/fertilizer.png')}
                style={[styles.icon, {
                    top: verticalScale(40),
                    right: horizontalScale(85),
                    width: horizontalScale(50),
                    height: horizontalScale(60),
                }]}
                resizeMode="contain"
            />

            <Image
                source={require('../assets/images/splash/leaf4.png')}
                style={[styles.icon, {
                    top: verticalScale(120),
                    right: horizontalScale(70),
                    width: horizontalScale(70),
                    height: horizontalScale(90),
                    transform: [{ rotate: '180deg' }],
                }]}
                resizeMode="contain"
            />

            {/* ── Left side ── */}
            <Image
                source={require('../assets/images/splash/farmer2.png')}
                style={[styles.icon, {
                    top: verticalScale(170),
                    left: horizontalScale(10),
                    width: horizontalScale(80),
                    height: horizontalScale(65),
                }]}
                resizeMode="contain"
            />
            <Image
                source={require('../assets/images/splash/wheat3.png')}
                style={[styles.icon, {
                    top: '42%',
                    left: horizontalScale(30),
                    width: horizontalScale(40),
                    height: horizontalScale(40),
                    transform: [{ rotate: '12deg' }],
                }]}
                resizeMode="contain"
            />

            {/* ── Bottom-left ── */}
            <Image
                source={require('../assets/images/splash/leaf2.png')}
                style={[styles.icon, {
                    bottom: verticalScale(160),
                    left: horizontalScale(15),
                    width: horizontalScale(65),
                    height: horizontalScale(55),
                    transform: [{ rotate: '20deg' }],
                }]}
                resizeMode="contain"
            />
            <Image
                source={require('../assets/images/splash/fertilizer.png')}
                style={[styles.icon, {
                    bottom: verticalScale(80),
                    left: horizontalScale(25),
                    width: horizontalScale(40),
                    height: horizontalScale(60),
                }]}
                resizeMode="contain"
            />

            <Image
                source={require('../assets/images/splash/leaf4.png')}
                style={[styles.icon, {
                    bottom: verticalScale(30),
                    left: horizontalScale(90),
                    width: horizontalScale(70),
                    height: horizontalScale(70),
                    transform: [{ rotate: '50deg' }],
                }]}
                resizeMode="contain"
            />

            <Image
                source={require('../assets/images/splash/crop.png')}
                style={[styles.icon, {
                    bottom: verticalScale(20),
                    left: horizontalScale(26),
                    width: horizontalScale(55),
                    height: horizontalScale(55),
                }]}
                resizeMode="contain"
            />

            {/* ── Bottom-center ── */}
            <Image
                source={require('../assets/images/splash/wheat4.png')}
                style={[styles.icon, {
                    bottom: verticalScale(120),
                    left: '30%',
                    width: horizontalScale(55),
                    height: horizontalScale(55),
                    transform: [{ rotate: '-8deg' }],
                }]}
                resizeMode="contain"
            />
            <Image
                source={require('../assets/images/splash/corn.png')}
                style={[styles.icon, {
                    bottom: verticalScale(150),
                    left: '50%',
                    width: horizontalScale(55),
                    height: horizontalScale(55),
                    transform: [{ rotate: '10deg' }],
                }]}
                resizeMode="contain"
            />

            <Image
                source={require('../assets/images/splash/farmer2.png')}
                style={[styles.icon, {
                    bottom: verticalScale(75),
                    left: horizontalScale(180),
                    width: horizontalScale(70),
                    height: horizontalScale(60),
                }]}
                resizeMode="contain"
            />

            <Image
                source={require('../assets/images/splash/wheat2.png')}
                style={[styles.icon, {
                    bottom: verticalScale(25),
                    left: horizontalScale(200),
                    width: horizontalScale(50),
                    height: horizontalScale(50),
                    transform: [{ rotate: '60deg' }],
                }]}
                resizeMode="contain"
            />

            {/* ── Bottom-right ── */}
            <Image
                source={require('../assets/images/splash/leaf3.png')}
                style={[styles.icon, {
                    bottom: verticalScale(170),
                    right: horizontalScale(20),
                    width: horizontalScale(65),
                    height: horizontalScale(65),
                    transform: [{ rotate: '15deg' }],
                }]}
                resizeMode="contain"
            />
            <Image
                source={require('../assets/images/splash/wheat.png')}
                style={[styles.icon, {
                    bottom: verticalScale(80),
                    right: horizontalScale(15),
                    width: horizontalScale(80),
                    height: horizontalScale(80),
                    transform: [{ rotate: '-10deg' }],
                }]}
                resizeMode="contain"
            />
            <Image
                source={require('../assets/images/splash/leaf4.png')}
                style={[styles.icon, {
                    bottom: verticalScale(30),
                    right: horizontalScale(30),
                    width: horizontalScale(50),
                    height: horizontalScale(50),
                    transform: [{ rotate: '5deg' }],
                }]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    debugBanner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        zIndex: 999,
    },
    debugText: {
        color: '#FFD700',
        fontSize: 11,
        fontFamily: 'monospace',
        textAlign: 'center',
    },
    blob: {
        position: 'absolute',
        // Keep these in sync with index.tsx blob style
        width: horizontalScale(300),
        height: horizontalScale(260),
        backgroundColor: '#8BCB6B',
        borderTopLeftRadius: horizontalScale(120),
        borderTopRightRadius: horizontalScale(160),
        borderBottomLeftRadius: horizontalScale(220),
        borderBottomRightRadius: horizontalScale(180),
        transform: [{ rotate: '-6deg' }],
    },
    logoWrapper: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    logoImage: {
        width: horizontalScale(100),
        height: horizontalScale(100),
    },
    icon: {
        position: 'absolute',
    },
});
