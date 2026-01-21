import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Platform } from 'react-native';
import { BACKEND_API_URL } from '@/constants';
import { THEME_COLOR } from '@/constants/theme';
import { commonTexts, VARIETY_MAPPING, imageAnalysisTexts } from '@/constants/commonText';

export default function ImageAnalysisScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { mode, typeName, dat, id, name } = params;



    // State to store selected images
    const [sufficientPlotImage, setSufficientPlotImage] = useState<string | null>(null);
    const [commonPlotImage, setCommonPlotImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleImageSelection = async (target: 'sufficient' | 'common') => {
        const useCamera = mode === 'camera';
        let result;

        try {
            if (useCamera) {
                const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                if (permissionResult.granted === false) {
                    Alert.alert("Permission Required", "Please allow access to your camera.");
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                });
            } else {
                const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (permissionResult.granted === false) {
                    Alert.alert("Permission Required", "Please allow access to your photos.");
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                });
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                if (target === 'sufficient') {
                    setSufficientPlotImage(uri);
                } else {
                    setCommonPlotImage(uri);
                }
            }
        } catch (error) {
            console.log('Error selecting image:', error);
            Alert.alert("Error", "An error occurred while selecting the image.");
        }
    };

    const handleAnalyze = async () => {
        if (!sufficientPlotImage || !commonPlotImage) {
            Alert.alert("Images Required", "Please select both Plot images.");
            return;
        }

        if (!typeName || !dat) {
            Alert.alert("Missing Info", "Variety or DAT info is missing. Go back and select again.");
            return;
        }

        const variety = VARIETY_MAPPING[typeName as string] || typeName;
        setIsAnalyzing(true);

        try {
            const formData = new FormData();

            if (Platform.OS === 'web') {
                // 🔥 WEB: convert image URI → Blob
                const kaafiBlob = await (await fetch(sufficientPlotImage)).blob();
                const aamBlob = await (await fetch(commonPlotImage)).blob();

                formData.append('kaafi_image', kaafiBlob, 'kaafi.jpg');
                formData.append('aam_image', aamBlob, 'aam.jpg');
            } else {
                // 📱 MOBILE (Android / iOS)
                formData.append('kaafi_image', {
                    uri: sufficientPlotImage,
                    name: 'kaafi.jpg',
                    type: 'image/jpeg',
                } as any);

                formData.append('aam_image', {
                    uri: commonPlotImage,
                    name: 'aam.jpg',
                    type: 'image/jpeg',
                } as any);
            }

            formData.append('variety', variety as string);
            formData.append('dat', String(dat));

            const response = await fetch(
                `${BACKEND_API_URL}/api/calculate_fertilizer/${id}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await response.json();

            if (data && data.recommendations_kg_acre) {
                const recs = data.recommendations_kg_acre;
                const calcs = data.calculations;
                router.push({
                    pathname: '/analysis-results',
                    params: {
                        urea: recs.Urea,
                        can: recs.CAN,
                        ammonium_sulfate: recs.Ammonium_Sulfate,
                        n_rate: calcs?.N_rate_kg_ha ? Math.round(calcs.N_rate_kg_ha) : 0
                    }
                });
            } else {
                Alert.alert("Error", "Invalid response from server");
                console.log("Invalid Response:", data);
            }


            console.log("SUCCESS:", data);

        } catch (error) {
            console.log("UPLOAD ERROR:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{commonTexts.calculateNitrogenFertilizer}</Text>
                <View style={{ width: 28 }} />
            </Animated.View>

            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Sufficient Nitrogen Plot Button */}
                    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.buttonWrapper}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleImageSelection('sufficient')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.actionButtonText}>{commonTexts.sufficientNitrogenPlot}</Text>
                        </TouchableOpacity>

                        {sufficientPlotImage && (
                            <Animated.View entering={ZoomIn.springify()} style={styles.previewContainer}>
                                <Image source={{ uri: sufficientPlotImage }} style={styles.previewImage} />
                                <Text style={styles.previewText}>{commonTexts.chooseSufficientNitrogenPlot}</Text>
                            </Animated.View>
                        )}
                    </Animated.View>

                    {/* Common Plot Button */}
                    <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.buttonWrapper}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleImageSelection('common')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.actionButtonText}>{commonTexts.commonNitrogenPlot}</Text>
                        </TouchableOpacity>

                        {commonPlotImage && (
                            <Animated.View entering={ZoomIn.springify()} style={styles.previewContainer}>
                                <Image source={{ uri: commonPlotImage }} style={styles.previewImage} />
                                <Text style={styles.previewText}>{commonTexts.chooseCommonNitrogenPlot}</Text>
                            </Animated.View>
                        )}
                    </Animated.View>

                    {/* Analyze Button */}
                    <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.buttonWrapper}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.analyzeButton]}
                            onPress={handleAnalyze}
                            activeOpacity={0.8}
                            disabled={isAnalyzing}
                        >
                            <Text style={styles.actionButtonText}>
                                {isAnalyzing ? imageAnalysisTexts.analyzing : imageAnalysisTexts.analyzeBothImages}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                </ScrollView>

                {/* Mic Button */}
                <Animated.View entering={ZoomIn.delay(500).springify()} style={styles.micContainer}>
                    <TouchableOpacity style={styles.micButton}>
                        <Image source={require('../assets/icons/mic.png')} style={styles.micIcon} resizeMode="contain" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME_COLOR,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    scrollContent: {
        padding: 30,
        paddingTop: 50,
        alignItems: 'center',
        gap: 20,
    },
    buttonWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionButton: {
        backgroundColor: '#b5d985',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#a3c970',
    },
    analyzeButton: {
        backgroundColor: THEME_COLOR, // Slightly different shade if needed, similar to first button in design
        marginTop: 20,
    },
    actionButtonText: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 12,
        color: 'black',
        textAlign: 'center',
    },
    previewContainer: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 15,
        width: '100%',
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 5,
    },
    previewText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 14,
        color: '#333',
    },
    micContainer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
    },
    micButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6a8a2c',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    micIcon: {
        width: 30,
        height: 30,
        tintColor: 'white',
    },
});
