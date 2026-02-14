import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { zerkhezAppTitle, motto } from '@/constants/commonText';
import * as Network from 'expo-network';
import { horizontalScale, verticalScale, moderateScale, getHeaderFont, getRegularFont } from '@/styles/common';
import { useTranslation } from 'react-i18next';


export default function WelcomeScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [weatherData, setWeatherData] = useState<Record<string, string>>({});
  const [weatherLoaded, setWeatherLoaded] = useState(false);

  // Animation values
  const blobScale = useSharedValue(0);
  const blobOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  // Track if minimum animation time has passed
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    // Start animations immediately
    // Phase 1: Blob appears with logo (0-3.0s)
    blobOpacity.value = withTiming(1, { duration: 300 });
    blobScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 400 });

    // Phase 2: Blob expands to full screen (starts at 3.0s)
    setTimeout(() => {
      blobScale.value = withSpring(20, { damping: 15, stiffness: 80 });
    }, 3000);

    // Phase 3: Title and motto fade in (starts at 3.6s)
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 500 });
    }, 3600);

    // Minimum time passed (starts at 3.6s + 3s hold = 6.6s ~ 7s)
    setTimeout(() => {
      setMinTimePassed(true);
    }, 7000);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      // check whether user permissions allowed or not
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setWeatherLoaded(true);
        return;
      }

      // Check internet connection
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected) {
        setWeatherData({
          temp: "--",
          condition: "Unknown",
          location: "No Internet"
        });
        setWeatherLoaded(true);
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
      } finally {
        setWeatherLoaded(true);
      }
    };

    fetchWeather().catch((err) => {
      console.log('Error fetching weather in index', err);
      // Ensure we mark as loaded even on error so we don't get stuck
      setWeatherLoaded(true);
    });
  }, []);

  // Navigation effect: wait for weather AND minimum time, OR safety timeout
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let navigated = false;

    const navigateToHome = () => {
      if (!navigated) {
        navigated = true;
        router.push({
          pathname: '/home',
          params: weatherData || {}
        });
      }
    };

    // Safety timeout (8s) - just in case
    timeoutId = setTimeout(() => {
      navigateToHome();
    }, 8000);

    // Navigate when BOTH weather is loaded AND minimum time has passed
    if (weatherLoaded && minTimePassed) {
      navigateToHome();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [weatherLoaded, minTimePassed, weatherData, router]);

  const blobAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: blobScale.value }],
      opacity: blobOpacity.value,
    };
  });

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Organic green blob shape */}
      <Animated.View style={[styles.blob, blobAnimatedStyle]} />

      {/* Logo */}
      <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Title and Motto */}
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={[styles.title, getHeaderFont(i18n.language)]} allowFontScaling={false}>
          {zerkhezAppTitle}
        </Text>
        <Text style={[styles.subtitle, getRegularFont(i18n.language)]} allowFontScaling={false}>
          {motto}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0', // Light cream/beige background
    justifyContent: 'center',
    alignItems: 'center',
  },
  blob: {
    position: 'absolute',
    width: horizontalScale(300),
    height: horizontalScale(260),
    backgroundColor: '#8BCB6B', // slightly softer green like image

    borderTopLeftRadius: horizontalScale(120),
    borderTopRightRadius: horizontalScale(160),

    borderBottomLeftRadius: horizontalScale(220),
    borderBottomRightRadius: horizontalScale(180),

    transform: [{ rotate: '-6deg' }],
  },
  logoWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoImage: {
    width: horizontalScale(100),
    height: horizontalScale(100),
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  title: {
    fontSize: moderateScale(48),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: moderateScale(18),
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
