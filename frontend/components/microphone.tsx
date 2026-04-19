import Animated, { FadeInUp } from 'react-native-reanimated';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { THEME_COLOR } from '@/constants/theme';
import { horizontalScale, verticalScale, moderateScale } from '@/styles/common';

function Microphone() {
    const router = useRouter();
    return (
        <Animated.View entering={FadeInUp.delay(700).springify()} style={styles.container}>
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
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: verticalScale(30),
        left: horizontalScale(20),
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
