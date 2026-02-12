// Purpose: To show the final results on screen after calculating amount of fertilizer.
// Author: 
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, horizontalScale, verticalScale, moderateScale, getHeaderFont, getRegularFont } from '@/styles/common';
import { commonTexts, nameOfFertilizers, resultTexts } from '@/constants/commonText';
import React from 'react';
import Microphone from '@/components/microphone';
import Header from '@/components/header';
import { useTranslation } from 'react-i18next';


export default function AnalysisResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    // paramerts providng amount of fertilizer
    const { urea, can, ammonium_sulfate, n_rate } = params;

    const isRTL = i18n.language === 'ur';

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header viewSize={moderateScale(25)} text={t('common.fertilizerAmount')} textSize={moderateScale(18)} />

            <View style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Spacer */}
                    <View style={commonStyles.midViewWidth} />

                    {/* Result Rows */}
                    <Animated.View entering={FadeInUp.delay(300).springify()} style={[styles.resultRow, isRTL ? styles.resultRowRTL : styles.resultRowLTR]}>
                        <Text style={[styles.resultValue, getHeaderFont(i18n.language)]}>{ammonium_sulfate || '-'}</Text>
                        <Text style={[styles.resultLabel, { textAlign: isRTL ? 'right' : 'left' }, getHeaderFont(i18n.language)]}>{t('fertilizers.ammonium_sulfate')}</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).springify()} style={[styles.resultRow, isRTL ? styles.resultRowRTL : styles.resultRowLTR]}>
                        <Text style={[styles.resultValue, getHeaderFont(i18n.language)]}>{urea || '-'}</Text>
                        <Text style={[styles.resultLabel, { textAlign: isRTL ? 'right' : 'left' }, getHeaderFont(i18n.language)]}>{t('fertilizers.urea')}</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(500).springify()} style={[styles.resultRow, isRTL ? styles.resultRowRTL : styles.resultRowLTR]}>
                        <Text style={[styles.resultValue, getHeaderFont(i18n.language)]}>{can || '-'}</Text>
                        <Text style={[styles.resultLabel, { textAlign: isRTL ? 'right' : 'left' }, getHeaderFont(i18n.language)]}>{t('fertilizers.can')}</Text>
                    </Animated.View>

                    {/* Summary Section */}
                    <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.summaryBox}>
                        <Text style={[styles.summaryText, getRegularFont(i18n.language)]}>
                            {t('results.recommendedNitrogenRate')} <Text style={[styles.summaryValue, getHeaderFont(i18n.language)]}>{n_rate || '-'}</Text> {t('results.perHectare')}
                        </Text>
                    </Animated.View>

                    {/* Home Button */}
                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => router.replace('/home')}
                    >
                        <Text style={[styles.homeButtonText, getHeaderFont(i18n.language)]}>{t('results.goToHomePage')}</Text>
                    </TouchableOpacity>
                </ScrollView>
                {/* Microphone Icon */}
                <Microphone />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    resultRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F1F8E9',
        borderRadius: moderateScale(50),
        borderWidth: 1,
        borderColor: '#C5E1A5',
        paddingVertical: verticalScale(15),
        paddingHorizontal: horizontalScale(30),
        marginBottom: verticalScale(20),
        ...commonStyles.shadowSmall,
    },
    resultLabel: {
        fontSize: moderateScale(16),
        color: 'black',
        flex: 1,
        marginBottom: verticalScale(5),
    },
    resultRowRTL: {
        flexDirection: 'row',
    },
    resultRowLTR: {
        flexDirection: 'row-reverse',
    },
    resultValue: {
        fontSize: moderateScale(18),
        color: 'black',
        fontWeight: 'bold',
    },
    summaryBox: {
        width: '100%',
        backgroundColor: '#DCEDC8',
        borderRadius: moderateScale(20),
        paddingVertical: verticalScale(20),
        paddingHorizontal: horizontalScale(20),
        marginTop: verticalScale(20),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#AED581',
        ...commonStyles.shadowSmall,
    },
    summaryText: {
        fontSize: moderateScale(15),
        color: '#33691E',
        textAlign: 'center',
        lineHeight: verticalScale(30),
    },
    summaryValue: {
        fontWeight: 'bold',
        color: 'black',
    },
    homeButton: {
        width: '100%',
        backgroundColor: '#33691E',
        borderRadius: moderateScale(50),
        paddingVertical: verticalScale(15),
        alignItems: 'center',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(40), // Extra margin for scrolling
        ...commonStyles.shadowSmall,
    },
    homeButtonText: {
        fontSize: moderateScale(16),
        color: 'white',
    },
});
