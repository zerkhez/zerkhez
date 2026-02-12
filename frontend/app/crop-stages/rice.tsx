import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, verticalScale, horizontalScale, moderateScale, getHeaderFont, getRegularFont, getMediumFont } from '@/styles/common';
import Microphone from '@/components/microphone';
import Header from '@/components/header';
import { useTranslation } from 'react-i18next';

export default function CropStagesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { typeName } = params;
    const { t, i18n } = useTranslation();

    // Get stages from translation files based on current language
    const stages = t('rice.stages', { returnObjects: true }) as string[];

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t("common.ofCrop", { cropName: typeName })} />

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={commonStyles.contentContainer}>
                <Text style={[styles.instructionText, getMediumFont(i18n.language)]}>{t("common.selectStage")}</Text>

                <ScrollView contentContainerStyle={[commonStyles.scrollContent, { gap: verticalScale(15) }]} showsVerticalScrollIndicator={false}>
                    {stages.map((stage, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInUp.delay(400 + index * 60).springify()}
                            style={{ width: '100%' }}
                        >
                            <TouchableOpacity
                                style={styles.typeButton}
                                onPress={() => {
                                    console.log(`Selected stage: ${stage}`);
                                    if (index === 0) {
                                        router.push({
                                            pathname: '/pre-planting-instructions',
                                            params: { id: typeName, name: typeName, stage: stages[0] } // Passing typeName as id/name for context
                                        });
                                    } else if (index === 1) {
                                        router.push({
                                            pathname: '/sprout-instructions',
                                            params: { typeName: typeName }
                                        });
                                    } else if (index === 2) {
                                        router.push({
                                            pathname: '/gobh-instructions',
                                            params: { typeName: typeName }
                                        });
                                    } else {
                                        // Navigate to other screens or handle selection
                                    }
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.typeButtonText, getRegularFont(i18n.language)]}>{stage}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Mic Button */}
            <Microphone />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    instructionText: {
        fontSize: moderateScale(22),
        color: 'black',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(20),
        textAlign: 'center',
    },
    typeButton: {
        backgroundColor: '#b5d985', // Light green color from image
        paddingVertical: verticalScale(15), // Increased padding for better touch area
        paddingHorizontal: horizontalScale(20),
        borderRadius: moderateScale(20),
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(3),
        elevation: 3,
        borderWidth: 1,
        borderColor: '#a3c970',
    },
    typeButtonText: {
        fontSize: moderateScale(16), // Slightly larger font for readability
        color: 'black',
        textAlign: 'center',
    },
});
