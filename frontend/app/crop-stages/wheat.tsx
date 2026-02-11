// Purpose: This screen displays the pre-planting instructions for wheat.
// Author

import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { commonStyles } from '@/styles/common';
import Microphone from '@/components/microphone';
import Header from '@/components/header';


export default function PrePlantingInstructionsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const { id, name, typeName } = params;

    const packages = [
        { title: t("packages.package1"), text: t("wheat.plantingInstructions.package1") },
        { title: t("packages.package2"), text: t("wheat.plantingInstructions.package2") },
    ];

    const cropName = Array.isArray(name) ? name[0] : name || '';

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t("common.ofCrop", { cropName: typeName })} />

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Text style={commonStyles.packageInstruction}>
                        {t("wheat.plantingInstructions.packageText")}
                    </Text>

                    {packages.map((pkg, index) => (
                        <View key={index} style={commonStyles.packageContainer}>
                            <Text style={commonStyles.packageTitle}>{pkg.title}</Text>
                            <Text style={commonStyles.packageText}>{pkg.text}</Text>
                        </View>
                    ))}

                    <Text style={commonStyles.noteText}>
                        {t("wheat.plantingInstructions.note")}
                    </Text>

                    <Animated.View entering={FadeInUp.delay(600).springify()} style={commonStyles.buttonContainer}>
                        <TouchableOpacity
                            style={commonStyles.actionButton}
                            onPress={() => {
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

