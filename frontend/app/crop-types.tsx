// Purpose: This screen is used to display the sub-crop types of a specific crop.
// Author: 
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '@/styles/common';
import { commonTexts, cropTypesData } from '@/constants/commonText';

export default function CropTypesScreen() {
    const router = useRouter();
    const searchParams = useLocalSearchParams();
    const { id, name, nextRoute } = searchParams;



    const currentCropTypes = cropTypesData[id as string] || [];

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
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={styles.contentContainer}>
                <Text style={styles.instructionText}>{name}{commonTexts.chooseType}</Text>

                <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
                    {/* display the sub-types of crop */}
                    {currentCropTypes.map((type, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInUp.delay(400 + index * 60).springify()}
                            style={{ width: '100%' }}
                        >
                            <TouchableOpacity
                                style={styles.typeButton}
                                onPress={() => {
                                    const params: any = { typeName: type, name, id };
                                    if (nextRoute) {
                                        // If nextRoute is passed, navigate there
                                        router.push({
                                            pathname: nextRoute as any,
                                            params: { typeName: type, id, name }
                                        });
                                    } else {
                                        // Default behavior
                                        router.push({
                                            pathname: '/crop-stages' as any,
                                            params: params,
                                        });
                                    }
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.typeButtonText}>{type}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Mic Button */}
            <Animated.View entering={ZoomIn.delay(800).springify()} style={commonStyles.micContainer}>
                <TouchableOpacity style={commonStyles.micButton}>
                    <Image source={require('../assets/icons/mic.png')} style={commonStyles.micIcon} resizeMode="contain" />
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    instructionText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 18,
        color: 'black',
        marginBottom: 20,
        textAlign: 'center',
    },
    listContainer: {
        width: '100%',
        paddingBottom: 100, // Space for mic button
        gap: 15,
        alignItems: 'center',
    },
    typeButton: {
        backgroundColor: '#b5d985', // Light green color from image
        paddingVertical: 4,
        paddingHorizontal: 40,
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
        fontSize: 15,
        color: 'black',
        textAlign: 'center',
    },
});
