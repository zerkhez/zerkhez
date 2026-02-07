import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { THEME_COLOR } from '@/constants/theme';
import { wheatNitrgenInstructions } from '@/constants/wheatText';
import { maizeNitrogenInstructions } from '@/constants/maizeText';
import { riceNitrogenInstructions } from '@/constants/riceText';
import { commonStyles, horizontalScale, verticalScale, moderateScale } from '@/styles/common';
import { commonTexts } from '@/constants/commonText';
import Header from '@/components/header';

export default function NitrogenInstructionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, name } = params;

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={commonTexts.instructionsForNitrogenPlot} />

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        {
                            id === 'wheat' ? (
                                <Text style={styles.instructionText}>{wheatNitrgenInstructions}</Text>
                            ) : id === 'maize' ? (
                                <Text style={styles.instructionText}>{maizeNitrogenInstructions}</Text>
                            ) : (
                                <Text style={styles.instructionText}>{riceNitrogenInstructions}</Text>
                            )
                        }
                    </View>
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        padding: moderateScale(5),
    },
    backIcon: {
        fontSize: moderateScale(28),
        color: 'white',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        paddingTop: verticalScale(30),
        paddingHorizontal: horizontalScale(20),
    },
    scrollContent: {
        paddingBottom: verticalScale(30),
    },
    titleText: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: moderateScale(22),
        color: THEME_COLOR,
        textAlign: 'right',
        marginBottom: verticalScale(20),
        marginTop: verticalScale(10),
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: moderateScale(15),
        padding: moderateScale(20),
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(1) },
        shadowOpacity: 0.05,
        shadowRadius: moderateScale(2),
        elevation: 2,
    },
    instructionText: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(18),
        color: '#333',
        lineHeight: verticalScale(32),
        textAlign: 'right',
    },
});
