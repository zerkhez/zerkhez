import Header from '@/components/header';
import Microphone from '@/components/microphone';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME_COLOR = '#4F611C';

export default function SproutInstructionsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { typeName } = params;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header text={typeName}/>

            {/* Content Container */}
            <View style={styles.contentContainer}>
                <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.titleContainer}>
                    <Text style={styles.pageTitle}>شاخیں پھوٹنے کے مرحلہ پر کھاد کا استعمال</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.textContainer}>
                    <Text style={styles.instructionText}>
                        لاب لگانے کے 25 تا 30 دن بعد دھان کی فصل کو 40 کلوگرام یوریا، یا 70 کلوگرام کین، یا 85 کلوگرام امونیم سلفیٹ ڈالیں۔
                    </Text>
                </Animated.View>
                {/* Mic Button */}
                <Microphone/>
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
        fontSize: 24,
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
        marginBottom: 30,
    },
    pageTitle: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 22,
        color: 'black',
        textAlign: 'center',
    },
    textContainer: {
        marginBottom: 20,
        width: '100%',
    },
    instructionText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 18,
        color: 'black',
        textAlign: 'right',
        lineHeight: 30,
    },
    buttonContainer: {
        marginTop: 30,
        width: '100%',
        alignItems: 'center',
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
