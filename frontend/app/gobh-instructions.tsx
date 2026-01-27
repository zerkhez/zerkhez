// Purpose: Show the gobh instructions for rice.
// Author:
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, verticalScale, moderateScale } from '@/styles/common';
import { gobhInstructions } from '@/constants/riceText';
import Microphone from '@/components/microphone';
import Header from '@/components/header';

export default function GobhInstructionsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { typeName } = params;

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={typeName}/>

            {/* Content Container */}
            <View style={commonStyles.contentContainer}>
                <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.titleContainer}>
                    <Text style={commonStyles.titleText}>{gobhInstructions.titleText}</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.textContainer}>
                    <Text style={styles.instructionText}>
                        {gobhInstructions.instructionText}
                    </Text>
                </Animated.View>
                {/* Mic Button */}
                <Microphone/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: verticalScale(20),
        marginBottom: verticalScale(30),
    },
    textContainer: {
        marginBottom: verticalScale(20),
        width: '100%',
    },
    instructionText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: moderateScale(18),
        color: 'black',
        textAlign: 'center',
        lineHeight: verticalScale(30),
    }
});
