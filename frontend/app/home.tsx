// Purpose: Display home page, fetch location and weather information if failed on index.ts.
// Author:
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import * as Network from "expo-network";
import { OPEN_WEATHER_API_URL } from "@/constants";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    BackHandler,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
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
    withSpring,
    withTiming,
    ZoomOut,
    ZoomIn,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { THEME_COLOR } from "@/constants/theme";
import {
    commonTexts,
    urduDays,
    urduMonths,
    urduNumbers,
} from "@/constants/commonText";
import {
    commonStyles,
    horizontalScale,
    verticalScale,
    moderateScale,
    getHeaderFont,
    getRegularFont,
} from "@/styles/common";
import {
    bellIcon,
    forwardButtonIcon,
    wheatIcon,
    riceIcon,
    maizeIcon,
} from "@/constants/constants";

export default function HomeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    const insets = useSafeAreaInsets();
    const isRTL = i18n.language === 'ur';

    const [weather, setWeather] = useState({
        temp: params.temp ? (params.temp as string) : "Loading...",
        condition: params.condition
            ? (params.condition as string)
            : "Loading...",
        description: params.description ? (params.description as string) : "",
        location: params.location ? (params.location as string) : "Loading...",
    });

    // Exit app on hardware back press — only when this screen is focused
    // Using useFocusEffect ensures the handler is removed when the user
    // navigates away, preventing it from closing the app on other screens
    useFocusEffect(
        useCallback(() => {
            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                () => {
                    BackHandler.exitApp();
                    return true; // prevents default back navigation
                },
            );
            return () => subscription.remove();
        }, []),
    );

    const getCurrentUrduDate = () => {
        const now = new Date();

        // Convert English number to Urdu
        const toUrduNumber = (num: number) => {
            return num
                .toString()
                .split("")
                .map((digit) => urduNumbers[parseInt(digit)])
                .join("");
        };

        const day = now.getDate();
        const month = urduMonths[now.getMonth()];
        const year = now.getFullYear();
        const dayName = urduDays[now.getDay()];

        return `${month} ${day}، ${dayName}، ${year}`;
    };

    const getCurrentEnglishDate = () => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return now.toLocaleDateString("en-US", options);
    };

    const getCurrentDate = () => {
        return i18n.language === "ur"
            ? getCurrentUrduDate()
            : getCurrentEnglishDate();
    };

    const [currentDate, setCurrentDate] = useState(getCurrentDate());

    // Update date when language changes
    useEffect(() => {
        setCurrentDate(getCurrentDate());

        // Trigger language toggle animation
        languageButtonRotation.value = withSequence(
            withTiming(180, { duration: 300 }),
            withTiming(0, { duration: 300 })
        );

        // Trigger header text scale animation
        headerTextScale.value = withSequence(
            withTiming(0.95, { duration: 150 }),
            withTiming(1, { duration: 150 })
        );
    }, [i18n.language]);

    useEffect(() => {
        // If weather data was passed via params, we don't need to fetch again immediately
        if (params.temp && params.location) {
            setWeather({
                temp: params.temp as string,
                condition: params.condition as string,
                description: params.description
                    ? (params.description as string)
                    : "",
                location: params.location as string,
            });
            return;
        }
        // fetch the user location
        (async () => {
            const networkState = await Network.getNetworkStateAsync();
            if (!networkState.isConnected) {
                setWeather((prev) => ({
                    ...prev,
                    location: "No Internet",
                    temp: "--",
                    condition: "Unknown",
                }));
                return;
            }

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setWeather((prev) => ({
                    ...prev,
                    location: "Permission Denied",
                }));
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            fetchWeather(location.coords.latitude, location.coords.longitude);
        })();
    }, [params.temp, params.condition, params.location]);

    const fetchWeather = async (lat: number, lon: number) => {
        try {
            // fetch the weather information to show on home page
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPEN_WEATHER_API_URL}`,
            );
            const data = await response.json();
            if (response.ok) {
                setWeather({
                    temp: Math.round(data.main.temp).toString(),
                    condition: data.weather[0].main,
                    description: data.weather[0].description,
                    location: data.name,
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
            case "clear":
                return "☀️";
            case "clouds":
                return "⛅";
            case "rain":
            case "drizzle":
                return "🌧️";
            case "thunderstorm":
                return "⛈️";
            case "snow":
                return "❄️";
            case "mist":
            case "smoke":
            case "haze":
            case "dust":
            case "fog":
            case "sand":
            case "ash":
            case "squall":
            case "tornado":
                return "☁️";
            default:
                return "⛅";
        }
    };

    // ── Blob entrance animation (like language-select) ──
    const BLOB_HEIGHT = verticalScale(240);
    const blobY = useSharedValue(-BLOB_HEIGHT);

    // Animation values
    const bellRotation = useSharedValue(0);
    const weatherIconScale = useSharedValue(1);
    const languageButtonRotation = useSharedValue(0);
    const headerTextScale = useSharedValue(1);

    const crops = [
        {
            id: "wheat",
            name: "گندم",
            nameEng: "Wheat",
            icon: wheatIcon,
            color: THEME_COLOR,
            image: require("../assets/images/wheat.png"),
        },
        {
            id: "rice",
            name: "چاول",
            nameEng: "Rice",
            icon: riceIcon,
            color: THEME_COLOR,
            image: require("../assets/images/rice.png"),
        },
        {
            id: "maize",
            name: "مکئی",
            nameEng: "Maize",
            icon: maizeIcon,
            color: THEME_COLOR,
            image: require("../assets/images/corn.png"),
        },
    ];

    useEffect(() => {
        // Blob drops in like language-select
        blobY.value = withSpring(0, {
            damping: 18,
            stiffness: 120,
        });

        // Bell notification animation - subtle shake
        bellRotation.value = withRepeat(
            withSequence(
                withTiming(10, { duration: 100 }),
                withTiming(-10, { duration: 100 }),
                withTiming(10, { duration: 100 }),
                withTiming(0, { duration: 100 }),
                withTiming(0, { duration: 3000 }), // Pause between shakes
            ),
            -1, // Infinite repeat
            false,
        );

        // Weather icon pulse animation
        weatherIconScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1500 }),
                withTiming(1, { duration: 1500 }),
            ),
            -1,
            true,
        );
    }, []);

    const blobAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: blobY.value }],
    }));

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

    const languageButtonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${languageButtonRotation.value}deg` }],
        };
    });

    const headerTextAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: headerTextScale.value }],
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
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Curved Header — animated blob like language-select */}
                <View style={styles.headerContainer}>
                <Animated.View style={[styles.blobWrapper, blobAnimatedStyle]}>
                    <View style={styles.blob} />
                </Animated.View>

                {/* Header Content */}
                <View
                    style={[
                        styles.headerContent,
                        { paddingTop: insets.top + verticalScale(10) },
                    ]}
                >
                    {/* Left Side - Bell Icon and Language Toggle */}
                    <View style={styles.headerLeft}>
                        <Animated.View
                            entering={FadeInLeft.delay(300).springify()}
                        >
                            <TouchableOpacity style={styles.bellIcon} onPress={() => router.push('/notifications')}>
                                <Animated.Text
                                    style={[styles.bellText, bellAnimatedStyle]}
                                >
                                    {bellIcon}
                                </Animated.Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Language Toggle Button */}
                        <Animated.View
                            entering={FadeInLeft.delay(400).springify()}
                            style={languageButtonAnimatedStyle}
                        >
                            <TouchableOpacity
                                style={styles.languageToggle}
                                onPress={() => {
                                    const newLang =
                                        i18n.language === "ur" ? "en" : "ur";
                                    i18n.changeLanguage(newLang);
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.languageText}>
                                    {i18n.language === "en"
                                        ? "اردو"
                                        : "English"}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {/* Title and Date - Top Right - Animated */}
                    <Animated.View
                        entering={FadeInRight.delay(300).springify()}
                        style={[styles.headerTextContainer, headerTextAnimatedStyle]}
                    >
                        <Text
                            style={[
                                styles.headerTitle,
                                getHeaderFont(i18n.language),
                                { textAlign: isRTL ? 'right' : 'left' },
                            ]}
                        >
                            {t("common.welcomeFarmer")}
                        </Text>
                        <Text
                            style={[
                                styles.headerDate,
                                getRegularFont(i18n.language),
                                { textAlign: isRTL ? 'right' : 'left' },
                            ]}
                        >
                            {currentDate}
                        </Text>
                    </Animated.View>
                </View>
            </View>

            {/* Weather Card - Slide in from bottom */}
            <Animated.View
                entering={SlideInDown.delay(500).springify()}
                style={styles.weatherCard}
            >
                <View style={styles.weatherTop}>
                    <Text style={styles.weatherLocation}>
                        {weather.location}
                    </Text>
                    <View style={{ alignItems: "center" }}>
                        <Animated.View
                            style={[
                                styles.weatherIcon,
                                weatherIconAnimatedStyle,
                            ]}
                        >
                            <Text style={styles.weatherIconText}>
                                {getWeatherIcon(weather.condition)}
                            </Text>
                        </Animated.View>
                        {weather.description ? (
                            <Text style={styles.weatherDescription}>
                                {weather.description}
                            </Text>
                        ) : null}
                    </View>
                </View>
                <View style={styles.weatherBottom}>
                    <Text style={styles.weatherTemp}>{displayTemp}°</Text>
                    <Text style={styles.weatherCondition}>
                        {weather.condition.toUpperCase()}
                    </Text>
                </View>
            </Animated.View>

            {/* Crop Options - Staggered entrance */}
            <View style={styles.cropsContainer}>
                {crops.map((crop, index) => (
                    <Animated.View
                        key={crop.id}
                        entering={
                            index % 2 === 0
                                ? SlideInRight.delay(
                                    700 + index * 150,
                                ).springify()
                                : SlideInLeft.delay(
                                    700 + index * 150,
                                ).springify()
                        }
                    >
                        <TouchableOpacity
                            style={[
                                styles.cropCard,
                                { backgroundColor: crop.color },
                                index % 2 === 0
                                    ? styles.cropCardRight
                                    : styles.cropCardLeft,
                            ]}
                            onPress={() => {
                                router.push({
                                    pathname: "/selection",
                                    params: { id: crop.id, name: crop.name },
                                });
                            }}
                            activeOpacity={0.7}
                        >
                            {/* Text on inside edge, image placeholder on outside edge */}
                            {index % 2 === 0 ? (
                                <>
                                    <Text
                                        style={[
                                            styles.cropName,
                                            getHeaderFont(i18n.language),
                                        ]}
                                    >
                                        {i18n.language === "ur"
                                            ? crop.name
                                            : crop.nameEng}
                                    </Text>
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
                                    <Text
                                        style={[
                                            styles.cropName,
                                            getHeaderFont(i18n.language),
                                        ]}
                                    >
                                        {i18n.language === "ur"
                                            ? crop.name
                                            : crop.nameEng}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
            </ScrollView>

            {/* Bottom Navigation - Fade in */}
            <Animated.View
                entering={FadeInUp.delay(1200).springify()}
                style={[styles.bottomNav, { paddingBottom: insets.bottom + verticalScale(15) }]}
            >
                {/* Chat bot button */}
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => router.push('/chat')}
                    activeOpacity={0.75}
                >
                    <View style={styles.voiceButton}>
                        <Image
                            source={require("../assets/icons/chatbot.png")}
                            style={[styles.navIconImage, { tintColor: THEME_COLOR }]}
                        />
                    </View>
                </TouchableOpacity>

                {/* Spacer to keep layout balanced */}
                <View style={styles.fab} />

                <TouchableOpacity
                    style={styles.navButtonRight}
                    onPress={() => router.push("/instructions")}
                >
                    <Text
                        style={[
                            styles.navTextRight,
                            getHeaderFont(i18n.language),
                        ]}
                    >
                        {t("common.instructions")}
                    </Text>
                    <Text style={styles.navArrow}>{forwardButtonIcon}</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: verticalScale(200),
        position: "relative",
    },
    blobWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: verticalScale(240),
    },
    blob: {
        width: Dimensions.get("window").width * 1.35,
        height: Dimensions.get("window").width * 1.15,
        borderRadius: (Dimensions.get("window").width * 1.15) / 2,
        backgroundColor: THEME_COLOR,
        alignSelf: "center",
        marginTop: -(Dimensions.get("window").width * 1.15 - verticalScale(240)),
    },
    headerContent: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: horizontalScale(20),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: horizontalScale(10),
    },
    bellIcon: {
        padding: moderateScale(5),
    },
    bellText: {
        fontSize: moderateScale(20),
        color: "white",
    },
    languageToggle: {
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        paddingHorizontal: horizontalScale(12),
        paddingVertical: verticalScale(6),
        borderRadius: moderateScale(15),
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.4)",
    },
    languageText: {
        fontSize: moderateScale(12),
        fontWeight: "700",
        color: "white",
        letterSpacing: 0.5,
    },
    headerTextContainer: {
        alignItems: "flex-end",
    },
    weatherText: {
        fontFamily: "NotoSansArabic-Bold",
        fontSize: moderateScale(16),
        color: "white",
        textAlign: "right",
    },
    headerTitle: {
        fontSize: moderateScale(20),
        color: "white",
    },
    headerDate: {
        fontSize: moderateScale(14),
        color: "rgba(255,255,255,0.9)",
        marginTop: 3,
    },
    weatherCard: {
        backgroundColor: "white",
        marginHorizontal: horizontalScale(30),
        marginTop: -verticalScale(60),
        padding: moderateScale(20),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    weatherTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: verticalScale(10),
    },
    weatherLocation: {
        fontSize: moderateScale(16),
        fontWeight: "600",
        flex: 1,
        marginRight: horizontalScale(10),
    },
    weatherIcon: {
        justifyContent: "center",
        alignItems: "center",
    },
    weatherIconText: {
        fontSize: moderateScale(32),
    },
    weatherBottom: {
        gap: verticalScale(5),
    },
    weatherTemp: {
        fontSize: moderateScale(48),
        fontWeight: "bold",
    },
    weatherCondition: {
        fontSize: moderateScale(14),
        color: "#666",
        letterSpacing: 1,
    },
    weatherDescription: {
        fontSize: moderateScale(12),
        color: "#888",
        textTransform: "capitalize",
    },
    cropsContainer: {
        paddingTop: verticalScale(50),
        gap: verticalScale(30),
        paddingBottom: verticalScale(20),
    },
    cropCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: moderateScale(10),
        paddingHorizontal: horizontalScale(32),
        borderRadius: moderateScale(25),
        height: verticalScale(74),
        width: "75%",
    },
    cropCardLeft: {
        alignSelf: "flex-start",
        marginLeft: -horizontalScale(20),
    },
    cropCardRight: {
        alignSelf: "flex-end",
        marginRight: -horizontalScale(20),
    },
    cropName: {
        fontSize: moderateScale(22),
        fontWeight: "300",
        color: "white",
        lineHeight: verticalScale(55),
    },

    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: verticalScale(15),
        paddingHorizontal: horizontalScale(20),
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    navButton: {
        alignItems: "center",
    },
    voiceButton: {
        width: horizontalScale(50),
        height: horizontalScale(50),
        borderRadius: horizontalScale(25),
        justifyContent: "center",
        alignItems: "center",
    },
    navIconImage: {
        width: horizontalScale(28),
        height: horizontalScale(28),
    },
    navButtonRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: horizontalScale(5),
    },
    navTextRight: {
        fontSize: moderateScale(16),
        color: "#333",
        fontWeight: "800",
    },
    navArrow: {
        fontSize: moderateScale(20),
        color: "#333",
    },
    cropImagePlaceholder: {
        width: horizontalScale(70),
        height: horizontalScale(70),
        borderRadius: moderateScale(10),
    },
    cropImage: {
        width: horizontalScale(92),
        height: horizontalScale(92),
        marginLeft: -horizontalScale(15),
        marginRight: horizontalScale(20),
        marginTop: -verticalScale(40),
    },
    fab: {
        width: moderateScale(48),
        height: moderateScale(48),
    },
});
