import Animated, { FadeInDown } from 'react-native-reanimated';
import { StyleSheet, TouchableOpacity, View , Text } from 'react-native';
import { useRouter } from 'expo-router';
import { commonStyles, getHeaderFont , moderateScale } from '@/styles/common';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

function Header({ text, viewSize, textSize, fadeDuration, arrowColor }: { text: string, viewSize?: number, textSize?: number, fadeDuration?: number, arrowColor?: string }) {
    const router = useRouter();
    const { i18n } = useTranslation();
    const iconColor = arrowColor || 'white';

    return (
        <Animated.View entering={FadeInDown.duration(fadeDuration || 600).springify()} style={commonStyles.header}>
            <TouchableOpacity
                onPress={() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/home');
                    }
                }}
                style={styles.backBtn}
                activeOpacity={0.7}
            >
                <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
                    <Path
                        d="M15 19l-7-7 7-7"
                        stroke={iconColor}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </TouchableOpacity>
            <Text style={[
                commonStyles.headerTitle,
                getHeaderFont(i18n.language),
                { fontSize: textSize ? moderateScale(textSize) : moderateScale(20) }
            ]} >{text}</Text>
            <View style={{ width: viewSize || moderateScale(38) }} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    backBtn: {
        width: moderateScale(38),
        height: moderateScale(38),
        borderRadius: moderateScale(12),
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        marginRight: moderateScale(8),
    },
});

export default Header;