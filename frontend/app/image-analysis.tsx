// Purpose: Get images as input from user and call the api to upload images to do analysis.
// 
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, Switch } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { processImageStats } from '@/lib/imageProcessing';
import { 
    VARIETY_PARAMS, calculate_gi, calculate_ndvi, calculate_iey, 
    calculate_pyp, calculate_ri, calculate_n_rate, calculate_fertilizers 
} from '@/lib/riceRulesCalculator';
<<<<<<< HEAD
import {
    calculate_spad, calculate_si, calculate_fertilizer_needs
} from '@/lib/maizeRulesCalculator';
import {
    calculate_ndvi as calc_wheat_ndvi,
    calculate_iey as calc_wheat_iey,
    calculate_pyp as calc_wheat_pyp,
    calculate_ri as calc_wheat_ri,
    calculate_n_rate as calc_wheat_n_rate,
    calculate_fertilizers as calc_wheat_fertilizers
} from '@/lib/wheatRulesCalculator';
=======
import { 
    calculate_wheat_ndvi, calculate_wheat_iey, calculate_wheat_pyp, calculate_wheat_n_rate
} from '@/lib/wheatRulesCalculator';
import {
    calculate_maize_spad, calculate_maize_si, calculate_maize_fertilizer_needs
} from '@/lib/maizeRulesCalculator';
>>>>>>> 24ab07765d8ff1235e683dcf83f7ed43c79fe881
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { BACKEND_API_URL } from '@/constants';
import * as Network from 'expo-network';
import { THEME_COLOR } from '@/constants/theme';
import { commonTexts, VARIETY_MAPPING, imageAnalysisTexts } from '@/constants/commonText';
import Microphone from '@/components/microphone';
import Header from '@/components/header';
import { commonStyles, horizontalScale, verticalScale, moderateScale, getHeaderFont, getRegularFont } from '@/styles/common';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function ImageAnalysisScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t } = useTranslation();
    const { mode, typeName, dat, id, name } = params;



    // State to store selected images
    const [sufficientPlotImage, setSufficientPlotImage] = useState<string | null>(null);
    const [commonPlotImage, setCommonPlotImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [useLocalProcessing, setUseLocalProcessing] = useState(true);

    const handleImageSelection = async (target: 'sufficient' | 'common') => {
        const useCamera = mode === 'camera';
        let result;

        try {
            if (useCamera) {
                const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                if (permissionResult.granted === false) {
                    Alert.alert(t('imageAnalysis.permissionRequired'), t('imageAnalysis.allowCameraAccess'));
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
                    Alert.alert(t('imageAnalysis.permissionRequired'), t('imageAnalysis.allowPhotosAccess'));
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
            Alert.alert(t('imageAnalysis.error'), t('imageAnalysis.imageSelectionError'));
        }
    };

    const handleDeleteImage = (target: 'sufficient' | 'common') => {
        Alert.alert(
            t('imageAnalysis.deleteImageTitle'),
            t('imageAnalysis.deleteImageMessage'),
            [
                { text: t('imageAnalysis.no'), style: "cancel" },
                {
                    text: t('imageAnalysis.delete'),
                    style: "destructive",
                    onPress: () => {
                        if (target === 'sufficient') {
                            setSufficientPlotImage(null);
                        } else {
                            setCommonPlotImage(null);
                        }
                    }
                }
            ]
        );
    };

    const handleAnalyze = async () => {
        const networkState = await Network.getNetworkStateAsync();
        if (!networkState.isConnected) {
            Alert.alert(t('imageAnalysis.noInternetConnection'), t('imageAnalysis.connectToInternet'));
            return;
        }

        if (!sufficientPlotImage || !commonPlotImage) {
            Alert.alert(t('imageAnalysis.imagesRequired'), t('imageAnalysis.pleaseSelectBothImages'));
            return;
        }

        if (!typeName || !dat) {
            Alert.alert(t('imageAnalysis.missingInfo'), t('imageAnalysis.varietyOrDATInfoIsMissing'));
            return;
        }

        const variety = VARIETY_MAPPING[typeName as string] || typeName;
        
        if (useLocalProcessing) {
            setIsAnalyzing(true);
            try {
                // 1. Process Images
                const kaafiStats = await processImageStats(sufficientPlotImage);
                const aamStats = await processImageStats(commonPlotImage);
                
                let recommendations: { Urea: number, CAN: number, Ammonium_Sulfate: number } | null = null;
                let final_n_rate = 0;
                
                if (id === 'rice') {
                    if (!VARIETY_PARAMS[variety as string]) {
                        Alert.alert(t('imageAnalysis.error'), `Unknown variety: ${variety}`);
                        setIsAnalyzing(false);
                        return;
                    }
                    const params = VARIETY_PARAMS[variety as string];
                    
                    const gi_nl = calculate_gi(params.formula, kaafiStats.mean_rgb[0], kaafiStats.mean_rgb[1], kaafiStats.mean_rgb[2]);
                    const gi_t = calculate_gi(params.formula, aamStats.mean_rgb[0], aamStats.mean_rgb[1], aamStats.mean_rgb[2]);
                    
                    const x_nl = gi_nl * kaafiStats.ratio;
                    const x_t = gi_t * aamStats.ratio;
                    
                    const ndvi_nl = calculate_ndvi(params.m, params.c, x_nl);
                    const ndvi_t = calculate_ndvi(params.m, params.c, x_t);
                    
                    const datValue = Number(dat);
                    if (Number.isNaN(datValue) || !Number.isFinite(datValue) || datValue === 0) {
                        Alert.alert(t('imageAnalysis.error'), "Invalid DAT");
                        setIsAnalyzing(false);
                        return;
                    }
                    const iey = calculate_iey(ndvi_t, datValue);
                    const pyp_kg_ha = calculate_pyp(iey);
                    const ri = calculate_ri(ndvi_nl, ndvi_t);
                    const pypn_kg_ha = pyp_kg_ha * ri;
                    final_n_rate = calculate_n_rate(pypn_kg_ha, pyp_kg_ha);
                    recommendations = calculate_fertilizers(final_n_rate);
                    
                } else if (id === 'wheat') {
                    // Wheat logic
                    const formula = "2G-B-R";
                    const gi_nl = calculate_gi(formula, kaafiStats.mean_rgb[0], kaafiStats.mean_rgb[1], kaafiStats.mean_rgb[2]);
                    const gi_t = calculate_gi(formula, aamStats.mean_rgb[0], aamStats.mean_rgb[1], aamStats.mean_rgb[2]);
                    
                    const x_nl = gi_nl * kaafiStats.ratio;
                    const x_t = gi_t * aamStats.ratio;
                    
                    const ndvi_nl = calculate_wheat_ndvi(x_nl);
                    const ndvi_t = calculate_wheat_ndvi(x_t);
                    
                    const datValue = Number(dat); // represents DAS
                    if (Number.isNaN(datValue) || !Number.isFinite(datValue) || datValue === 0) {
                        Alert.alert(t('imageAnalysis.error'), "Invalid DAS");
                        setIsAnalyzing(false);
                        return;
                    }
                    const iey = calculate_wheat_iey(ndvi_t, datValue);
                    const pyp = calculate_wheat_pyp(iey);
                    const ri = calculate_ri(ndvi_nl, ndvi_t); // re-use from riceRules (same formula)
                    const pypn = pyp * ri;
                    
                    final_n_rate = calculate_wheat_n_rate(pypn, pyp);
                    recommendations = calculate_fertilizers(final_n_rate); // re-use from riceRules (same calculations)
                    
                } else if (id === 'maize') {
                    // Maize Logic
                    const spad_f = calculate_maize_spad(kaafiStats.mean_rgb[1]); // green channel
                    const spad_t = calculate_maize_spad(aamStats.mean_rgb[1]);
                    
                    const si = calculate_maize_si(spad_t, spad_f);
                    const needs = calculate_maize_fertilizer_needs(si, variety as string);
                    
                    if (!needs.need_of_fertilizer) {
                        setAlertMessage(needs.message || t('imageAnalysis.cropDoesNotNeedFertilizer'));
                        setAlertVisible(true);
                        return;
                    }
                    
                    final_n_rate = needs.n_rate;
                    recommendations = {
                        Urea: needs.urea,
                        CAN: needs.can,
                        Ammonium_Sulfate: needs.ammonium_sulfate
                    };
                    
                } else {
                     Alert.alert(t('imageAnalysis.error'), `Unsupported crop type for local processing: ${id}`);
                     setIsAnalyzing(false);
                     return;
                }
                
                if (recommendations) {
                    router.push({
                        pathname: '/analysis-results',
                        params: {
                            urea: recommendations.Urea,
                            can: recommendations.CAN,
                            ammonium_sulfate: recommendations.Ammonium_Sulfate,
                            n_rate: Math.round(final_n_rate)
                        }
                    });
                }
            } catch (err: any) {
                console.log("LOCAL PROCESS ERROR:", err);
                Alert.alert(t('imageAnalysis.error'), err.message || "Error processing locally");
            } finally {
                setIsAnalyzing(false);
            }
            return;
        }

        if (useLocalProcessing && id === 'maize') {
            setIsAnalyzing(true);
            try {
                // 1. Process Images
                const kaafiStats = await processImageStats(sufficientPlotImage);
                const aamStats = await processImageStats(commonPlotImage);

                // 2. Calculate SPAD
                const spad_f = calculate_spad(kaafiStats.mean_rgb[1]); // Green channel
                const spad_t = calculate_spad(aamStats.mean_rgb[1]);

                // 3. Calculate SI
                const si = calculate_si(spad_t, spad_f);

                // 4. Calculate Fertilizer Needs
                const fertilizer_result = calculate_fertilizer_needs(si, variety as string);

                if (fertilizer_result.need_of_fertilizer === false) {
                    setAlertMessage(fertilizer_result.message || t('imageAnalysis.cropDoesNotNeedFertilizer'));
                    setAlertVisible(true);
                    setIsAnalyzing(false);
                    return;
                }

                router.push({
                    pathname: '/analysis-results',
                    params: {
                        urea: fertilizer_result.urea,
                        can: fertilizer_result.can,
                        ammonium_sulfate: fertilizer_result.ammonium_sulfate,
                        n_rate: Math.round(fertilizer_result.n_rate)
                    }
                });
            } catch (err: any) {
                console.log("LOCAL PROCESS ERROR MAIZE:", err);
                Alert.alert(t('imageAnalysis.error'), err.message || "Error processing locally");
            } finally {
                setIsAnalyzing(false);
            }
            return;
        }

        if (useLocalProcessing && id === 'wheat') {
            setIsAnalyzing(true);
            try {
                // 1. Process Images
                const kaafiStats = await processImageStats(sufficientPlotImage);
                const aamStats = await processImageStats(commonPlotImage);

                // 2. Calculate GI (Fixed formula 2G-B-R)
                const gi_nl = calculate_gi("2G-B-R", kaafiStats.mean_rgb[0], kaafiStats.mean_rgb[1], kaafiStats.mean_rgb[2]);
                const gi_t = calculate_gi("2G-B-R", aamStats.mean_rgb[0], aamStats.mean_rgb[1], aamStats.mean_rgb[2]);
                
                // 3. Calculate X
                const x_nl = gi_nl * kaafiStats.ratio;
                const x_t = gi_t * aamStats.ratio;

                // 4. Calculate NDVI
                const ndvi_nl = calc_wheat_ndvi(x_nl);
                const ndvi_t = calc_wheat_ndvi(x_t);

                // 5. Calculate IEY
                const dasValue = Number(dat);
                if (Number.isNaN(dasValue) || !Number.isFinite(dasValue)) {
                    Alert.alert(t('imageAnalysis.error'), "Invalid DAT/DAS");
                    setIsAnalyzing(false);
                    return;
                }
                const iey = calc_wheat_iey(ndvi_t, dasValue);
                
                // 6. Calculate PYP
                const pyp = calc_wheat_pyp(iey);
                
                // 7. Calculate RI
                const ri = calc_wheat_ri(ndvi_nl, ndvi_t);
                
                // 8. Calculate PYPN
                const pypn = pyp * ri;
                
                // 9. Calculate N rate
                const n_rate_kg_ha = calc_wheat_n_rate(pypn, pyp);
                
                // 10. Recommendations
                const recommendations = calc_wheat_fertilizers(n_rate_kg_ha);

                router.push({
                    pathname: '/analysis-results',
                    params: {
                        urea: recommendations.Urea,
                        can: recommendations.CAN,
                        ammonium_sulfate: recommendations.Ammonium_Sulfate,
                        n_rate: Math.round(n_rate_kg_ha)
                    }
                });
            } catch (err: any) {
                console.log("LOCAL PROCESS ERROR WHEAT:", err);
                Alert.alert(t('imageAnalysis.error'), err.message || "Error processing locally");
            } finally {
                setIsAnalyzing(false);
            }
            return;
        }

        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            // if running on web application
            if (Platform.OS === 'web') {
                // WEB: convert image URI → Blob
                const kaafiBlob = await (await fetch(sufficientPlotImage)).blob();
                const aamBlob = await (await fetch(commonPlotImage)).blob();

                formData.append('kaafi_image', kaafiBlob, 'kaafi.jpg');
                formData.append('aam_image', aamBlob, 'aam.jpg');
            } else {
                // MOBILE (Android / iOS)
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

            if (data) {
                // Specific check for Maize or future crops that return this flag
                if (data.giveFertilizer === false) {
                    console.log("Urea", data);
                    setAlertMessage(data.message || t('imageAnalysis.cropDoesNotNeedFertilizer'));
                    setAlertVisible(true);
                    return;
                }

                if (data.recommendations_kg_acre) {
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
                    Alert.alert(t('imageAnalysis.error'), t('imageAnalysis.invalidServerResponse'));
                    console.log("Invalid Response:", data);
                }
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
            <Header text={t('common.calculateNitrogenFertilizer')} textSize={moderateScale(15)} />

            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Sufficient Nitrogen Plot Button */}
<<<<<<< HEAD
                    {['rice', 'maize', 'wheat'].includes(id as string) && (
=======
                    {['rice', 'wheat', 'maize'].includes(id as string) && (
>>>>>>> 24ab07765d8ff1235e683dcf83f7ed43c79fe881
                        <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.toggleContainer}>
                            <Text style={styles.toggleLabel}>Process Locally</Text>
                            <Switch
                                value={useLocalProcessing}
                                onValueChange={setUseLocalProcessing}
                                trackColor={{ false: '#767577', true: '#b5d985' }}
                                thumbColor={useLocalProcessing ? THEME_COLOR : '#f4f3f4'}
                            />
                        </Animated.View>
                    )}

                    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.buttonWrapper}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleImageSelection('sufficient')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.actionButtonText}>{t('common.sufficientNitrogenPlot')}</Text>
                        </TouchableOpacity>

                        {sufficientPlotImage && (
                            <Animated.View entering={ZoomIn.springify()} style={styles.previewContainer}>
                                <Image source={{ uri: sufficientPlotImage }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteImage('sufficient')}
                                >
                                    <Ionicons name="close" size={16} color="white" />
                                </TouchableOpacity>

                                <Text style={styles.previewText}>{t('common.chooseSufficientNitrogenPlot')}</Text>
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
                            <Text style={styles.actionButtonText}>{t('common.commonNitrogenPlot')}</Text>
                        </TouchableOpacity>

                        {commonPlotImage && (
                            <Animated.View entering={ZoomIn.springify()} style={styles.previewContainer}>
                                <Image source={{ uri: commonPlotImage }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteImage('common')}
                                >
                                    <Ionicons name="close" size={16} color="white" />
                                </TouchableOpacity>

                                <Text style={styles.previewText}>{t('common.chooseCommonNitrogenPlot')}</Text>
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
                                {isAnalyzing ? t('imageAnalysis.analyzing') : t('imageAnalysis.analyzeBothImages')}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <View style={{ height: verticalScale(100), width: '100%' }} />
                </ScrollView>

                {/* Mic Button */}
                <Microphone />
            </View>

            {/* Custom Alert Modal */}
            <Modal
                transparent={true}
                visible={alertVisible}
                animationType="fade"
                onRequestClose={() => setAlertVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View entering={ZoomIn.springify()} style={styles.modalContent}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="leaf" size={40} color="white" />
                        </View>
                        <Text style={styles.modalTitle}>{t('imageAnalysis.noFertilizerNeeded')}</Text>
                        <Text style={styles.modalMessage}>{alertMessage}</Text>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setAlertVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>{t('imageAnalysis.okay')}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
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
        paddingHorizontal: horizontalScale(20),
        paddingVertical: verticalScale(15),
    },
    backButton: {
        padding: moderateScale(5),
    },
    headerTitle: {
        fontSize: moderateScale(22),
        color: 'white',
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        overflow: 'hidden',
    },
    scrollContent: {
        padding: moderateScale(30),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(120),
        alignItems: 'center',
        gap: verticalScale(20),
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#f9f9f9',
        paddingHorizontal: horizontalScale(20),
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(15),
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    toggleLabel: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(14),
        color: '#333',
    },
    buttonWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    actionButton: {
        backgroundColor: '#b5d985',
        paddingVertical: verticalScale(15),
        paddingHorizontal: horizontalScale(30),
        borderRadius: moderateScale(25),
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(3),
        elevation: 5,
        borderWidth: 1,
        borderColor: '#a3c970',
    },
    analyzeButton: {
        backgroundColor: THEME_COLOR, // Slightly different shade if needed, similar to first button in design
        marginTop: verticalScale(20),
    },
    actionButtonText: {
        fontFamily: 'NotoSansArabic-Bold',
        fontSize: moderateScale(12),
        color: 'black',
        textAlign: 'center',
    },
    previewContainer: {
        marginTop: verticalScale(10),
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: moderateScale(10),
        borderRadius: moderateScale(15),
        width: '100%',
    },
    previewImage: {
        width: horizontalScale(100),
        height: horizontalScale(100),
        borderRadius: moderateScale(10),
        marginBottom: verticalScale(5),
    },
    deleteButton: {
        position: 'absolute',
        top: verticalScale(5),
        right: horizontalScale(5),
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: moderateScale(15),
        width: moderateScale(24),
        height: moderateScale(24),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    previewText: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(14),
        color: '#333',
    },
    micContainer: {
        position: 'absolute',
        bottom: verticalScale(30),
        left: horizontalScale(30),
    },
    micButton: {
        width: horizontalScale(60),
        height: horizontalScale(60),
        borderRadius: horizontalScale(30),
        backgroundColor: '#6a8a2c',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.3,
        shadowRadius: moderateScale(4),
    },
    micIcon: {
        width: horizontalScale(30),
        height: horizontalScale(30),
        tintColor: 'white',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: moderateScale(20),
        padding: moderateScale(30),
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(4) },
        shadowOpacity: 0.3,
        shadowRadius: moderateScale(10),
    },
    iconContainer: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(40),
        backgroundColor: THEME_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(20),
        elevation: 5,
    },
    modalTitle: {
        fontFamily: 'NotoSansArabic-Bold',
        fontSize: moderateScale(22),
        color: THEME_COLOR,
        marginBottom: verticalScale(10),
        textAlign: 'center',
    },
    modalMessage: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(16),
        color: '#555',
        textAlign: 'center',
        marginBottom: verticalScale(30),
        lineHeight: verticalScale(24),
    },
    closeButton: {
        backgroundColor: THEME_COLOR,
        paddingVertical: verticalScale(12),
        paddingHorizontal: horizontalScale(40),
        borderRadius: moderateScale(25),
        elevation: 3,
    },
    closeButtonText: {
        fontFamily: 'NotoSansArabic-Bold',
        fontSize: moderateScale(16),
        color: 'white',
    },
});
