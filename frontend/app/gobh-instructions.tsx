import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles } from '@/styles/common';
import { gobhInstructions } from '@/constants/riceText';

export default function GobhInstructionsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { typeName } = params;

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
                <Animated.View entering={ZoomIn.delay(500).springify()} style={commonStyles.micContainer}>
                    <TouchableOpacity style={[commonStyles.micButton, commonStyles.micButtonSecColor]}>
                        <Image source={require('../assets/icons/mic.png')} style={commonStyles.micIcon} resizeMode="contain" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
    textContainer: {
        marginBottom: 20,
        width: '100%',
    },
    instructionText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        lineHeight: 30,
    }
});
