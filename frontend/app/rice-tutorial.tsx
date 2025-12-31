import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME_COLOR = '#4F611C';

export default function RiceTutorialScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>چاول کی تصویر لینے کا طریقہ</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      {/* Content Container */}
      <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <Text style={styles.instructionText}>
            چاول کی فصل کی تصویر لینے کا درست طریقہ جاننے کے لیے ویڈیو دیکھیں:
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
        <Animated.View entering={ZoomIn.delay(500).springify()} style={styles.micContainer}>
          <TouchableOpacity style={styles.micButton}>
            <Image source={require('../assets/icons/mic.png')} style={styles.micIcon} resizeMode="contain" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
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
  backIcon: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
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
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  scrollContent: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 100, // Space for mic button
  },
  instructionText: {
    fontFamily: 'NotoNastaliqUrdu-Regular',
    fontSize: 18,
    color: 'black',
    textAlign: 'right',
    lineHeight: 30,
    marginBottom: 30,
    width: '100%',
  },
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
  micContainer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
  },
  micButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6a8a2c', // Matches theme
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
