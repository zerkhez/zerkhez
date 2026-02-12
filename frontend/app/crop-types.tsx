// Purpose: This screen is used to display the sub-crop types of a specific crop.
// Author: 
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { commonStyles, horizontalScale, verticalScale, moderateScale, getRegularFont } from '@/styles/common';
import Microphone from '@/components/microphone';
import Header from '@/components/header';

export default function CropTypesScreen() {
    const router = useRouter();
    const searchParams = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    const { id, name, nextRoute, displayFieldName } = searchParams;

    const cropName = Array.isArray(displayFieldName) ? displayFieldName[0] : displayFieldName || '';
    const cropId = Array.isArray(id) ? id[0] : id || '';

    // Load crop types from locale files based on selected language
    const currentCropTypes = t(`cropTypes.${cropId}`, { returnObjects: true }) as string[] || [];

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t('common.ofCrop', { cropName })} />

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={styles.contentContainer}>
                <Text style={styles.instructionText}>{t('common.chooseType', { cropName })}</Text>

                <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
                    {/* display the sub-types of crop */}
                    {currentCropTypes.map((type, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInUp.delay(400 + index * 60).springify()}
                            style={{ width: '100%', alignItems: 'center' }}
                        >
                            <TouchableOpacity
                                style={styles.typeButton}
                                onPress={() => {
                                    const params: any = { typeName: type, name, id, cropTypeIndex: index };
                                    if (nextRoute) {
                                        // If nextRoute is passed, navigate there
                                        router.push({
                                            pathname: nextRoute as string,
                                            params: { typeName: type, id, name, cropTypeIndex: index }
                                        });
                                    } else {
                                        // Default behavior
                                        router.push({
                                            pathname: '/crop-stages' as string,
                                            params: params,
                                        });
                                    }
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.typeButtonText, getRegularFont(i18n.language)]}>{type}</Text>
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
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        paddingTop: verticalScale(30),
        paddingHorizontal: horizontalScale(20),
        alignItems: 'center',
    },
    instructionText: {
        fontSize: moderateScale(18),
        color: 'black',
        marginBottom: verticalScale(20),
        textAlign: 'center',
    },
    listContainer: {
        width: '100%',
        paddingBottom: verticalScale(100), // Space for mic button
        gap: verticalScale(15),
    },
    typeButton: {
        backgroundColor: '#b5d985', // Light green color from image
        paddingVertical: verticalScale(4),
        paddingHorizontal: horizontalScale(10),
        borderRadius: moderateScale(20),
        width: horizontalScale(280),
        minHeight: verticalScale(40),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(3),
        elevation: 3,
        borderWidth: 1,
        borderColor: '#a3c970',
    },
    typeButtonText: {
        fontSize: moderateScale(15),
        color: 'black',
        textAlign: 'center',
    },
});
