import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '@/styles/common';
import { stagesOfRice } from '@/constants/riceText';
import { commonTexts } from '@/constants/commonText';
import Microphone from '@/components/microphone';

export default function CropStagesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { typeName } = params;

    const stages = stagesOfRice;

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} style={commonStyles.header}>
                <TouchableOpacity onPress={() => router.back()} style={commonStyles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={commonStyles.headerTitle}>{typeName}</Text>
                <View style={commonStyles.midViewWidth} />
            </Animated.View>

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={commonStyles.contentContainer}>
                <Text style={styles.instructionText}>{commonTexts.selectStage}</Text>

                <ScrollView contentContainerStyle={[commonStyles.scrollContent, { gap: 15 }]} showsVerticalScrollIndicator={false}>
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
                                <Text style={styles.typeButtonText}>{stage}</Text>
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
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 18,
        color: 'black',
        marginBottom: 20,
        textAlign: 'center',
    },
    typeButton: {
        backgroundColor: '#b5d985', // Light green color from image
        paddingVertical: 15, // Increased padding for better touch area
        paddingHorizontal: 20,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#a3c970',
    },
    typeButtonText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 16, // Slightly larger font for readability
        color: 'black',
        textAlign: 'center',
    },
});
