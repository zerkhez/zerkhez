import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Microphone from '@/components/microphone';
import Header from '@/components/header';
import { commonTexts } from '@/constants/commonText';
import { commonStyles } from '@/styles/common';


export default function RiceTutorialScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { name } = params;

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      {/* Header */}
      <Header text={`${name} ${commonTexts.wayOfImage}`} />
      {/* Content Container */}
      <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={commonStyles.contentContainer}>
        <ScrollView contentContainerStyle={commonStyles.scrollContent} showsVerticalScrollIndicator={false}>

          <Text style={commonStyles.descriptionText}>
            {name} {commonTexts.watchVideo}
          </Text>

          {/* Video Placeholder */}
          <View style={styles.videoContainer}>
            {/* 
                           Note: Provide a real video source when available.
                        */}
            <View style={styles.videoPlaceholder}>
              <View style={styles.playButtonCircle}>
                <Text style={styles.playButtonIcon}>▶</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Mic Button */}
        <Microphone />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircle: {
    width: 60,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonIcon: {
    color: 'white',
    fontSize: 24,
  },
});
