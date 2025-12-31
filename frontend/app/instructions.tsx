import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const THEME_COLOR = '#4F611C';

export default function InstructionsScreen() {
  const router = useRouter();

  // Animation values for play buttons
  const playButtonScale1 = useSharedValue(1);
  const playButtonScale2 = useSharedValue(1);

  const videos = [
    {
      id: 1,
      title: 'فصلوں کی بیماریوں کی تشخیص',
      titleEng: 'Crop Disease Identification',
      url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_1',
      thumbnail: '📹',
    },
    {
      id: 2,
      title: 'ایپ استعمال کرنے کی ہدایات',
      titleEng: 'App Usage Instructions',
      url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_2',
      thumbnail: '📹',
    },
  ];

  useEffect(() => {
    // Pulse animation for play button 1
    playButtonScale1.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Pulse animation for play button 2 (slightly offset)
    playButtonScale2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(1.15, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const playButtonAnimatedStyle1 = useAnimatedStyle(() => {
    return {
      transform: [{ scale: playButtonScale1.value }],
    };
  });

  const playButtonAnimatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ scale: playButtonScale2.value }],
    };
  });

  const openVideo = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        entering={FadeIn.duration(600)}
        style={styles.header}
      >
        <Animated.View entering={FadeInLeft.delay(200).springify()}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.Text 
          entering={FadeIn.delay(300)}
          style={styles.headerTitle}
        >
          ہدایات
        </Animated.Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView style={styles.content}>
        <Animated.Text 
          entering={FadeInDown.delay(400).springify()}
          style={styles.sectionTitle}
        >
          ویڈیو ٹیوٹوریلز
        </Animated.Text>
        <Animated.Text 
          entering={FadeInDown.delay(500).springify()}
          style={styles.sectionSubtitle}
        >
          مزید معلومات کے لیے یہ ویڈیوز دیکھیں
        </Animated.Text>

        <View style={styles.videosContainer}>
          {videos.map((video, index) => (
            <Animated.View
              key={video.id}
              entering={FadeInDown.delay(600 + index * 200).springify()}
            >
              <TouchableOpacity
                style={styles.videoCard}
                onPress={() => openVideo(video.url)}
                activeOpacity={0.7}
              >
                <View style={styles.videoThumbnail}>
                  <Animated.View 
                    style={[
                      styles.playButton, 
                      index === 0 ? playButtonAnimatedStyle1 : playButtonAnimatedStyle2
                    ]}
                  >
                    <Text style={styles.playIcon}>▶</Text>
                  </Animated.View>
                  <Text style={styles.thumbnailEmoji}>{video.thumbnail}</Text>
                </View>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoTitleEng}>{video.titleEng}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: THEME_COLOR,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 28,
  },
  headerTitle: {
    fontFamily: 'NotoNastaliqUrdu-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'NotoNastaliqUrdu-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  sectionSubtitle: {
    fontFamily: 'NotoNastaliqUrdu-Regular',
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'right',
  },
  videosContainer: {
    gap: 20,
  },
  videoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  videoThumbnail: {
    height: 200,
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnailEmoji: {
    fontSize: 64,
    opacity: 0.3,
  },
  playButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  playIcon: {
    fontSize: 32,
    color: THEME_COLOR,
    marginLeft: 4,
  },
  videoInfo: {
    padding: 20,
  },
  videoTitle: {
    // fontFamily: 'NotoNastaliqUrdu-Bold',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'right',
  },
  videoTitleEng: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
});