import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Microphone from '@/components/microphone';
import Header from '@/components/header';
import { commonStyles, horizontalScale, verticalScale, moderateScale, getRegularFont, getHeaderFont } from '@/styles/common';
import { THEME_COLOR } from '@/constants/theme';


// Index-based DAT configuration for rice varieties (matches order in locale files)
const RICE_DAT_CONFIG = [
    { min: 47, max: 60 }, // Index 0: Sona Super Basmati - 282
    { min: 30, max: 43 }, // Index 1: Kisan Basmati
    { min: 54, max: 65 }, // Index 2: Super Basmati
    { min: 49, max: 61 }, // Index 3: Basmati - 515
    { min: 55, max: 70 }, // Index 4: PK Aromatic - 1121
    { min: 50, max: 65 }, // Index 5: PK Aromatic - 2021
];

export default function NitrogenCalculatorScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    const { id, name } = params;

    const isRTL = i18n.language === 'ur';

    // Get crop type index from params
    const cropTypeIndex = useMemo(() => {
        const rawIndex = params.cropTypeIndex;
        const index = Array.isArray(rawIndex) ? parseInt(rawIndex[0]) : parseInt(rawIndex as string);
        return isNaN(index) ? -1 : index;
    }, [params.cropTypeIndex]);

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

        if (!cropName || cropTypeIndex === -1) return { state: 'idle', days: 0 };

        const config = RICE_DAT_CONFIG[cropTypeIndex] || null;

        if (!config) return { state: 'idle', days: 0 };

        if (diffDays < config.min) return { state: 'early', days: diffDays, config };
        if (diffDays > config.max) return { state: 'late', days: diffDays, config };

        return { state: 'valid', days: diffDays };
    }, [selectedDate, cropName, cropTypeIndex, id]);

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
            <Text style={[styles.messageText, getRegularFont(i18n.language)]}>{children}</Text>
        </Animated.View>
    );

    const renderValidationMessage = () => {
        const { state, days, config } = validationState;
        if (state === 'idle' || state === 'valid') return null;

        if (id === 'wheat') {
            if (state === 'early') {
                return (
                    <StatusMessage>
                        {t('nitrogenCalculator.wheatEarlyMessage')}
                    </StatusMessage>
                );
            }
            return (
                <StatusMessage>{t('nitrogenCalculator.wheatLateMessage')}</StatusMessage>
            );
        }

        if (state === 'early') {
            return (
                <StatusMessage>
                    {t('nitrogenCalculator.riceEarlyMessage', {
                        cropName,
                        min: config?.min,
                        max: config?.max,
                        days
                    })}
                </StatusMessage>
            );
        }

        return (
            <StatusMessage>
                {t('nitrogenCalculator.riceLateMessage', {
                    cropName,
                    min: config?.min,
                    max: config?.max,
                    days
                })}
            </StatusMessage>
        );
    };

    const isButtonsDisabled = validationState.state === 'early' || validationState.state === 'idle';

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t('common.calculateNitrogenFertilizer')} textSize={moderateScale(15)} />

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
                                    <Text style={commonStyles.titleText}>{t('nitrogenCalculator.selectTransplantDate')}</Text>
                                ) : (
                                    <Text style={commonStyles.titleText}>{t('nitrogenCalculator.selectPlantingDate')}</Text>
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
                                        arrowColor: THEME_COLOR,
                                        disabledArrowColor: '#d9e1e8',
                                        monthTextColor: 'black',
                                        indicatorColor: 'blue',
                                        textDayFontWeight: '200',
                                        textMonthFontWeight: 'bold',
                                        textDayHeaderFontWeight: '300',
                                        textDayFontSize: moderateScale(16),
                                        textMonthFontSize: moderateScale(16),
                                        textDayHeaderFontSize: moderateScale(16)
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
                            <Text style={commonStyles.actionButtonText}>{t('nitrogenCalculator.takePictureWithCamera')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[commonStyles.actionButton, styles.secondaryButton, isButtonsDisabled && styles.disabledButton]}
                            onPress={() => { handleSelectionMode(false); }}
                            activeOpacity={0.8}
                            disabled={isButtonsDisabled}
                        >
                            <Text style={commonStyles.actionButtonText}>{t('nitrogenCalculator.selectExistingPicture')}</Text>
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
        marginTop: verticalScale(20),
        marginBottom: verticalScale(10),
        width: '100%',
    },
    calendarContainer: {
        width: '100%',
        marginBottom: verticalScale(20), // Reduced margin
        borderRadius: moderateScale(15),
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(3),
    },
    calendar: {
        borderRadius: moderateScale(15),
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: verticalScale(15),
        marginTop: verticalScale(20),
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
        padding: moderateScale(15),
        marginBottom: verticalScale(10),
        alignItems: 'center',
    },
    messageText: {
        fontSize: moderateScale(16),
        color: 'black',
        textAlign: 'center',
        marginTop: verticalScale(20),
        lineHeight: verticalScale(28),
    },
    redText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: moderateScale(18),
    },
    returnButton: {
        marginTop: verticalScale(10),
        paddingVertical: verticalScale(8),
        paddingHorizontal: horizontalScale(20),
        backgroundColor: '#eee',
        borderRadius: moderateScale(5),
        borderWidth: 1,
        borderColor: '#ccc',
    },
    returnButtonText: {
        fontSize: moderateScale(14),
        color: 'white',
    },
});
