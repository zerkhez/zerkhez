import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Microphone from '@/components/microphone';
import Header from '@/components/header';
import { commonStyles, verticalScale, moderateScale, getHeaderFont, getRegularFont, horizontalScale } from '@/styles/common';
import { useTranslation } from 'react-i18next';
import { THEME_COLOR } from '@/constants/theme';

export default function ResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t, i18n } = useTranslation();

    const isRTL = i18n.language === 'ur';

    // Parse params
    const results = params.results ? JSON.parse(params.results as string) : {};
    const warnings = params.warnings ? JSON.parse(params.warnings as string) : {};
    const requirements = params.requirements ? JSON.parse(params.requirements as string) : null;

    const resultItems = Object.entries(results);

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t('common.results')} />

            <View style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.titleContainer}>
                        <Text style={[commonStyles.titleText, getHeaderFont(i18n.language), { textAlign: isRTL ? 'right' : 'left' }]}>
                            {t('common.fertilizerAmount')}
                        </Text>
                    </Animated.View>

                    {/* Result Boxes */}
                    {resultItems.map(([name, amount], index) => (
                        <Animated.View 
                            key={name}
                            entering={FadeInUp.delay(300 + index * 100).springify()} 
                            style={[styles.resultBox, isRTL ? styles.resultRowRTL : styles.resultRowLTR]}
                        >
                            <Text style={[styles.resultValue, getHeaderFont(i18n.language)]}>{typeof amount === 'number' ? amount.toFixed(2) : String(amount)} {t('results.perHectare').split(' ')[0] === 'Kilograms' ? 'kg' : ''}</Text>
                            <Text style={[styles.resultLabel, { textAlign: isRTL ? 'right' : 'left' }, getHeaderFont(i18n.language)]}>{name}</Text>
                        </Animated.View>
                    ))}

                    {/* Warnings Section */}
                    {Object.values(warnings).map((warning, index) => (
                        <Animated.View 
                            key={`warning-${index}`}
                            entering={FadeInUp.delay(600).springify()} 
                            style={styles.warningBox}
                        >
                            <Text style={[styles.warningText, getRegularFont(i18n.language)]}>
                                {String(warning)}
                            </Text>
                        </Animated.View>
                    ))}

                    {/* Back to Home Button */}
                    <Animated.View entering={FadeInUp.delay(800).springify()} style={{ width: '100%', alignItems: 'center', marginTop: verticalScale(20) }}>
                        <TouchableOpacity
                            style={commonStyles.actionButton}
                            onPress={() => router.replace('/home')}
                            activeOpacity={0.8}
                        >
                            <Text style={[commonStyles.actionButtonText, getHeaderFont(i18n.language)]}>{t('results.goToHomePage')}</Text>
                        </TouchableOpacity>
                    </Animated.View>

                </ScrollView>

                {/* Microphone Icon */}
                <Microphone />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: verticalScale(20),
        marginBottom: verticalScale(30),
        width: '100%',
    },
    resultBox: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f1f8e9',
        borderRadius: moderateScale(15),
        borderWidth: 1,
        borderColor: '#81c784',
        paddingVertical: verticalScale(20),
        paddingHorizontal: horizontalScale(20),
        marginBottom: verticalScale(15),
        elevation: 2,
    },
    resultRowRTL: {
        flexDirection: 'row',
    },
    resultRowLTR: {
        flexDirection: 'row-reverse',
    },
    resultLabel: {
        fontSize: moderateScale(16),
        color: 'black',
        flex: 1,
    },
    resultValue: {
        fontSize: moderateScale(18),
        color: THEME_COLOR,
        fontWeight: 'bold',
    },
    warningBox: {
        width: '100%',
        backgroundColor: '#fff3e0',
        borderRadius: moderateScale(15),
        borderWidth: 1,
        borderColor: '#ffb74d',
        padding: moderateScale(15),
        marginTop: verticalScale(10),
        marginBottom: verticalScale(20),
    },
    warningText: {
        fontSize: moderateScale(14),
        color: '#e65100',
        textAlign: 'center',
        lineHeight: verticalScale(22),
    },
});

