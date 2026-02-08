import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { zerkhezAppTitle, motto, commonTexts } from '@/constants/commonText';
import { forwardButtonIcon } from '@/constants/constants';
import * as Network from 'expo-network';
import { horizontalScale, verticalScale, moderateScale } from '@/styles/common';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WelcomeScreen() {
  const router = useRouter();
  const scale = useSharedValue(1);
  const [weatherData, setWeatherData] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchWeather = async () => {
      // check whether user permissions allowed or not
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      // Check internet connection
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected) {
        alert("No Internet Connection. Please connect to the internet.");
        setWeatherData({
          temp: "--",
          condition: "Unknown",
          location: "No Internet"
        });
        return;
      }

      // get user current location
      let location = await Location.getCurrentPositionAsync({});
      const apiKey =
        process.env.EXPO_PUBLIC_OPENWEATHERMAP_API_KEY ||
        'fddbdfd48ce21911399a167863770702';

      try {
        // Get weather information of user location
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        if (response.ok) {
          setWeatherData({
            temp: Math.round(data.main.temp).toString(),
            condition: data.weather[0].main,
            location: data.name
          });
        }
      } catch (e) {
        console.log("Error fetching weather in index", e);
      }
    };

    fetchWeather().catch((err) => console.log('Error fetching weather in index', err));
  }, []);



  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const onPressIn = () => {
    scale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <View style={styles.container}>
      {/* Background Image - you'll need to add your wheat field image */}
      <Image
        source={require('../assets/images/welcome.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Overlay gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
        style={styles.overlay}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Header: logo at left, title/subtitle below it (left aligned) */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title} allowFontScaling={false} >{zerkhezAppTitle}</Text>
            <Text style={styles.subtitle} allowFontScaling={false}>{motto}</Text>
          </View>
        </View>


        {/* Get Started Button - fixed to bottom center with blur + dark tint */}
        <BlurView intensity={60} tint="light" style={styles.getStartedWrapper}>
          <AnimatedPressable
            style={[styles.getStartedButton, animatedStyle]}
            onPress={() => router.push({
              pathname: '/home',
              params: weatherData || {}
            })}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Text style={styles.buttonText}>{commonTexts.start}</Text>
            <Text style={styles.buttonArrow}>{forwardButtonIcon}</Text>
          </AnimatedPressable>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d5016',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingVertical: verticalScale(60),
    paddingHorizontal: horizontalScale(20),
  },
  logoContainer: {
    alignItems: 'flex-end',
    width: '100%',
  },
  header: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingHorizontal: horizontalScale(20),
  },
  logoImage: {
    width: horizontalScale(70),
    height: horizontalScale(70),
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    alignSelf: 'flex-end',
  },
  titleContainer: {
    fontFamily: 'NotoSansArabic-Bold',
    alignItems: 'flex-end',
    flexShrink: 1,
  },

  title: {
    fontFamily: 'NotoSansArabic-Bold',
    fontStyle: 'normal',
    fontSize: moderateScale(35),
    lineHeight: verticalScale(80),
    letterSpacing: -1.32,
    color: '#1a5217',
    textAlign: 'right',
    fontVariant: ['small-caps'],
  },
  subtitle: {
    fontFamily: 'NotoSansArabic-Regular',
    fontWeight: '400',
    fontStyle: 'normal',
    fontSize: moderateScale(15),
    lineHeight: verticalScale(30),
    letterSpacing: -0.4,
    color: 'white',
    textAlign: 'right',
    fontVariant: ['small-caps'],
  },
  getStartedWrapper: {
    position: 'absolute',
    bottom: verticalScale(70),
    alignSelf: 'center',
    borderRadius: moderateScale(50), // Made more round/oval
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(3.84),
  },
  getStartedButton: {
    flexDirection: 'row',
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(30), // Increased padding for better oval shape
    alignItems: 'center',
    gap: horizontalScale(10),
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    height: verticalScale(60), // Slightly increased height
    width: horizontalScale(170),
  },
  buttonText: {
    fontFamily: 'NotoSansArabic-Bold',
    color: '#303b12ff',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  buttonArrow: {
    color: '#303b12ff',
    fontSize: moderateScale(30),
    fontWeight: '900',
    paddingVertical: verticalScale(-15),
    marginVertical: verticalScale(-15),
    paddingHorizontal: horizontalScale(10),
  },
});
