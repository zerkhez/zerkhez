import { useLocalSearchParams } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useState, useEffect } from 'react';

import Microphone from '@/components/microphone';
import Header from '@/components/header';
import { THEME_COLOR } from '@/constants/theme';
import {
  commonStyles,
  verticalScale,
  horizontalScale,
  moderateScale,
  getRegularFont,
} from '@/styles/common';

import riceImg from '@/assets/images/how_to_take_pic_of_rice.jpeg';
import maizeImg from '@/assets/images/how_to_take_pic_of_maize.jpeg';
import wheatImg from '@/assets/images/how_to_take_pic_of_wheat.jpeg';

const CROP_VIDEO_IDS: Record<string, string> = {
  'چاول': 'RZ6o473CMSs',
  'مکئی': 'Hn92mLbiYuI',
  'گندم': 'BQTlHHNIyek',
};

export default function VideoTutorialScreen() {
  const params = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const { displayFieldName } = params;
  const [playing, setPlaying] = useState(false);

  const cropName = Array.isArray(displayFieldName)
    ? displayFieldName[0]
    : displayFieldName || '';

  const playButtonScale = useSharedValue(1);

  useEffect(() => {
    playButtonScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true
    );
  }, []);

  const playButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playButtonScale.value }],
  }));

  const getVideoId = () => {
    for (const [key, id] of Object.entries(CROP_VIDEO_IDS)) {
      if (cropName.includes(key)) return id;
    }
    return CROP_VIDEO_IDS['چاول'];
  };

  const getCropImage = () => {
    if (cropName.includes('چاول')) return riceImg;
    if (cropName.includes('مکئی')) return maizeImg;
    if (cropName.includes('گندم')) return wheatImg;
    return riceImg;
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Header
        text={t('common.wayOfImage', { cropName })}
        textSize={15}
      />

      <Animated.View
        entering={FadeInUp.delay(200).duration(600).springify()}
        style={commonStyles.contentContainer}
      >
        <ScrollView
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={[
              commonStyles.descriptionText,
              getRegularFont(i18n.language),
              { textAlign: i18n.language === 'ur' ? 'right' : 'left' },
            ]}
          >
            {cropName} {t('common.watchVideo')}
          </Text>

          <View style={styles.videoCard}>
            {playing ? (
              <YoutubePlayer
                height={verticalScale(220)}
                videoId={getVideoId()}
                play={true}
              />
            ) : (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.thumbnailWrapper}
                onPress={() => setPlaying(true)}
              >
                <Image
                  source={getCropImage()}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
                <Animated.View style={[styles.playButton, playButtonAnimatedStyle]}>
                  <Text style={styles.playIcon}>▶</Text>
                </Animated.View>
              </TouchableOpacity>
            )}

            {!playing && (
              <View style={styles.videoInfo}>
                <Text
                  style={[
                    styles.videoTitle,
                    getRegularFont(i18n.language),
                    { textAlign: i18n.language === 'ur' ? 'right' : 'left' },
                  ]}
                >
                  {t('common.wayOfImage', { cropName })}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <Microphone />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  videoCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: moderateScale(18),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  thumbnailWrapper: {
    height: verticalScale(220),
    justifyContent: 'center',
    alignItems: 'center',
  },

  thumbnailImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  playButton: {
    width: horizontalScale(70),
    height: horizontalScale(70),
    borderRadius: horizontalScale(35),
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playIcon: {
    fontSize: moderateScale(32),
    color: THEME_COLOR,
    marginLeft: horizontalScale(4),
  },

  videoInfo: {
    height: verticalScale(72),
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(20),
  },

  videoTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
  },
});
