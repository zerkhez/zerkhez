import Animated, { FadeInUp } from 'react-native-reanimated';
import { commonStyles } from '@/styles/common';
import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

function Microphone() {
    const router = useRouter();
    return (
        <Animated.View entering={FadeInUp.delay(700).springify()} style={commonStyles.micContainer}>
            <TouchableOpacity style={commonStyles.micButton} onPress={() => router.push('/chat')} activeOpacity={0.85}>
                <Text style={{ fontSize: 28 }}>🤖</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default Microphone;