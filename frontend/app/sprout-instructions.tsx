import Header from '@/components/header';
import Microphone from '@/components/microphone';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, verticalScale } from '@/styles/common';
import { sproutInstructions } from '@/constants/commonText';

export default function SproutInstructionsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { typeName } = params;

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={typeName} />

            {/* Content Container */}
            <View style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.titleContainer}>
                        <Text style={commonStyles.titleText}>{sproutInstructions.title}</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.textContainer}>
                        <Text style={commonStyles.descriptionText}>
                            {sproutInstructions.description}
                        </Text>
                    </Animated.View>
                </ScrollView>
                {/* Mic Button */}
                <Microphone />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: verticalScale(20),
        marginBottom: verticalScale(30),
        width: '100%',
    },
    textContainer: {
        marginBottom: verticalScale(20),
        width: '100%',
    },
});

