import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME_COLOR } from '@/constants/theme';

export default function PrePlantingInstructionsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, name, stage } = params;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{name} کی فصل </Text>
                <View style={{ width: 40 }} />
            </Animated.View>

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>



                    <Text style={styles.packageText}>
                        بوقت کاشت مکئی کو منذرجہ ذیل میں سے کھادوں کا کوئی بھی پیکج ڈالا جا سکتا ہے۔
                    </Text>

                    <View style={styles.packageContainer}>
                        <Text style={styles.packageTitle}>پیکچ نمبر 1:</Text>
                        <Text style={styles.packageText}>
                            ہاںؑبرڈ اقسام کے لیے اڑھائی بوری ڈی اے پی + ڈیڑھ بوری پوٹاشیم سلفیٹ فی ایکڑ۔
                            عام دیسی اقسام کے لیے دو بوری ڈی اے پی + ڈیڑھ بوری پوٹاشیم سلفیٹ فی ایکڑ۔

                        </Text>
                    </View>

                    <View style={styles.packageContainer}>
                        <Text style={styles.packageTitle}>پیکچ نمبر 2:</Text>
                        <Text style={styles.packageText}>
                            اںؑبرڈ اقسام کے لیے ساڑھے چھ بوری سنگل سپرفاسفیٹ (18 فیصد) + ڈیڑھ بوری پوٹاشیم سلفیٹ + ایک بوری یوریا فی ایکڑ۔
                            عام دیسی اقسام کے لیے پانچ بوری سنگل سپرفاسفیٹ (18 فیصد) + ڈیڑھ بوری پوٹاشیم سلفیٹ + پونی بوری یوریا فی ایکڑ۔
                        </Text>
                    </View>

                    <Text style={styles.noteText}>
                        اگر آپ کوئی اور پیکج بنانا چاہتے ہیں تونیچے بٹن پر کلک کریں، پیج کُھلنے پر نا ئٹروجن، فاسفورس اور پوٹاش کی جگہ پر بلترتیب 22، 58 اور37 ہاںؑبرڈ اقسام کے لیے، اور 18، 46 اور37  عام دیسی اقسام کے لیے درج کریں اور گروپ ۱، گروپ ۲ اور گروپ ۳ میں سے اپنی مرضی کی ایک ایک کھاد کا چناؤ کریں۔
                    </Text>

                    <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                // Navigate to crop-types for now as the next logical step or a placeholder
                                router.push({
                                    pathname: '/fertilizer-selection' as any,
                                    params: { id, name }
                                });
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.actionButtonText}>کھاد کا  پیکچ بنائیں</Text>
                        </TouchableOpacity>
                        {/* Connecting line effect from screenshot could be a simple view or ignored if too complex, 
                            but the screenshot shows a line connecting to the button. 
                            I'll stick to the button design for now. */}
                    </Animated.View>

                </ScrollView>
            </Animated.View>

            {/* Mic Button */}
            <Animated.View entering={ZoomIn.delay(800).springify()} style={styles.micContainer}>
                <TouchableOpacity style={styles.micButton}>
                    <Image source={require('../../assets/icons/mic.png')} style={styles.micIcon} resizeMode="contain" />
                </TouchableOpacity>
            </Animated.View>
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
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 100,
        alignItems: 'center',
    },
    titleText: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 22,
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
    },
    descriptionText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 16,
        color: 'black',
        textAlign: 'right',
        marginBottom: 20,
        lineHeight: 28,
    },
    packageContainer: {
        width: '100%',
        marginBottom: 15,
        alignItems: 'flex-end', // Right align for Urdu
    },
    packageTitle: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 18,
        color: 'black',
        textAlign: 'right',
        marginBottom: 5,
    },
    packageText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 16,
        color: 'black',
        textAlign: 'right',
        lineHeight: 26,
    },
    noteText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 15,
        color: 'black',
        textAlign: 'right',
        marginTop: 20,
        marginBottom: 30,
        lineHeight: 26,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: '#b5d985',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#a3c970',
    },
    actionButtonText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 18,
        color: 'black',
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
