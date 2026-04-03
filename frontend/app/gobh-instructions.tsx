// Purpose: Show the gobh instructions for rice.
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { commonStyles, verticalScale, moderateScale, horizontalScale, getHeaderFont, getRegularFont } from '@/styles/common';
import Microphone from '@/components/microphone';
import Header from '@/components/header';

export default function GobhInstructionsScreen() {
    const params = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    const { typeName } = params;

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t("common.ofCrop", { cropName: typeName })} />

            {/* Content Container */}
            <View style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.titleContainer}>
                        <View style={styles.titleAccent} />
                        <Text style={[commonStyles.titleText, getHeaderFont(i18n.language), { textAlign: 'center', marginBottom: 0 }]}>
                            {t("rice.gobhInstructions.titleText")}
                        </Text>
                        <View style={styles.titleAccent} />
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(350).springify()} style={styles.instructionCard}>
                        <View style={styles.cardIconRow}>
                            <Text style={styles.cardIcon}>🌾</Text>
                        </View>
                        <Text style={[styles.instructionText, getRegularFont(i18n.language)]}>
                            {t("rice.gobhInstructions.instructionText")}
                        </Text>
                    </Animated.View>
                </ScrollView>
                {/* Mic Button */}
                <Microphone />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: verticalScale(24),
        marginBottom: verticalScale(24),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: horizontalScale(12),
    },
    titleAccent: {
        flex: 1,
        height: 2,
        backgroundColor: '#d4e4b0',
        borderRadius: 1,
    },
    instructionCard: {
        width: '100%',
        backgroundColor: '#f6f9f0',
        borderRadius: moderateScale(18),
        padding: moderateScale(20),
        borderWidth: 1,
        borderColor: '#dde8c8',
        shadowColor: '#4a6a10',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.06,
        shadowRadius: moderateScale(8),
        elevation: 2,
    },
    cardIconRow: {
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    cardIcon: {
        fontSize: moderateScale(32),
    },
    instructionText: {
        fontSize: moderateScale(15),
        color: '#3a4a1a',
        lineHeight: verticalScale(28),
        textAlign: 'center',
    },
});
