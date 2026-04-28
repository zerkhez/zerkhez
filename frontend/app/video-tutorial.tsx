import { useLocalSearchParams } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
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
import { useEffect } from 'react';

import Microphone from '@/components/microphone';
import Header from '@/components/header';
import { THEME_COLOR } from '@/constants/theme';
import {
  commonStyles,
  verticalScale,
  horizontalScale,
  moderateScale,
  getRegularFont
} from '@/styles/common';

// Crop Images
import riceImg from '@/assets/images/how_to_take_pic_of_rice.jpeg';
import maizeImg from '@/assets/images/how_to_take_pic_of_maize.jpeg';
import wheatImg from '@/assets/images/how_to_take_pic_of_wheat.jpeg';

export default function RiceTutorialScreen() {
  const params = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const { displayFieldName } = params;

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


  // Dynamic image selection using Urdu crop names
  const getCropImage = () => {
    if (
      cropName.includes('چاول')
    ) {
      return riceImg;
    }

    if (
      cropName.includes('مکئی')
    ) {
      return maizeImg;
    }

    if (
      cropName.includes('گندم')
    ) {
      return wheatImg;
    }

    return riceImg; // fallback
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
              {
                textAlign:
                  i18n.language === 'ur'
                    ? 'right'
                    : 'left'
              }
            ]}
          >
            {cropName} {t('common.watchVideo')}
          </Text>

          {/* Video Card */}
          <TouchableOpacity
            style={styles.videoCard}
            activeOpacity={0.85}
          >
            <View style={styles.videoThumbnail}>
              <Image
                source={getCropImage()}
                style={styles.thumbnailImage}
                resizeMode="contain"
              />

              <Animated.View
                style={[
                  styles.playButton,
                  playButtonAnimatedStyle
                ]}
              >
                <Text style={styles.playIcon}>▶</Text>
              </Animated.View>
            </View>

            <View style={styles.videoInfo}>
              <Text
                style={[
                  styles.videoTitle,
                  getRegularFont(i18n.language),
                  {
                    textAlign:
                      i18n.language === 'ur'
                        ? 'right'
                        : 'left'
                  }
                ]}
              >
                {t('common.wayOfImage', { cropName })}
              </Text>
            </View>
          </TouchableOpacity>

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

  videoThumbnail: {
    height: verticalScale(180),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  thumbnailImage: {
    width: '100%',
    height: '100%',
  },

  playButton: {
    position: 'absolute',
    width: horizontalScale(70),
    height: horizontalScale(70),
    borderRadius: horizontalScale(35),
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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