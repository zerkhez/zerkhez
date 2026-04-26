import Animated, { FadeInUp } from 'react-native-reanimated';
import { Image, StyleSheet, TouchableOpacity, PanResponder, Animated as RNAnimated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME_COLOR } from '@/constants/theme';
import { horizontalScale, verticalScale, moderateScale } from '@/styles/common';
import React from 'react';

function Microphone() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    // Pan responder for dragging the bot button
    const pan = React.useRef(new RNAnimated.ValueXY()).current;
    
    const panResponder = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only enable dragging if the user moves it more than a few pixels (prevents blocking taps)
                return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
            },
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: (pan.x as any)._value,
                    y: (pan.y as any)._value
                });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: RNAnimated.event(
                [
                    null,
                    { dx: pan.x, dy: pan.y }
                ],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                pan.flattenOffset();
            }
        })
    ).current;
    
    return (
        <Animated.View 
            entering={FadeInUp.delay(700).springify()} 
            style={[styles.container, { bottom: Math.max(insets.bottom, verticalScale(10)) + verticalScale(20) }]}
            pointerEvents="box-none"
        >
            <RNAnimated.View 
                {...panResponder.panHandlers} 
                style={[pan.getLayout()]}
            >
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/chat')}
                activeOpacity={0.8}
            >
                <Image
                    source={require('../assets/icons/chatbot.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
            </RNAnimated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: horizontalScale(20),
        zIndex: 999, // Ensure it stays on top of other elements
    },
    button: {
        width: horizontalScale(52),
        height: horizontalScale(52),
        borderRadius: horizontalScale(16),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(4) },
        shadowOpacity: 0.15,
        shadowRadius: moderateScale(8),
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },
    icon: {
        width: horizontalScale(26),
        height: horizontalScale(26),
        tintColor: THEME_COLOR,
    },
});

export default Microphone;
