import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { THEME_COLOR } from '@/constants/theme';
import { commonStyles, horizontalScale, verticalScale, moderateScale, getHeaderFont, getRegularFont } from '@/styles/common';
import Header from '@/components/header';

export default function NitrogenInstructionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    const { id, name } = params;

    const cropId = Array.isArray(id) ? id[0] : id || '';

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t('common.instructionsForNitrogenPlot')} textSize={moderateScale(18)} />

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        <Text style={[styles.instructionText, getRegularFont(i18n.language)]}>
                            {cropId === 'wheat'
                                ? t('wheat.nitrogenInstructions')
                                : cropId === 'maize'
                                    ? t('maize.nitrogenInstructions')
                                    : t('rice.nitrogenInstructions')
                            }
                        </Text>
                    </View>
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        padding: moderateScale(5),
    },
    backIcon: {
        fontSize: moderateScale(28),
        color: 'white',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        paddingTop: verticalScale(30),
        paddingHorizontal: horizontalScale(20),
    },
    scrollContent: {
        paddingBottom: verticalScale(30),
    },
    titleText: {
        fontSize: moderateScale(22),
        color: THEME_COLOR,
        textAlign: 'right',
        marginBottom: verticalScale(20),
        marginTop: verticalScale(10),
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: moderateScale(15),
        padding: moderateScale(20),
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(1) },
        shadowOpacity: 0.05,
        shadowRadius: moderateScale(2),
        elevation: 2,
    },
    instructionText: {
        fontSize: moderateScale(18),
        color: '#333',
        lineHeight: verticalScale(32),
        // textAlign: 'right',
    },
});
