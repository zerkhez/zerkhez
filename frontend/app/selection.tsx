import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Microphone from '@/components/microphone';
import Header from '@/components/header';
import { commonTexts } from '@/constants/commonText';
import { commonStyles } from '@/styles/common';

export default function SelectionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, name } = params;
    let pathName: "/crop-types" | "/crop-stages" = "/crop-types";
    let btnText = "دھان کی قسم کا انتخاب";
    let typeName = "";
    if (id === "wheat") {
        btnText = "مرحلہ کا انتخاب کریں";
        pathName = "/crop-stages";
        typeName = " گندم کی فصل";
    }
    const fields = { "wheat": "گندم", "rice": "چاول", "maize": "مکئی" }
    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={`${name} کی فصل`} />

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={commonStyles.contentContainer}>

                <View style={styles.buttonsContainer}>
                    <Animated.View entering={FadeInUp.delay(300).springify()} style={{ width: '100%', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={commonStyles.actionButton}
                            onPress={() => {
                                type FieldId = 'rice' | 'wheat' | 'maize';
                                const fields: Record<FieldId, string> = {
                                    rice: 'چاول',
                                    wheat: 'گندم',
                                    maize: 'مکئی',
                                };

                                if (id !== 'rice' && id !== 'wheat' && id !== 'maize') {
                                    return;
                                }

                                router.push({
                                    pathname: `/crop-stages/${id}`,
                                    params: {
                                        id,
                                        name,
                                        typeName: `${fields[id]} کی فصل`,
                                    },
                                });
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={commonStyles.actionButtonText}>{commonTexts.atTimeOf} {fields[id]} {commonTexts.ofFertilizers}</Text>
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
                            <Text style={commonStyles.actionButtonText}>{fields[id]} {commonTexts.wayOfImage}</Text>
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
                            <Text style={commonStyles.actionButtonText}>ہدایات برائے کافی نائٹروجن پلاٹ</Text>
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
                            <Text style={commonStyles.actionButtonText}>تصویر سے نائٹروجن کی کمی معلوم کریں</Text>
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
        gap: 20,
        alignItems: 'center',
        marginTop: 50,
    },
});

