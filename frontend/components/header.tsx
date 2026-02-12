import Animated, { FadeInDown } from 'react-native-reanimated';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import { commonStyles, getHeaderFont } from '@/styles/common';
import { moderateScale } from '@/styles/common';
import { useTranslation } from 'react-i18next';

function Header({ text, viewSize, textSize, fadeDuration, arrowColor }: { text: string, viewSize?: number, textSize?: number, fadeDuration?: number, arrowColor?: string }) {
    const router = useRouter();
    const { i18n } = useTranslation();

    return (
        <Animated.View entering={FadeInDown.duration(fadeDuration || 600).springify()} style={commonStyles.header}>
            <TouchableOpacity onPress={() => router.back()} style={commonStyles.backButton}>
                <Text style={{ fontSize: 28, color: arrowColor || "white", fontWeight: 'bold' }}>←</Text>
            </TouchableOpacity>
            <Text style={[
                commonStyles.headerTitle,
                getHeaderFont(i18n.language),
                { fontSize: textSize ? moderateScale(textSize) : moderateScale(24) }
            ]} >{text}</Text>
            <View style={{ width: viewSize || 40 }} />
        </Animated.View>
    );
}
export default Header;