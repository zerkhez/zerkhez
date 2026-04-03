import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { commonStyles, horizontalScale, verticalScale, moderateScale, getRegularFont } from '@/styles/common';
import Header from '@/components/header';

export default function NitrogenInstructionScreen() {
    const params = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    const { id } = params;

    const cropId = Array.isArray(id) ? id[0] : id || '';

    const cropIcon = cropId === 'wheat' ? '🌾' : cropId === 'maize' ? '🌽' : '🍚';

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t('common.instructionsForNitrogenPlot')} textSize={15} />

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        {/* <View style={styles.cardIconRow}>
                            <Text style={styles.cardIcon}>{cropIcon}</Text>
                        </View> */}
                        <Text style={[styles.instructionText, getRegularFont(i18n.language)]}>
                            {cropId === 'wheat'
                                ? t('wheat.nitrogenInstructions')
                                : cropId === 'maize'
                                    ? t('maize.nitrogenInstructions')
                                    : t('rice.nitrogenInstructions')
                            }
                        </Text>
                    </View>
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        paddingTop: verticalScale(24),
        paddingHorizontal: horizontalScale(20),
    },
    scrollContent: {
        paddingBottom: verticalScale(30),
    },
    card: {
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
