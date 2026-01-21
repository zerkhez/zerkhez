import Animated, { FadeInDown } from 'react-native-reanimated';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import { commonStyles } from '@/styles/common';
import Ionicons from '@expo/vector-icons/Ionicons';

function Header({text, viewSize, textSize, fadeDuration, arrowColor}:{text: string, viewSize?: number, textSize?: number, fadeDuration?: number, arrowColor?: string}) {
    const router = useRouter();
    return (
        <Animated.View entering={FadeInDown.duration(fadeDuration || 600).springify()} style={commonStyles.header}>
            <TouchableOpacity onPress={() => router.back()} style={commonStyles.backButton}>
                <Ionicons name="arrow-back" size={textSize || 28} color={arrowColor || "white"} />
            </TouchableOpacity>
            <Text style={commonStyles.headerTitle}>{text}</Text>
            <View style={{ width: viewSize || 40 }} />
        </Animated.View>
    );
}
export default Header;