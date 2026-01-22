import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME_COLOR } from '@/constants/theme';
import Microphone from '@/components/microphone';
import { commonTexts } from '@/constants/commonText';
import Header from '@/components/header';

const CROP_DAT_CONFIG: Record<string, { min: number; max: number }> = {
    'سونا سپر باسمتی - 282': { min: 47, max: 60 },
    'کسان باسمتی': { min: 30, max: 43 },
    'سپر باسمتی': { min: 54, max: 65 },
    'باسمتی - 515': { min: 49, max: 61 },
    'پی کے خوشبودار - 1121': { min: 55, max: 70 },
    'پی کے خوشبودار - 2021': { min: 50, max: 65 },
};

export default function NitrogenCalculatorScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { typeName, id, name } = params;
    const [selectedDate, setSelectedDate] = useState('');

    const validationState = useMemo(() => {
        if (id === 'maize') return { state: 'valid', days: 0 };

        if (!selectedDate) return { state: 'idle', days: 0 };

        const today = new Date();
        const selected = new Date(selectedDate);
        const diffTime = Math.abs(today.getTime() - selected.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (selected > today) return { state: 'idle', days: 0 };

        if (id === 'wheat') {
            return { state: 'valid', days: diffDays };
        }

        if (!typeName) return { state: 'idle', days: 0 };

        const cropName = Array.isArray(typeName) ? typeName[0] : typeName;
        const config = CROP_DAT_CONFIG[cropName];

        if (!config) return { state: 'idle', days: 0 };

        if (diffDays < config.min) return { state: 'early', days: diffDays, config };
        if (diffDays > config.max) return { state: 'late', days: diffDays, config };

        return { state: 'valid', days: diffDays };
    }, [selectedDate, typeName, id]);


    const handleSelectionMode = (useCamera: boolean) => {
        console.log("Days are ", validationState.days)
        router.push({
            pathname: '/image-analysis',
            params: {
                mode: useCamera ? 'camera' : 'gallery',
                typeName: typeName,
                dat: validationState.days,
                id,
                name
            }
        });
    };
    const riceRenderMessage = () => {
        const min = 30;
        const max = 70;
        const today = new Date();
        const selected = new Date(selectedDate);
        const diffTime = Math.abs(today.getTime() - selected.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If selected date is in future, it's 0 days (or negative, but abs handles diff, logic assumes past)
        let state = "";

        if (diffDays < min) {
            state = "early";
        }
        if (diffDays > max) {
            state = "late";
        }
        if (state === 'early') {
            return (
                <Animated.View entering={FadeInUp.duration(400)} style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        گندم کی فصل کو بالائی کھاد دو دفعہ یعنی بوائی کے 30 سے 40 دن بعد تک اور بوائی کے 50 سے 70 دن بعد تک ڈالی جا سکتی ہے۔ تصویر کے ذریعے بالائی کھاد معلوم کرنے کے لیے گندم کی قسم کا انتخاب کریں
                    </Text>
                </Animated.View>
            )
        }

        if (state === 'late') {
            return (
                <Animated.View entering={FadeInUp.duration(400)} style={styles.messageContainer}>
                    <Text style={styles.messageText}>آپ کی گندم کی فصل کو نائٹروجنی کھاد ڈالنے کا وقت گزر چکا ہے۔</Text>
                </Animated.View>
            )


        }
    }
    const renderMessage = () => {
        if (validationState.state === 'idle' || validationState.state === 'valid') return null;

        const { state, days, config } = validationState;
        const cropName = Array.isArray(typeName) ? typeName[0] : typeName;

        if (state === 'early') {

            return (
                <Animated.View entering={FadeInUp.duration(400)} style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        تصویر کے ذریعے {cropName} کو کھاد ڈالنے کا مناسب وقت لاب لگانے کے {config?.min} تا {config?.max} دن تک ہے جبکہ آپ کی فصل کے ابھی
                        <Text style={styles.redText}> {days} </Text>
                        دن ہوئے ہیں۔
                    </Text>
                </Animated.View>
            );
        }

        if (state === 'late') {
            return (
                <Animated.View entering={FadeInUp.duration(400)} style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        تصویر کے ذریعے {cropName} کو کھاد ڈالنے کا مناسب وقت لاب لگانے کے {config?.min} تا {config?.max} دن تک ہے جبکہ آپ کی فصل کے
                        <Text style={styles.redText}> {days} </Text>
                        دن ہو چکے ہیں۔ تاہم پھول آنے سے قبل کھاد ڈالی جا سکتی ہے۔
                    </Text>
                </Animated.View>
            );
        }
    };

    const isButtonsDisabled = validationState.state === 'early' || validationState.state === 'idle';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header text={commonTexts.calculateNitrogenFertilizer} />

            {/* Content Container */}
            <View style={styles.contentContainer}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {id !== "maize" && (
                        <>
                            <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.titleContainer}>
                                {id === "rice" ? (
                                    <Text style={styles.pageTitle}>لاب لگانے کی تاریخ منتخب کریں:</Text>
                                ) : (
                                    <Text style={styles.pageTitle}>بیج لگانے کی تاریخ منتخب کریں:</Text>
                                )}
                            </Animated.View>

                            {/* Calendar */}
                            <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.calendarContainer}>
                                <Calendar
                                    onDayPress={day => {
                                        setSelectedDate(day.dateString);
                                    }}
                                    markedDates={{
                                        [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: 'orange' }
                                    }}
                                    theme={{
                                        backgroundColor: '#ffffff',
                                        calendarBackground: '#ffffff',
                                        textSectionTitleColor: '#b6c1cd',
                                        selectedDayBackgroundColor: '#00adf5',
                                        selectedDayTextColor: '#ffffff',
                                        todayTextColor: '#00adf5',
                                        dayTextColor: '#2d4150',
                                        textDisabledColor: '#d9e1e8',
                                        dotColor: '#00adf5',
                                        selectedDotColor: '#ffffff',
                                        arrowColor: 'orange',
                                        disabledArrowColor: '#d9e1e8',
                                        monthTextColor: 'black',
                                        indicatorColor: 'blue',
                                        textDayFontWeight: '200',
                                        textMonthFontWeight: 'bold',
                                        textDayHeaderFontWeight: '300',
                                        textDayFontSize: 16,
                                        textMonthFontSize: 16,
                                        textDayHeaderFontSize: 16
                                    }}
                                    style={styles.calendar}
                                />
                            </Animated.View>
                        </>
                    )}


                    {id === "rice" && renderMessage()}
                    {id === "wheat" && riceRenderMessage()}

                    {/* Buttons */}
                    <Animated.View entering={FadeInUp.delay(400).springify()} style={[styles.buttonContainer, isButtonsDisabled && styles.disabledContainer]}>
                        <TouchableOpacity
                            style={[styles.actionButton, isButtonsDisabled && styles.disabledButton]}
                            onPress={() => handleSelectionMode(true)}
                            activeOpacity={0.8}
                            disabled={isButtonsDisabled}
                        >
                            <Text style={styles.actionButtonText}>کیمرا سے تصویر لیں</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.secondaryButton, isButtonsDisabled && styles.disabledButton]}
                            onPress={() => { handleSelectionMode(false); }}
                            activeOpacity={0.8}
                            disabled={isButtonsDisabled}
                        >
                            <Text style={styles.actionButtonText}>پہلے سے لی گئی تصویر منتخب کریں</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>

                {/* Mic Button */}
                <Microphone />
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
    },
    backButton: {
        padding: 5,
    },
    backIcon: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden', // Ensure content doesn't bleed out
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
        paddingBottom: 100, // Extra space for Mic button
    },
    titleContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    pageTitle: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 20,
        color: 'black',
        textAlign: 'right',
    },
    calendarContainer: {
        width: '100%',
        marginBottom: 20, // Reduced margin
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    calendar: {
        borderRadius: 15,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 15,
        marginTop: 20,
    },
    disabledContainer: {
        opacity: 0.5,
    },
    actionButton: {
        backgroundColor: '#b5d985',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#a3c970',
    },
    disabledButton: {
        backgroundColor: '#e0e0e0',
        borderColor: '#ccc',
    },
    secondaryButton: {
        backgroundColor: '#b5d985',
    },
    actionButtonText: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 12,
        color: 'black',
        textAlign: 'center',
    },
    micContainer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
    },
    micButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6a8a2c',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    micIcon: {
        width: 30,
        height: 30,
        tintColor: 'white',
    },
    messageContainer: {
        width: '100%',
        padding: 15,
        // backgroundColor: '#f8f9fa',
        // borderRadius: 10,
        // borderWidth: 1,
        // borderColor: '#ddd',
        marginBottom: 10,
        alignItems: 'center',
    },
    messageText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
        lineHeight: 28,
    },
    redText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 18,
    },
    returnButton: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: '#eee',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    returnButtonText: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 14,
        color: 'black',
    }
});
