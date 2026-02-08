// Purpose: Root layout for the app
// Author: 
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'NotoNastaliqUrdu-Regular': require('../assets/fonts/NotoSansArabic-Regular.ttf'),
    'NotoNastaliqUrdu-Bold': require('../assets/fonts/NotoSansArabic-Bold.ttf'),
    'NotoSansArabic-Regular': require('../assets/fonts/NotoSansArabic-Regular.ttf'),
    'NotoSansArabic-Bold': require('../assets/fonts/NotoSansArabic-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="crop-types" />
        <Stack.Screen name="instructions" />
        <Stack.Screen name="selection" />
        <Stack.Screen name="instruction-nitrogen" />
        <Stack.Screen name="pre-planting-instructions" />
        <Stack.Screen name="fertilizer-selection" />
        <Stack.Screen name="nitrogen-calculator" />
        <Stack.Screen name="image-analysis" />
        <Stack.Screen name="analysis-results" />
        <Stack.Screen name="sprout-instructions" />
        <Stack.Screen name="gobh-instructions" />
        <Stack.Screen name="results" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}