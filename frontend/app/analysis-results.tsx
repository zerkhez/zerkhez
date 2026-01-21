// Purpose: To show the final results on screen after calculating amount of fertilizer.
// Author: 
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '@/styles/common';
import { commonTexts, nameOfFertilizers, resultTexts } from '@/constants/commonText';


export default function AnalysisResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    // paramerts providng amount of fertilizer
    const { urea, can, ammonium_sulfate, n_rate } = params;

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} style={commonStyles.header}>
                <TouchableOpacity onPress={() => router.back()} style={commonStyles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={commonStyles.headerTitle}>{commonTexts.fertilizerAmount}</Text>
                <View style={{ width: 28 }} />
            </Animated.View>

            <View style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Spacer */}
                    <View style={{ height: 40 }} />

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
                <Animated.View entering={FadeInUp.delay(700).springify()} style={commonStyles.micContainer}>
                    <TouchableOpacity style={commonStyles.micButton}>
                        <Ionicons name="mic" size={32} color="white" />
                    </TouchableOpacity>
                </Animated.View>
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
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#C5E1A5',
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginBottom: 20,
        ...commonStyles.shadowSmall,
    },
    resultLabel: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 18,
        color: '#33691E',
        textAlign: 'right',
        flex: 1,
    },
    resultValue: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    summaryBox: {
        width: '100%',
        backgroundColor: '#DCEDC8',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#AED581',
        ...commonStyles.shadowSmall,
    },
    summaryText: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 18,
        color: '#33691E',
        textAlign: 'center',
        lineHeight: 30,
    },
    summaryValue: {
        fontWeight: 'bold',
        color: 'black',
    },
});
