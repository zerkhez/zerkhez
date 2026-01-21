// Purpose: This screen displays the pre-planting instructions for wheat.
// Author: 
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '@/styles/common';
import { commonTexts } from '@/constants/commonText';
import { wheatPlantingInstructions } from '@/constants/wheatText';
import { pacakagesUrdu } from '@/constants/commonText';
import Microphone from '@/components/microphone';


export default function PrePlantingInstructionsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    // getting id and name from the params to know which crop is selected
    const { id, name} = params;

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} style={commonStyles.header}>
                <TouchableOpacity onPress={() => router.back()} style={commonStyles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={commonStyles.headerTitle}>{name} {commonTexts.ofCrop}</Text>
                <View style={commonStyles.midViewWidth} />
            </Animated.View>

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={ commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>



                    <Text style={commonStyles.packageText}>{wheatPlantingInstructions.packageText}</Text>

                    <View style={commonStyles.packageContainer}>
                        <Text style={commonStyles.packageTitle}>{pacakagesUrdu.package1}</Text>
                        <Text style={commonStyles.packageText}>{wheatPlantingInstructions.package1} </Text>
                    </View>

                    <View style={commonStyles.packageContainer}>
                        <Text style={commonStyles.packageTitle}>{pacakagesUrdu.package2}</Text>
                        <Text style={commonStyles.packageText}>{wheatPlantingInstructions.package2}</Text>
                    </View>

                    <Text style={commonStyles.noteText}>{wheatPlantingInstructions.note}</Text>

                    <Animated.View entering={FadeInUp.delay(600).springify()} style={commonStyles.buttonContainer}>
                        <TouchableOpacity
                            style={commonStyles.actionButton}
                            onPress={() => {
                                // Navigate to crop-types for now as the next logical step or a placeholder
                                router.push({
                                    pathname: '/fertilizer-selection' as any,
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
            <Microphone/>
        </SafeAreaView>
    );
}

