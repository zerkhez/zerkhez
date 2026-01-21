import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME_COLOR } from '@/constants/theme';
import Microphone from '@/components/microphone';

export default function ResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>چاول کی فصل</Text>
                <View style={{ width: 28 }} />
            </Animated.View>

            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.titleContainer}>
                        <Text style={styles.pageTitle}>نتائج</Text>
                    </Animated.View>

                    {/* Result Boxes */}
                    <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.resultBox}>
                        {/* Placeholder for result 1 */}
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.resultBox}>
                        {/* Placeholder for result 2 */}
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.resultBox}>
                        {/* Placeholder for result 3 */}
                    </Animated.View>

                </ScrollView>

                {/* Microphone Icon */}
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
        backgroundColor: THEME_COLOR,
    },
    backButton: {
        padding: 5,
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
        overflow: 'hidden',
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    titleContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
    pageTitle: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 32,
        color: 'black',
        textAlign: 'center',
    },
    resultBox: {
        width: '100%',
        height: 80, // Approximate height from screenshot
        backgroundColor: '#e8f5e9', // Light green
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#81c784', // Green border
        marginBottom: 20,
    },
    micContainer: {
        position: 'absolute',
        bottom: 30,
        left: 30, // Positioned on the left as per screenshot (RTL layout might make it look right, but screenshot shows it on left)
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
