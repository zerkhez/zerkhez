import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { zerkhezAppTitle, motto, commonTexts } from '@/constants/commonText';
import { forwardButtonIcon } from '@/constants/constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WelcomeScreen() {
  const router = useRouter();
  const scale = useSharedValue(1);
  const [weatherData, setWeatherData] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchWeather = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      const apiKey =
        process.env.EXPO_PUBLIC_OPENWEATHERMAP_API_KEY ||
        'fddbdfd48ce21911399a167863770702';

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();

      if (response.ok) {
        setWeatherData({
          temp: Math.round(data.main.temp).toString(),
          condition: data.weather[0].main,
          location: data.name,
        });
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
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'flex-end',
    width: '100%',
  },
  header: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  logoImage: {
    width: 70,
    height: 70,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    alignSelf: 'flex-end',
  },
  titleContainer: {
    fontFamily: 'NotoNastaliqUrdu-Bold',
    alignItems: 'flex-end',
    flexShrink: 1,
  },

  title: {
    fontFamily: 'NotoNastaliqUrdu-Bold',
    fontStyle: 'normal',
    fontSize: 35,
    lineHeight: 80,
    letterSpacing: -1.32,
    color: '#1a5217',
    textAlign: 'right',
    fontVariant: ['small-caps'],
  },
  subtitle: {
    fontFamily: 'NotoNastaliqUrdu-Regular',
    fontWeight: '400',
    fontStyle: 'normal',
    fontSize: 15,
    lineHeight: 30,
    letterSpacing: -0.4,
    color: 'white',
    textAlign: 'right',
    fontVariant: ['small-caps'],
  },
  getStartedWrapper: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    borderRadius: 50, // Made more round/oval
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  getStartedButton: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 30, // Increased padding for better oval shape
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    height: 60, // Slightly increased height
  },
  buttonText: {
    fontFamily: 'NotoNastaliqUrdu-Bold',
    color: '#303b12ff',
    fontSize: 14, // Slightly larger font
    fontWeight: '600',

  },
  buttonArrow: {
    color: '#303b12ff',
    fontSize: 25,
    fontWeight: '600',
  },
});