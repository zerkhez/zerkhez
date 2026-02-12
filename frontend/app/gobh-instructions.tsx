// Purpose: Show the gobh instructions for rice.
// Author:
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { commonStyles, verticalScale, moderateScale, horizontalScale, getRegularFont } from '@/styles/common';
import Microphone from '@/components/microphone';
import Header from '@/components/header';

export default function GobhInstructionsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t } = useTranslation();
    const { typeName } = params;

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t("common.ofCrop", { cropName: typeName })} />

            {/* Content Container */}
            <View style={commonStyles.contentContainer}>
                <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.titleContainer}>
                    <Text style={commonStyles.titleText}>
                        {t("rice.gobhInstructions.titleText")}
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.textContainer}>
                    <Text style={commonStyles.descriptionText}>
                        {t("rice.gobhInstructions.instructionText")}
                    </Text>
                </Animated.View>
                {/* Mic Button */}
                <Microphone />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: verticalScale(20),
        marginBottom: verticalScale(30),
    },
    textContainer: {
        marginBottom: verticalScale(20),
        width: '100%',
        paddingHorizontal: verticalScale(10),
        paddingVertical: verticalScale(20),
    },
    instructionText: {
        fontSize: moderateScale(18),
        color: 'black',
        // textAlign: 'right', // Removed to support both English and Urdu
        marginBottom: verticalScale(20),
        lineHeight: verticalScale(50),
    },
});
