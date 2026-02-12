import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Microphone from '@/components/microphone';
import Header from '@/components/header';
import { commonStyles, verticalScale, moderateScale } from '@/styles/common';
import { useTranslation } from 'react-i18next';

export default function ResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t, i18n } = useTranslation();

    const isRTL = i18n.language === 'ur';

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t('cropNames.rice')} />

            <View style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.titleContainer}>
                        <Text style={[commonStyles.titleText, { textAlign: isRTL ? 'right' : 'left' }]}>{t('common.results')}</Text>
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
                <Microphone />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: verticalScale(20),
        marginBottom: verticalScale(30),
    },
    resultBox: {
        width: '100%',
        height: verticalScale(80), // Approximate height from screenshot
        backgroundColor: '#e8f5e9', // Light green
        borderRadius: moderateScale(15),
        borderWidth: 1,
        borderColor: '#81c784', // Green border
        marginBottom: verticalScale(20),
    },
});

