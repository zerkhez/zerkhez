import Animated, { FadeInUp } from 'react-native-reanimated';
import { Image, StyleSheet, TouchableOpacity, PanResponder, Animated as RNAnimated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME_COLOR } from '@/constants/theme';
import { horizontalScale, verticalScale, moderateScale } from '@/styles/common';
import React from 'react';

function Microphone() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const screenWidth = Dimensions.get('window').width;
    const buttonWidth = horizontalScale(52);
    const sideMargin = horizontalScale(20);

    // Snap positions relative to the container (which has left: sideMargin)
    // The container itself is offset by sideMargin, so pan positions are relative to that
    const leftSnapX = 0;
    const rightSnapX = screenWidth - buttonWidth - 2 * sideMargin;

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
            onPanResponderMove: (_, { dx, dy }) => {
                // Allow free vertical movement, constrain horizontal to dragging
                pan.x.setValue(dx);
                pan.y.setValue(dy);
            },
            onPanResponderRelease: () => {
                pan.flattenOffset();

                // Calculate current x position
                const currentX = (pan.x as any)._value;
                const distanceToLeft = Math.abs(currentX - leftSnapX);
                const distanceToRight = Math.abs(currentX - rightSnapX);

                // Determine which edge is closer
                const targetX = distanceToLeft < distanceToRight ? leftSnapX : rightSnapX;

                // Animate to the target position
                RNAnimated.spring(pan.x, {
                    toValue: targetX,
                    useNativeDriver: false,
                    speed: 12,
                    bounciness: 3,
                }).start();
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
