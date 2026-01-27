import Header from "@/components/header";
import { commonTexts } from "@/constants/commonText";
import { THEME_COLOR } from "@/constants/theme";
import { commonStyles, horizontalScale, verticalScale, moderateScale } from "@/styles/common";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";

export default function InstructionsScreen() {
  const router = useRouter();

  // Animation values for play buttons
  const playButtonScale1 = useSharedValue(1);
  const playButtonScale2 = useSharedValue(1);

  const videos = [
    {
      id: 1,
      title: "فصلوں کی بیماریوں کی تشخیص",
      titleEng: "Crop Disease Identification",
      url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_1",
      thumbnail: "📹",
    },
    {
      id: 2,
      title: "ایپ استعمال کرنے کی ہدایات",
      titleEng: "App Usage Instructions",
      url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_2",
      thumbnail: "📹",
    },
  ];

  useEffect(() => {
    // Pulse animation for play button 1
    playButtonScale1.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true,
    );

    // Pulse animation for play button 2 (slightly offset)
    playButtonScale2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(1.15, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
      true,
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
    <View style={commonStyles.lightContainer}>
      {/* Header */}
      <Header text={commonTexts.instructions} />

      <ScrollView style={styles.content}>
        <Animated.Text
          entering={FadeInDown.delay(400).springify()}
          style={styles.sectionTitle}
        >
          {commonTexts.videos}
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(500).springify()}
          style={styles.sectionSubtitle}
        >
          {commonTexts.moreInfo}
        </Animated.Text>

        <View style={styles.videosContainer}>
          {videos.map((video, index) => (
            <Animated.View
              key={video.id}
              entering={FadeInDown.delay(600 + index * 200).springify()}
            >
              <TouchableOpacity
                style={styles.videoCard}
                onPress={() => { openVideo(video.url); }}
                activeOpacity={0.7}
              >
                <View style={styles.videoThumbnail}>
                  <Animated.View
                    style={[
                      styles.playButton,
                      index === 0
                        ? playButtonAnimatedStyle1
                        : playButtonAnimatedStyle2,
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
  placeholder: {
    width: horizontalScale(40),
  },
  content: {
    flex: 1,
    padding: horizontalScale(20),
  },
  sectionTitle: {
    fontFamily: "NotoNastaliqUrdu-Bold",
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#333",
    marginBottom: verticalScale(8),
    textAlign: "right",
  },
  sectionSubtitle: {
    fontFamily: "NotoNastaliqUrdu-Regular",
    fontSize: moderateScale(16),
    color: "#666",
    marginBottom: verticalScale(24),
    textAlign: "right",
  },
  videosContainer: {
    gap: verticalScale(20),
  },
  videoCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  videoThumbnail: {
    height: verticalScale(200),
    backgroundColor: THEME_COLOR,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  thumbnailEmoji: {
    fontSize: moderateScale(64),
    opacity: 0.3,
  },
  playButton: {
    position: "absolute",
    width: horizontalScale(70),
    height: horizontalScale(70),
    borderRadius: horizontalScale(35),
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  playIcon: {
    fontSize: moderateScale(32),
    color: THEME_COLOR,
    marginLeft: horizontalScale(4),
  },
  videoInfo: {
    padding: horizontalScale(20),
  },
  videoTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(4),
    textAlign: "right",
  },
  videoTitleEng: {
    fontSize: moderateScale(14),
    color: "#666",
    textAlign: "right",
  },
});
