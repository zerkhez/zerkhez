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
  const { t, i18n } = useTranslation();
  const [weatherData, setWeatherData] = useState<Record<string, string>>({});
  const [weatherLoaded, setWeatherLoaded] = useState(false);

  // Animation values
  const blobScale = useSharedValue(0);
  const blobOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(50); // Start text slightly lower for slide-up effect
  const textScale = useSharedValue(1);
  const textTranslateX = useSharedValue(0);
  const welcomeOpacity = useSharedValue(0);
  const welcomeScale = useSharedValue(1);
  const welcomeTranslateX = useSharedValue(0);
  const welcomeTranslateY = useSharedValue(0);

  // Track if minimum animation time has passed
  const [minTimePassed, setMinTimePassed] = useState(false);

  // Permission state
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  // Language loop state
  const [displayLanguage, setDisplayLanguage] = useState<'en' | 'ur'>('en');

  useEffect(() => {
    // Start animations
    // Phase 1: Blob AND Logo appear TOGETHER (0-1.0s)
    blobOpacity.value = withTiming(1, { duration: 500 });
    blobScale.value = withTiming(1, { duration: 500 }); // No bounce - using withTiming
    logoOpacity.value = withTiming(1, { duration: 600 });

    // Phase 2: Blob expands AND Logo moves up TOGETHER (starts at 2.5s)
    setTimeout(() => {
      // Expand blob smoothly without bounce
      blobScale.value = withTiming(25, { duration: 1200 });

      // Move logo up synchronously - increased margin to 140
      logoTranslateY.value = withTiming(-verticalScale(140), { duration: 1200 });

      // Text appears with smooth timing
      textOpacity.value = withTiming(1, { duration: 800 });
      textTranslateY.value = withTiming(0, { duration: 800 });

      // Welcome text appears
      welcomeOpacity.value = withTiming(1, { duration: 1000 });
    }, 2500);

    // Minimum time passed - Extended to 10 seconds
    setTimeout(() => {
      setMinTimePassed(true);
    }, 10000);
  }, []);

  // Language loop effect - switches between English and Urdu
  useEffect(() => {
    const startLoop = async () => {
      // Wait for text to appear (4.5s)
      await new Promise(r => setTimeout(r, 4500));

      // Loop every 2 seconds
      const intervalId = setInterval(() => {
        // Fade out
        textOpacity.value = withTiming(0, { duration: 400 });

        welcomeOpacity.value = withTiming(0, { duration: 400 });

        setTimeout(() => {
          // Switch language
          setDisplayLanguage(prev => prev === 'en' ? 'ur' : 'en');

          // Fade in
          textOpacity.value = withTiming(1, { duration: 400 });
          welcomeOpacity.value = withTiming(1, { duration: 400 });
        }, 400);
      }, 2500);

      return intervalId;
    };

    const loopPromise = startLoop();

    return () => {
      loopPromise.then(intervalId => clearInterval(intervalId));
    };
  }, []);

  // Request location permission on splash screen
  useEffect(() => {
    const requestPermission = async () => {
      // Wait for initial animations (4s)
      await new Promise(r => setTimeout(r, 4000));

      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionGranted(status === 'granted');
    };

    requestPermission();
  }, []);

  useEffect(() => {
    // Only fetch weather if permission has been granted
    if (permissionGranted === null) return; // Wait for permission response

    const fetchWeather = async () => {
      if (!permissionGranted) {
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
  }, [permissionGranted]);

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

    // Safety timeout (12s) - just in case
    timeoutId = setTimeout(() => {
      navigateToHome();
    }, 12000);

    // Navigate when BOTH weather is loaded AND minimum time has passed AND permission handled
    if (weatherLoaded && minTimePassed && permissionGranted !== null) {
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
      transform: [{ translateY: logoTranslateY.value }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [
        { translateY: textTranslateY.value },
        { translateX: textTranslateX.value },
        { scale: textScale.value }
      ],
    };
  });

  const welcomeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: welcomeOpacity.value,
      transform: [
        { translateY: welcomeTranslateY.value },
        { scale: welcomeScale.value }
      ]
    };
  });

  // Derived text based on displayLanguage state
  const currentTitle = displayLanguage === 'en' ? "Zerkhez" : "زرخیز";
  const currentMotto = displayLanguage === 'en' ? "Snap. Analyze. Fertilize." : "تصویر لیں۔ تجزیہ کریں۔ کھاد ڈالیں۔";
  const currentWelcome = displayLanguage === 'en' ? "Welcome" : "خوش آمدید";

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
        <Text style={[styles.title, getHeaderFont(displayLanguage)]} allowFontScaling={false}>
          {currentTitle}
        </Text>
        <Text style={[styles.subtitle, getRegularFont(displayLanguage)]} allowFontScaling={false}>
          {currentMotto}
        </Text>
      </Animated.View>

      {/* Welcome Text */}
      <Animated.View style={[styles.welcomeContainer, welcomeAnimatedStyle]}>
        <Text style={[styles.welcomeText, getHeaderFont(displayLanguage)]}>{currentWelcome}</Text>
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
  welcomeContainer: {
    position: 'absolute',
    bottom: verticalScale(50),
    alignItems: 'center',
    zIndex: 5,
  },
  welcomeText: {
    fontSize: moderateScale(24),
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  }
});
