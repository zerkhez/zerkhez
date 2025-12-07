import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const THEME_COLOR = '#4F611C';

export default function NitrogenCalculatorScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { typeName } = params;
    const [selectedDate, setSelectedDate] = useState('');

    const pickImage = async (useCamera: boolean) => {
        let result;
        if (useCamera) {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                alert("You've refused to allow this appp to access your camera!");
                return;
            }
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        } else {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
                alert("You've refused to allow this appp to access your photos!");
                return;
            }
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        }

        if (!result.canceled) {
            console.log(result.assets[0].uri);
            // Handle image selection here (e.g., upload to API or show preview)
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>نائٹروجن کھاد معلوم کریں</Text>
                <View style={{ width: 40 }} />
            </Animated.View>

            {/* Content Container */}
            <View style={styles.contentContainer}>
                <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.titleContainer}>
                    <Text style={styles.pageTitle}>لاب لگانے کی تاریخ منتخب کریں:</Text>
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
                            textDayFontFamily: 'NotoNastaliqUrdu-Regular',
                            textMonthFontFamily: 'NotoNastaliqUrdu-Bold',
                            textDayHeaderFontFamily: 'NotoNastaliqUrdu-Regular',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 16
                        }}
                        style={styles.calendar}
                    />
                </Animated.View>

                {/* Buttons */}
                <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => pickImage(true)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.actionButtonText}>کیمرا سے تصویر لیں</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => pickImage(false)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.actionButtonText}>پہلے سے لی گئی تصویر منتخب کریں</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Mic Button */}
                <Animated.View entering={ZoomIn.delay(500).springify()} style={styles.micContainer}>
                    <TouchableOpacity style={styles.micButton}>
                        <Image source={require('../assets/icons/mic.png')} style={styles.micIcon} resizeMode="contain" />
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
        padding: 20,
        alignItems: 'center',
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
        marginBottom: 30,
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
    secondaryButton: {
        backgroundColor: '#b5d985', // Same color as per design, or slightly different if needed
    },
    actionButtonText: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 18,
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
});
