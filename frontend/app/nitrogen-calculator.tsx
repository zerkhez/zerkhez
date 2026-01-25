import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Microphone from '@/components/microphone';
import { commonTexts } from '@/constants/commonText';
import Header from '@/components/header';
import { commonStyles } from '@/styles/common';

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
    const { id, name } = params;

    // Normalize typeName to a single string
    const cropName = useMemo(() => {
        const rawTypeName = params.typeName;
        return Array.isArray(rawTypeName) ? rawTypeName[0] : rawTypeName || '';
    }, [params.typeName]);

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
            const min = 30;
            const max = 70;
            if (diffDays < min) return { state: 'early', days: diffDays, config: { min, max } };
            if (diffDays > max) return { state: 'late', days: diffDays, config: { min, max } };
            return { state: 'valid', days: diffDays };
        }

        if (!cropName) return { state: 'idle', days: 0 };

        const config = Object.prototype.hasOwnProperty.call(CROP_DAT_CONFIG, cropName)
            ? CROP_DAT_CONFIG[cropName]
            : null;

        if (!config) return { state: 'idle', days: 0 };

        if (diffDays < config.min) return { state: 'early', days: diffDays, config };
        if (diffDays > config.max) return { state: 'late', days: diffDays, config };

        return { state: 'valid', days: diffDays };
    }, [selectedDate, cropName, id]);

    const handleSelectionMode = (useCamera: boolean) => {
        router.push({
            pathname: '/image-analysis',
            params: {
                mode: useCamera ? 'camera' : 'gallery',
                typeName: cropName,
                dat: validationState.days,
                id,
                name
            }
        });
    };

    const StatusMessage = ({ children }: { children: React.ReactNode }) => (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.messageContainer}>
            <Text style={styles.messageText}>{children}</Text>
        </Animated.View>
    );

    const renderValidationMessage = () => {
        const { state, days, config } = validationState;
        if (state === 'idle' || state === 'valid') return null;

        if (id === 'wheat') {
            if (state === 'early') {
                return (
                    <StatusMessage>
                        گندم کی فصل کو بالائی کھاد دو دفعہ یعنی بوائی کے 30 سے 40 دن بعد تک اور بوائی کے 50 سے 70 دن بعد تک ڈالی جا سکتی ہے۔ تصویر کے ذریعے بالائی کھاد معلوم کرنے کے لیے گندم کی قسم کا انتخاب کریں
                    </StatusMessage>
                );
            }
            return (
                <StatusMessage>آپ کی گندم کی فصل کو نائٹروجنی کھاد ڈالنے کا وقت گزر چکا ہے۔</StatusMessage>
            );
        }

        if (state === 'early') {
            return (
                <StatusMessage>
                    تصویر کے ذریعے {cropName} کو کھاد ڈالنے کا مناسب وقت لاب لگانے کے {config?.min} تا {config?.max} دن تک ہے جبکہ آپ کی فصل کے ابھی
                    <Text style={styles.redText}> {days} </Text>
                    دن ہوئے ہیں۔
                </StatusMessage>
            );
        }

        return (
            <StatusMessage>
                تصویر کے ذریعے {cropName} کو کھاد ڈالنے کا مناسب وقت لاب لگانے کے {config?.min} تا {config?.max} دن تک ہے جبکہ آپ کی فصل کے
                <Text style={styles.redText}> {days} </Text>
                دن ہو چکے ہیں۔ تاہم پھول آنے سے قبل کھاد ڈالی جا سکتی ہے۔
            </StatusMessage>
        );
    };

    const isButtonsDisabled = validationState.state === 'early' || validationState.state === 'idle';

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={commonTexts.calculateNitrogenFertilizer} />

            {/* Content Container */}
            <View style={commonStyles.contentContainer}>
                <ScrollView
                    contentContainerStyle={commonStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {id !== "maize" && (
                        <>
                            <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.titleContainer}>
                                {id === "rice" ? (
                                    <Text style={commonStyles.titleText}>لاب لگانے کی تاریخ منتخب کریں:</Text>
                                ) : (
                                    <Text style={commonStyles.titleText}>بیج لگانے کی تاریخ منتخب کریں:</Text>
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

                    {renderValidationMessage()}

                    {/* Buttons */}
                    <Animated.View entering={FadeInUp.delay(400).springify()} style={[styles.buttonContainer, isButtonsDisabled && styles.disabledContainer]}>
                        <TouchableOpacity
                            style={[commonStyles.actionButton, isButtonsDisabled && styles.disabledButton]}
                            onPress={() => handleSelectionMode(true)}
                            activeOpacity={0.8}
                            disabled={isButtonsDisabled}
                        >
                            <Text style={commonStyles.actionButtonText}>کیمرا سے تصویر لیں</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[commonStyles.actionButton, styles.secondaryButton, isButtonsDisabled && styles.disabledButton]}
                            onPress={() => { handleSelectionMode(false); }}
                            activeOpacity={0.8}
                            disabled={isButtonsDisabled}
                        >
                            <Text style={commonStyles.actionButtonText}>پہلے سے لی گئی تصویر منتخب کریں</Text>
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
    titleContainer: {
        marginTop: 20,
        marginBottom: 20,
        width: '100%',
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
    disabledButton: {
        backgroundColor: '#e0e0e0',
        borderColor: '#ccc',
    },
    secondaryButton: {
        backgroundColor: '#b5d985',
    },
    messageContainer: {
        width: '100%',
        padding: 15,
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

