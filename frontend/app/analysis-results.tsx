// Purpose: To show the results on screen after calculating amount of fertilizer.
// Author: 
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME_COLOR } from '@/constants/theme';


export default function AnalysisResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { urea, can, ammonium_sulfate, n_rate } = params;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>کھاد کی مقدار (کلوگرام فی ایکڑ)</Text>
                <View style={{ width: 28 }} />
            </Animated.View>

            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Spacer */}
                    <View style={{ height: 40 }} />

                    {/* Result Rows */}
                    <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.resultRow}>
                        <Text style={styles.resultValue}>{ammonium_sulfate || '-'}</Text>
                        <Text style={styles.resultLabel}>امونیم سلفیٹ:</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.resultRow}>
                        <Text style={styles.resultValue}>{urea || '-'}</Text>
                        <Text style={styles.resultLabel}>یوریا:</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.resultRow}>
                        <Text style={styles.resultValue}>{can || '-'}</Text>
                        <Text style={styles.resultLabel}>کین (کیلشیم امونیم نائٹریٹ):</Text>
                    </Animated.View>

                    {/* Summary Section */}
                    <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.summaryBox}>
                        <Text style={styles.summaryText}>
                            تجویز کردہ نائٹروجن شرح: <Text style={styles.summaryValue}>{n_rate || '-'}</Text> کلوگرام فی ہیکٹر
                        </Text>
                    </Animated.View>

                </ScrollView>

                {/* Microphone Icon */}
                <Animated.View entering={FadeInUp.delay(700).springify()} style={styles.micContainer}>
                    <TouchableOpacity style={styles.micButton}>
                        <Ionicons name="mic" size={32} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME_COLOR,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: THEME_COLOR,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
        paddingBottom: 100,
    },
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
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
    micContainer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
    },
    micButton: {
        backgroundColor: '#7cb342', // Light green button color
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
