
import Header from "@/components/header";
import {
  commonStyles,
  verticalScale,
  moderateScale,
  getHeaderFont,
  getRegularFont,
} from "@/styles/common";

import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

const INSTRUCTIONS_VIDEO_ID = "5XfE6H4wqEQ";

export default function InstructionsScreen() {
  const { t, i18n } = useTranslation();

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
            style={[styles.sectionTitle, getHeaderFont(i18n.language)]}
          >
            {t("common.videos")}
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(450).springify()}
            style={[styles.sectionSubtitle, getRegularFont(i18n.language)]}
          >
            {t("common.moreInfo")}
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(600).springify()}
            style={styles.playerWrapper}
          >
            <YoutubePlayer
              height={verticalScale(220)}
              videoId={INSTRUCTIONS_VIDEO_ID}
              play={false}
            />
          </Animated.View>
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

  playerWrapper: {
    width: "100%",
    borderRadius: moderateScale(18),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#000",
    elevation: 3,
  },
});
