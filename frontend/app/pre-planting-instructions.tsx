// Purpose: This screen displays pre-planting instructions for rice.
// Author: 
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '@/styles/common';
import { ricePlantingInstructions } from '@/constants/riceText';
import { pacakagesUrdu, commonTexts } from '@/constants/commonText';
import Microphone from '@/components/microphone';
import Header from '@/components/header';

export default function PrePlantingInstructionsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    // getting id and name from the params to know which crop is selected
    const { id, name, stage } = params;

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={name} />

            {/* Content Container */}
            {/* show the instructions text in urdu */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Text style={commonStyles.titleText}>{stage}</Text>

                    <Text style={commonStyles.descriptionText}>{ricePlantingInstructions.packageText}</Text>

                    <View style={commonStyles.packageContainer}>
                        <Text style={commonStyles.packageTitle}>{pacakagesUrdu.package1}</Text>
                        <Text style={commonStyles.packageText}>{ricePlantingInstructions.package1}</Text>
                    </View>

                    <View style={commonStyles.packageContainer}>
                        <Text style={commonStyles.packageTitle}>{pacakagesUrdu.package2}</Text>
                        <Text style={commonStyles.packageText}>{ricePlantingInstructions.package2}</Text>
                    </View>

                    <Text style={commonStyles.noteText}>
                        {ricePlantingInstructions.note}
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
                            <Text style={commonStyles.actionButtonText}>{commonTexts.createPackage}</Text>
                        </TouchableOpacity>
                    </Animated.View>

                </ScrollView>
            </Animated.View>

            {/* Mic Button */}
            <Microphone />
        </SafeAreaView>
    );
}

