import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME_COLOR = '#4F611C';

export default function NitrogenInstructionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, name } = params;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ہدایات برائے کافی نائٹروجن پلاٹ</Text>
                <View style={{ width: 40 }} />
            </Animated.View>

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>


                    <View style={styles.card}>
                        {
                            id === 'wheat' ? (
                                <Text style={styles.instructionText}>تصویر کے ذریعے نا ئٹروجن کھاد کی مقدار معلوم کرنے کے لیے ’’کافی نائٹروجن پلاٹ‘‘ قائم کرنا ضروری ہے۔ اس کے لیے گندم کی کاشت کے بعد کھیت میں کسی بھی جگہ10 فٹ چوڑائی اور 10 فٹ لمبائی  کا ایک پلاٹ وٹ لگا کر بنائیں اور اس پلاٹ  میں کاشت کے بعد 150 گرام یوریا ، کاشت کے 30 دن بعد 150 گرام یوریا اور کاشت کے 60 دن بعد 150 گرام یوریا باقی کھاد کے علاوہ ڈالیں۔ اس پلاٹ میں یوریا بتائی گئی مقدار میں ڈالی جائے گی جبکہ دوسرےمداخل عام فصل کی طرح ہی ڈالے جائیں گے۔ اگر کسی ایک فارم پر ایک سے زیادہ کھیتوں میں ایک ہی گندم کی قسم ایک ہی وقت میں کاشت کی گئی ہے تو اس کے لیے ایک ہی ’’کافی نائٹروجن پلاٹ‘‘ قائم کرنا ہو گا۔کرنا ہو گا
                                </Text>
                            ) : id === 'maize' ? (
                                <Text style={styles.instructionText}> تصویر کے ذریعے نا ئٹروجن کھاد کی مقدار معلوم کرنے کے لیے ’’کافی نائٹروجن پلاٹ‘‘ قائم کرنا ضروری ہے۔ اس کے لیے مکیؑ کی کاشت کے بعد کھیت میں کسی بھی جگہ10 فٹ چوڑائی اور 10 فٹ لمبائی  کا ایک پلاٹ منتخب کریں اور اس پلاٹ  میں کاشت کے بعد اور پھرہرآبپاشی کے ساتھ 150 گرام یوریا باقی کھاد کے علاوہ ڈالیں۔ اس پلاٹ میں یوریا بتائی گئی مقدار میں ڈالی جائے گی جبکہ دوسرےمداخل عام فصل کی طرح ہی ڈالے جائیں گے۔ اگر کسی ایک فارم پر ایک سے زیادہ کھیتوں میں ایک ہی مکیؑ کی قسم ایک ہی وقت میں کاشت کی گئی ہے تو اس کے لیے ایک ہی ’’کافی نائٹروجن پلاٹ‘‘ قائم کرنا ہو گا۔
                                </Text>
                            ) : (
                                <Text style={styles.instructionText}>
                                    تصویر کے ذریعے نائٹروجن کھاد کی مقدار معلوم کرنے کے لیے کافی نائٹروجن پلاٹ قائم کرنا ضروری ہے۔ اس کے لیے پنیری کی منتقلی کے بعد کھیت میں کسی بھی جگ 10 فٹ چوڑائی اور 10 فٹ لمبائی کا ایک پلاٹ وٹ لگا کر بنائیں اور اس پلاٹ میں لاب لگانے کے بعد 150 گرام یوریا، بالیاں نکالتے وقت 200 گرام یوریا اور گوبھ پر 200 گرام یوریا ڈالیں۔ اس پلاٹ میں یوریا بتائی گئی مقدار میں ڈالی جائے گی جبکہ دوسرے مداخل عام فصل کی طرح ہی ڈالے جائیں گے۔ اگر کسی ایک فارم پر ایک سے زیادہ کھیتوں میں ایک ہی دھان کی قسم ایک ہی وقت میں کاشت کی گئی ہے تو اس کے لیے ایک ہی کافی نائٹروجن پلاٹ“ قائم کرنا ہو گا
                                </Text>
                            )
                        }
                    </View>
                </ScrollView>
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
        paddingBottom: 30,
    },
    titleText: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 22,
        color: THEME_COLOR,
        textAlign: 'right',
        marginBottom: 20,
        marginTop: 10,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    instructionText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 18,
        color: '#333',
        lineHeight: 32,
        textAlign: 'right',
    },
});
