import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { OPEN_WEATHER_API_URL } from '@/constants';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInLeft,
    FadeInRight,
    FadeInUp,
    SlideInDown,
    SlideInLeft,
    SlideInRight,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { THEME_COLOR } from '@/constants/theme';
import { commonTexts, urduDays, urduMonths, urduNumbers } from '@/constants/commonText';
import { commonStyles } from '@/styles/common';
import { bellIcon, forwardButtonIcon, wheatIcon, riceIcon, maizeIcon } from '@/constants/constants';


export default function HomeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [weather, setWeather] = useState({
        temp: params.temp ? params.temp as string : "Loading...",
        condition: params.condition ? params.condition as string : 'Loading...',
        description: params.description ? params.description as string : '',
        location: params.location ? params.location as string : 'Loading...'
    });

    const getCurrentUrduDate = () => {
        const now = new Date();

        // Convert English number to Urdu
        const toUrduNumber = (num: number) => {
            return num.toString().split('').map(digit => urduNumbers[parseInt(digit)]).join('');
        };

        const day = now.getDate();
        const month = urduMonths[now.getMonth()];
        const year = now.getFullYear();
        const dayName = urduDays[now.getDay()];

        return `${month} ${toUrduNumber(day)}، ${dayName}، ${toUrduNumber(year)}`;
    };

    const [currentDate, setCurrentDate] = useState(getCurrentUrduDate())

    useEffect(() => {
        // If weather data was passed via params, we don't need to fetch again immediately
        if (params.temp && params.location) {
            setWeather({
                temp: params.temp as string,
                condition: params.condition as string,
                description: params.description ? params.description as string : '',
                location: params.location as string
            });
            return;
        }

        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setWeather(prev => ({ ...prev, location: 'Permission Denied' }));
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            fetchWeather(location.coords.latitude, location.coords.longitude);
        })();
    }, [params.temp, params.condition, params.location]);

    const fetchWeather = async (lat: number, lon: number) => {
        try {

            // directly using api for now handle it later
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPEN_WEATHER_API_URL}`
            );
            const data = await response.json();
            if (response.ok) {
                setWeather({
                    temp: Math.round(data.main.temp).toString(),
                    condition: data.weather[0].main,
                    description: data.weather[0].description,
                    location: data.name
                });
            } else {
                console.error("Weather API Error:", data.message);
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };

    const getWeatherIcon = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'clear': return '☀️';
            case 'clouds': return '⛅';
            case 'rain':
            case 'drizzle': return '🌧️';
            case 'thunderstorm': return '⛈️';
            case 'snow': return '❄️';
            case 'mist':
            case 'smoke':
            case 'haze':
            case 'dust':
            case 'fog':
            case 'sand':
            case 'ash':
            case 'squall':
            case 'tornado': return '☁️';
            default: return '⛅';
        }
    };

    // Animation values
    const bellRotation = useSharedValue(0);
    const weatherIconScale = useSharedValue(1);

    const crops = [
        { id: 'wheat', name: 'گندم', nameEng: 'Wheat', icon: wheatIcon, color: THEME_COLOR, image: require('../assets/images/wheat.png') },
        { id: 'rice', name: 'چاول', nameEng: 'Rice', icon: riceIcon, color: THEME_COLOR, image: require('../assets/images/rice.png') },
        { id: 'maize', name: 'مکئی', nameEng: 'Maize', icon: maizeIcon, color: THEME_COLOR, image: require('../assets/images/corn.png') },
    ];

    useEffect(() => {
        // Bell notification animation - subtle shake
        bellRotation.value = withRepeat(
            withSequence(
                withTiming(10, { duration: 100 }),
                withTiming(-10, { duration: 100 }),
                withTiming(10, { duration: 100 }),
                withTiming(0, { duration: 100 }),
                withTiming(0, { duration: 3000 }) // Pause between shakes
            ),
            -1, // Infinite repeat
            false
        );

        // Weather icon pulse animation
        weatherIconScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1500 }),
                withTiming(1, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const bellAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${bellRotation.value}deg` }],
        };
    });

    const weatherIconAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: weatherIconScale.value }],
        };
    });

    const [displayTemp, setDisplayTemp] = useState(0);

    useEffect(() => {
        const targetTemp = parseFloat(weather.temp.toString());

        if (isNaN(targetTemp)) {
            // If temp is "Loading..." or invalid, don't animate or set to 0
            return;
        }

        const duration = 2500; // 2 seconds total animation
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1); // 0 to 1

            // Ease-out cubic function: starts fast, ends slow
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const currentTemp = Math.round(easeOut * targetTemp);
            setDisplayTemp(currentTemp);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayTemp(targetTemp); // Ensure exact final value
            }
        };

        requestAnimationFrame(animate);
    }, [weather.temp]);

    return (
        <View style={commonStyles.lightContainer}>
            {/* Curved Header */}
            <Animated.View
                entering={FadeIn.duration(800)}
                style={styles.headerContainer}
            >
                {/* SVG Curve */}
                <Svg
                    height="200"
                    width="100%"
                    style={styles.svg}
                    viewBox="0 0 375 200"
                    preserveAspectRatio="none"
                >
                    <Path
                        d="M 0 0 L 0 150 Q 187.5 350 375 150 L 375 0 Z"
                        fill={THEME_COLOR}
                    />
                </Svg>

                {/* Header Content */}
                <View style={styles.headerContent}>
                    {/* Bell Icon - Top Left - Animated */}
                    <Animated.View entering={FadeInLeft.delay(300).springify()}>
                        <TouchableOpacity style={styles.bellIcon}>
                            <Animated.Text style={[styles.bellText, bellAnimatedStyle]}>
                                {bellIcon}
                            </Animated.Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Title and Date - Top Right - Animated */}
                    <Animated.View
                        entering={FadeInRight.delay(300).springify()}
                        style={styles.headerTextContainer}
                    >
                        <Text style={styles.headerTitle}>{commonTexts.welcomeFarmer}</Text>
                        <Text style={styles.headerDate}>{currentDate}</Text>
                    </Animated.View>
                </View>
            </Animated.View>

            {/* Weather Card - Slide in from bottom */}
            <Animated.View
                entering={SlideInDown.delay(500).springify()}
                style={styles.weatherCard}
            >
                <View style={styles.weatherTop}>
                    <Text style={styles.weatherLocation}>{weather.location}</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Animated.View
                            style={[styles.weatherIcon, weatherIconAnimatedStyle]}
                        >
                            <Text style={styles.weatherIconText}>{getWeatherIcon(weather.condition)}</Text>
                        </Animated.View>
                        {weather.description ? (
                            <Text style={styles.weatherDescription}>{weather.description}</Text>
                        ) : null}
                    </View>
                </View>
                <View style={styles.weatherBottom}>
                    <Text style={styles.weatherTemp}>{displayTemp}°</Text>
                    <Text style={styles.weatherCondition}>{weather.condition.toUpperCase()}</Text>
                </View>
            </Animated.View>

            {/* Crop Options - Staggered entrance */}
            <View style={styles.cropsContainer}>
                {crops.map((crop, index) => (
                    <Animated.View
                        key={crop.id}
                        entering={
                            index % 2 === 0
                                ? SlideInRight.delay(700 + index * 150).springify()
                                : SlideInLeft.delay(700 + index * 150).springify()
                        }
                    >
                        <TouchableOpacity
                            style={[
                                styles.cropCard,
                                { backgroundColor: crop.color },
                                index % 2 === 0 ? styles.cropCardRight : styles.cropCardLeft
                            ]}
                            onPress={() => {
                                router.push({
                                    pathname: '/selection' as any,
                                    params: { id: crop.id, name: crop.name }
                                });
                            }}
                            activeOpacity={0.7}
                        >
                            {/* Text on inside edge, image placeholder on outside edge */}
                            {index % 2 === 0 ? (
                                <>
                                    <Text style={styles.cropName}>{crop.name}</Text>
                                    <View style={styles.cropImagePlaceholder}>
                                        <Image
                                            source={crop.image}
                                            style={styles.cropImage}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={styles.cropImagePlaceholder}>
                                        <Image
                                            source={crop.image}
                                            style={styles.cropImage}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={styles.cropName}>{crop.name}</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>

            {/* Bottom Navigation - Fade in */}
            <Animated.View
                entering={FadeInUp.delay(1200).springify()}
                style={styles.bottomNav}
            >
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => {
                        console.log('Voice input pressed');
                    }}
                >
                    <View style={styles.voiceButton}>
                        <Image source={require('../assets/icons/mic.png')} style={styles.navIconImage} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButtonRight}
                    onPress={() => router.push('/instructions')}
                >
                    <Text style={styles.navTextRight}>{commonTexts.instructions}</Text>
                    <Text style={styles.navArrow}>{forwardButtonIcon}</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 200,
        position: 'relative',
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 30,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    bellIcon: {
        padding: 5,
    },
    bellText: {
        fontSize: 20,
        color: 'white',
    },
    headerTextContainer: {
        alignItems: 'flex-end',
    },
    headerTitle: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'right',
    },
    headerDate: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 0,
        textAlign: 'right',
    },
    weatherCard: {
        backgroundColor: 'white',
        marginHorizontal: 30,
        marginTop: -60,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    weatherTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    weatherLocation: {
        fontSize: 18,
        fontWeight: '600',
    },
    weatherIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherIconText: {
        fontSize: 32,
    },
    weatherBottom: {
        gap: 5,
    },
    weatherTemp: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    weatherCondition: {
        fontSize: 14,
        color: '#666',
        letterSpacing: 1,
    },
    weatherDescription: {
        fontSize: 12,
        color: '#888',
        textTransform: 'capitalize',
    },
    cropsContainer: {
        flex: 1,
        paddingTop: 50,
        gap: 30,
    },
    cropCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        paddingHorizontal: 32,
        borderRadius: 25,
        height: 74,
        width: '75%',
    },
    cropCardLeft: {
        alignSelf: 'flex-start',
        marginLeft: -20,
    },
    cropCardRight: {
        alignSelf: 'flex-end',
        marginRight: -20,
    },
    cropName: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 22,
        fontWeight: '300',
        color: 'white',
        lineHeight: 55,
    },

    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    navButton: {
        alignItems: 'center',
    },
    voiceButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navIconImage: {
        width: 24,
        height: 24,
    },
    navButtonRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    navTextRight: {
        fontSize: 16,
        color: '#333',
        fontWeight: '800',
    },
    navArrow: {
        fontSize: 20,
        color: '#333',
    },
    cropImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    cropImage: {
        width: 80,
        height: 80,
        marginLeft: -20,
        marginRight: 20,
        marginTop: -40,
    },
});