// Purpose: This screen displays pre-planting instructions for rice.
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
    // const { id, name, stage } = params;
    const name = (Array.isArray(params.name) ? params.name[0] : params.name) || '';
    const stage = (Array.isArray(params.stage) ? params.stage[0] : params.stage) || '';
    const id = (Array.isArray(params.id) ? params.id[0] : params.id) || '';

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t("common.ofCrop", { cropName: name })} />

            {/* Content Container */}
            {/* show the instructions text in urdu */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Text style={commonStyles.titleText}>{stage}</Text>

                    <Text style={commonStyles.packageInstruction}>
                        {t("rice.plantingInstructions.packageText")}
                    </Text>

                    <View style={commonStyles.packageContainer}>
                        <Text style={commonStyles.packageTitle}>{t("packages.package1")}</Text>
                        <Text style={commonStyles.packageText}>
                            {t("rice.plantingInstructions.package1")}
                        </Text>
                    </View>

                    <View style={commonStyles.packageContainer}>
                        <Text style={commonStyles.packageTitle}>{t("packages.package2")}</Text>
                        <Text style={commonStyles.packageText}>
                            {t("rice.plantingInstructions.package2")}
                        </Text>
                    </View>

                    <Text style={commonStyles.noteText}>
                        {t("rice.plantingInstructions.note")}
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

