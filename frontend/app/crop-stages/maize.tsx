// Purpose: This screen displays the pre-planting instructions for maize.
// Author: 
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { commonStyles } from '@/styles/common';
import Microphone from '@/components/microphone';
import Header from '@/components/header';

export default function PrePlantingInstructionsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t } = useTranslation();
    // getting id and name from the params to know which crop is selected
    const { id, name, typeName } = params;

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t("common.ofCrop", { cropName: typeName })} />

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Text style={commonStyles.packageInstruction}>
                        {t("maize.prePlantingInstructions.packageText")}
                    </Text>

                    <View style={commonStyles.packageContainer}>
                        <Text style={commonStyles.packageTitle}>{t("packages.package1")}</Text>
                        <Text style={commonStyles.packageText}>
                            {t("maize.prePlantingInstructions.package1")}
                        </Text>
                    </View>

                    <View style={commonStyles.packageContainer}>
                        <Text style={commonStyles.packageTitle}>{t("packages.package2")}</Text>
                        <Text style={commonStyles.packageText}>
                            {t("maize.prePlantingInstructions.package2")}
                        </Text>
                    </View>

                    <Text style={commonStyles.noteText}>
                        {t("maize.prePlantingInstructions.note")}
                    </Text>

                    <Animated.View entering={FadeInUp.delay(600).springify()} style={commonStyles.buttonContainer}>
                        <TouchableOpacity
                            style={commonStyles.actionButton}
                            onPress={() => {
                                // Navigate to crop-types for now as the next logical step or a placeholder
                                router.push({
                                    pathname: '/fertilizer-selection',
                                    params: { id, name }
                                });
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={commonStyles.actionButtonText}>
                                {t("common.createPackage")}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </Animated.View>

            {/* Mic Button */}
            <Microphone />
        </SafeAreaView>
    );
}


