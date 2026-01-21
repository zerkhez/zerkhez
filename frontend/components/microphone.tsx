import Animated, { FadeInUp } from 'react-native-reanimated';
import { commonStyles } from '@/styles/common';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

function Microphone() {
    return <Animated.View entering={FadeInUp.delay(700).springify()} style={commonStyles.micContainer}>
        <TouchableOpacity style={commonStyles.micButton}>
            <Ionicons name="mic" size={32} color="white" />
        </TouchableOpacity>
    </Animated.View>;
}

export default Microphone;