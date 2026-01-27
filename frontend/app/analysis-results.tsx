// Purpose: To show the final results on screen after calculating amount of fertilizer.
// Author: 
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, horizontalScale, verticalScale, moderateScale } from '@/styles/common';
import { commonTexts, nameOfFertilizers, resultTexts } from '@/constants/commonText';
import React from 'react';
import Microphone from '@/components/microphone';
import Header from '@/components/header';


export default function AnalysisResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    // paramerts providng amount of fertilizer
    const { urea, can, ammonium_sulfate, n_rate } = params;

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header viewSize={moderateScale(28)} text={commonTexts.fertilizerAmount}/>

            <View style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Spacer */}
                    <View style={commonStyles.midViewWidth} />

                    {/* Result Rows */}
                    <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.resultRow}>
                        <Text style={styles.resultValue}>{ammonium_sulfate || '-'}</Text>
                        <Text style={styles.resultLabel}>{nameOfFertilizers.ammonium_sulfate}</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.resultRow}>
                        <Text style={styles.resultValue}>{urea || '-'}</Text>
                        <Text style={styles.resultLabel}>{nameOfFertilizers.urea}</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.resultRow}>
                        <Text style={styles.resultValue}>{can || '-'}</Text>
                        <Text style={styles.resultLabel}>{nameOfFertilizers.can}</Text>
                    </Animated.View>

                    {/* Summary Section */}
                    <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.summaryBox}>
                        <Text style={styles.summaryText}>
                            {resultTexts.recommendedNitrogenRate} <Text style={styles.summaryValue}>{n_rate || '-'}</Text> {resultTexts.perHectare}
                        </Text>
                    </Animated.View>
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
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: moderateScale(18),
        color: '#33691E',
        textAlign: 'right',
        flex: 1,
    },
    resultValue: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: moderateScale(20),
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
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: moderateScale(18),
        color: '#33691E',
        textAlign: 'center',
        lineHeight: verticalScale(30),
    },
    summaryValue: {
        fontWeight: 'bold',
        color: 'black',
    },
});

