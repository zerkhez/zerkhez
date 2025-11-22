import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

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
            <Text style={styles.title} allowFontScaling={false} >نائٹروجن اسمارٹ</Text>
            <Text style={styles.subtitle} allowFontScaling={false}>درست نائٹروجن مشورے کے ساتھ اپنی فصل کی
پیداوار بڑھائیں!</Text>
          </View>
        </View> 


        {/* Get Started Button - fixed to bottom center with blur + dark tint */}
        <BlurView intensity={60} tint="light" style={styles.getStartedWrapper}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push('/home')}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>شروع کریں</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
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
    // gap: 1,
    flexShrink: 1,
  },
  
  title: {
    fontFamily: 'NotoNastaliqUrdu-Bold',
    // fontWeight: '700',
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
    borderRadius: 14,
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
    paddingHorizontal: 25,
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    height: 56,
    width: 130,
  },
  buttonText: {
    fontFamily: 'NotoNastaliqUrdu-Bold',
    color: '#303b12ff',
    fontSize: 12,
    fontWeight: '600',

  },
  buttonArrow: {
    color: '#303b12ff',
    fontSize: 25,
    fontWeight: '600',
  },
});