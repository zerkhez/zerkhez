import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Microphone from '@/components/microphone';
import Header from '@/components/header';
import { commonTexts } from '@/constants/commonText';
import { commonStyles, verticalScale } from '@/styles/common';

export default function SelectionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    // Normalize params to strings
    const id = (Array.isArray(params.id) ? params.id[0] : params.id) || '';
    const name = (Array.isArray(params.name) ? params.name[0] : params.name) || '';

    let pathName: "/crop-types" | "/crop-stages" = "/crop-types";
    let btnText = "دھان کی قسم کا انتخاب";
    let typeName = "";

    if (id === "wheat") {
        btnText = "مرحلہ کا انتخاب کریں";
        pathName = "/crop-stages";
        typeName = " گندم کی فصل";
    }

    const fields: Record<string, string> = {
        "wheat": t("cropNames.wheat"),
        "rice": t("cropNames.rice"),
        "maize": t("cropNames.maize")
    };

    const displayFieldName = Object.prototype.hasOwnProperty.call(fields, id) ? fields[id] : '';

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t("common.ofCrop", { cropName: displayFieldName })} />

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={commonStyles.contentContainer}>

                <View style={styles.buttonsContainer}>
                    <Animated.View entering={FadeInUp.delay(300).springify()} style={{ width: '100%', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={commonStyles.actionButton}
                            onPress={() => {
                                if (id !== 'rice' && id !== 'wheat' && id !== 'maize') {
                                    return;
                                }

                                router.push({
                                    pathname: `/crop-stages/${id}`,
                                    params: {
                                        id,
                                        name,
                                        typeName: `${Object.prototype.hasOwnProperty.call(fields, id) ? fields[id] : ''}`,
                                    },
                                });
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={commonStyles.actionButtonText}>
                                {t("common.fertilizerAtPlanting", { cropName: displayFieldName })}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).springify()} style={{ width: '100%', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={commonStyles.actionButton}
                            onPress={() => {
                                router.push({ pathname: '/video-tutorial', params: { id, name } });
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={commonStyles.actionButtonText}>
                                {t("common.wayOfImage", { cropName: displayFieldName })}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(500).springify()} style={{ width: '100%', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={commonStyles.actionButton}
                            onPress={() => {
                                router.push({
                                    pathname: '/instruction-nitrogen',
                                    params: { id, name }
                                });
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={commonStyles.actionButtonText}>
                                {t("common.instructionsForNitrogenPlot")}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(600).springify()} style={{ width: '100%', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={commonStyles.actionButton}
                            onPress={() => {
                                router.push({
                                    pathname: '/crop-types',
                                    params: {
                                        id: id,
                                        name: name,
                                        nextRoute: '/nitrogen-calculator'
                                    }
                                });
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={commonStyles.actionButtonText}>
                                {t("common.determineNitrogenDeficiency")}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                </View>

            </Animated.View>

            {/* Mic Button */}
            <Microphone />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        width: '100%',
        gap: verticalScale(20),
        alignItems: 'center',
        marginTop: verticalScale(50),
    },
});

