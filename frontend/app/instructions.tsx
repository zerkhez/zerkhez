
import Header from "@/components/header";
import { THEME_COLOR } from "@/constants/theme";
import {
  commonStyles,
  horizontalScale,
  verticalScale,
  moderateScale,
  getHeaderFont,
  getRegularFont,
} from "@/styles/common";

import { useEffect } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useTranslation } from "react-i18next";

import howToUseApp from "@/assets/images/how_to_use_app.jpeg";

export default function InstructionsScreen() {
  const { t, i18n } = useTranslation();

  const playButtonScale = useSharedValue(1);

  // Only ONE video placeholder
  const videos = [
    {
      id: 1,
      titleEn: "How to Use the App",
      titleUr: "ایپ استعمال کرنے کا طریقہ",
      image: howToUseApp,
      url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_1",
    },
  ];

  useEffect(() => {
    playButtonScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const playButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: playButtonScale.value }],
    };
  });

  const openVideo = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={["top"]}>
      <Header text={t("common.instructions")} />

      <View style={commonStyles.contentContainer}>
        <ScrollView
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.Text
            entering={FadeInDown.delay(300).springify()}
            style={[
              styles.sectionTitle,
              getHeaderFont(i18n.language),
            ]}
          >
            {t("common.videos")}
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(450).springify()}
            style={[
              styles.sectionSubtitle,
              getRegularFont(i18n.language),
            ]}
          >
            {t("common.moreInfo")}
          </Animated.Text>

          <View style={styles.videosContainer}>
            {videos.map((video, index) => (
              <Animated.View
                key={video.id}
                entering={FadeInDown.delay(600 + index * 200).springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.videoCard}
                  onPress={() => openVideo(video.url)}
                >
                  {/* Thumbnail */}
                  <View style={styles.thumbnailWrapper}>
                    <Image
                      source={video.image}
                      style={styles.thumbnailImage}
                      resizeMode="contain"
                    />

                    {/* Play Button */}
                    <Animated.View
                      style={[
                        styles.playButton,
                        playButtonAnimatedStyle,
                      ]}
                    >
                      <Text style={styles.playIcon}>▶</Text>
                    </Animated.View>
                  </View>

                  {/* Fixed-height title section */}
                  <View style={styles.videoInfo}>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.videoTitle,
                        getRegularFont(i18n.language),
                      ]}
                    >
                      {i18n.language === "ur"
                        ? video.titleUr
                        : video.titleEn}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#2a3510",
    marginBottom: verticalScale(8),
  },

  sectionSubtitle: {
    fontSize: moderateScale(14),
    color: "#666",
    marginBottom: verticalScale(24),
  },

  videosContainer: {
    width: "100%",
    gap: verticalScale(20),
  },

  videoCard: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: moderateScale(18),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    elevation: 3,
  },

  thumbnailWrapper: {
    height: verticalScale(180),
    position: "relative",
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },

  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -35,
    marginTop: -35,
    width: horizontalScale(70),
    height: horizontalScale(70),
    borderRadius: horizontalScale(35),
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  playIcon: {
    fontSize: moderateScale(32),
    color: THEME_COLOR,
    marginLeft: horizontalScale(4),
  },

  // Fixed height keeps Urdu and English same size
  videoInfo: {
    height: verticalScale(72),
    paddingHorizontal: horizontalScale(18),
    justifyContent: "center",
    alignItems: "center",
  },

  videoTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    lineHeight: moderateScale(28),
  },
});

