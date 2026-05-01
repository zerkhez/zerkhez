// Purpose: Notifications screen showing farming tips, analysis history, and announcements.
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_API_URL } from '@/constants';
import { THEME_COLOR } from '@/constants/theme';
import { FARMING_TIPS, getCurrentSeason, getDailyTips, FarmingTip } from '@/constants/farmingTips';
import Header from '@/components/header';
import Microphone from '@/components/microphone';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
    getHeaderFont,
    getRegularFont,
} from '@/styles/common';

export interface AnalysisHistoryEntry {
    id: string;
    crop: string;
    variety: string;
    date: string;
    n_rate: number;
    urea: number;
    can: number;
    ammonium_sulfate: number;
}

interface Announcement {
    id: string;
    type?: 'general' | 'weather';
    severity?: 'low' | 'medium' | 'high';
    title_en: string;
    title_ur: string;
    body_en: string;
    body_ur: string;
    date: string;
}

const CROP_ICONS: Record<string, string> = {
    rice: '🍚',
    wheat: '🌾',
    maize: '🌽',
};

export default function NotificationsScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const [tips, setTips] = useState<FarmingTip[]>([]);
    const [history, setHistory] = useState<AnalysisHistoryEntry[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load history
            const historyJson = await AsyncStorage.getItem('analysis_history');
            const parsedHistory: AnalysisHistoryEntry[] = historyJson ? JSON.parse(historyJson) : [];
            setHistory(parsedHistory);

            // Select tips based on history or season
            const analyzedCrops = [...new Set(parsedHistory.map(h => h.crop))];
            let filteredTips: FarmingTip[];

            if (analyzedCrops.length > 0) {
                filteredTips = FARMING_TIPS.filter(tip => analyzedCrops.includes(tip.crop));
            } else {
                const season = getCurrentSeason();
                filteredTips = FARMING_TIPS.filter(tip => tip.season === season);
            }
            setTips(getDailyTips(filteredTips, 3));

            // Load announcements
            await loadAnnouncements();
        } catch (error) {
            console.log('Error loading notification data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAnnouncements = async () => {
        try {
            const networkState = await Network.getNetworkStateAsync();
            if (networkState.isConnected) {
                // Get stored location to pass to endpoint
                const locJson = await AsyncStorage.getItem('last_location');
                const location = locJson ? JSON.parse(locJson) : null;

                let url = `${BACKEND_API_URL}/api/announcements`;
                if (location) {
                    url += `?lat=${location.lat}&lon=${location.lon}`;
                }

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncements(data);
                    await AsyncStorage.setItem('announcements_cache', JSON.stringify(data));
                    return;
                }
            }
        } catch {
            // Fall through to cached
        }

        // Fallback to cache
        try {
            const cached = await AsyncStorage.getItem('announcements_cache');
            if (cached) {
                setAnnouncements(JSON.parse(cached));
            }
        } catch {
            // No cache available
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (i18n.language === 'ur') {
            return date.toLocaleDateString('ur-PK', { year: 'numeric', month: 'short', day: 'numeric' });
        }
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getTranslatedVariety = (crop: string, varietyName: string) => {
        if (i18n.language === 'en') {
            return varietyName;
        }

        // Get English and Urdu crop types directly from resource bundles
        const enBundle = i18n.getResourceBundle('en', 'translation');
        const urBundle = i18n.getResourceBundle('ur', 'translation');

        const englishCropTypes = (enBundle?.cropTypes?.[crop as keyof typeof enBundle.cropTypes] as string[]) || [];
        const urduCropTypes = (urBundle?.cropTypes?.[crop as keyof typeof urBundle.cropTypes] as string[]) || [];

        const varietyIndex = englishCropTypes.indexOf(varietyName);

        if (varietyIndex !== -1 && urduCropTypes[varietyIndex]) {
            return urduCropTypes[varietyIndex];
        }

        return varietyName;
    };

    const handleHistoryPress = (entry: AnalysisHistoryEntry) => {
        router.push({
            pathname: '/analysis-results',
            params: {
                urea: entry.urea,
                can: entry.can,
                ammonium_sulfate: entry.ammonium_sulfate,
                n_rate: Math.round(entry.n_rate),
            },
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header text={t('notifications.title')} textSize={moderateScale(15)} />

            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* ── Tips & Reminders ── */}
                    <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.section}>
                        <View style={[styles.sectionHeader, i18n.language === 'ur' && styles.sectionHeaderRTL]}>
                            <Ionicons name="bulb-outline" size={moderateScale(20)} color={THEME_COLOR} />
                            <Text style={[styles.sectionTitle, getHeaderFont(i18n.language), i18n.language === 'ur' && { textAlign: 'right' }]}>{t('notifications.tipsTitle')}</Text>
                        </View>

                        {tips.length > 0 ? (
                            tips.map((tip, index) => (
                                <Animated.View key={tip.id} entering={FadeInUp.delay(150 + index * 80).springify()} style={[styles.tipCard, i18n.language === 'ur' && styles.tipCardRTL]}>
                                    <Text style={styles.tipCropIcon}>{CROP_ICONS[tip.crop] || '🌱'}</Text>
                                    <Text style={[styles.tipText, getRegularFont(i18n.language), { textAlign: i18n.language === 'ur' ? 'right' : 'left' }]}>
                                        {i18n.language === 'ur' ? tip.ur : tip.en}
                                    </Text>
                                </Animated.View>
                            ))
                        ) : (
                            <Text style={[styles.emptyText, getRegularFont(i18n.language)]}>{t('notifications.noTips')}</Text>
                        )}
                    </Animated.View>

                    {/* ── Analysis History ── */}
                    <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.section}>
                        <View style={[styles.sectionHeader, i18n.language === 'ur' && styles.sectionHeaderRTL]}>
                            <Ionicons name="time-outline" size={moderateScale(20)} color={THEME_COLOR} />
                            <Text style={[styles.sectionTitle, getHeaderFont(i18n.language), i18n.language === 'ur' && { textAlign: 'right' }]}>{t('notifications.historyTitle')}</Text>
                        </View>

                        {history.length > 0 ? (
                            <>
                                {history.slice(0, 3).map((entry, index) => (
                                    <Animated.View key={entry.id} entering={FadeInUp.delay(350 + index * 80).springify()}>
                                        <TouchableOpacity style={[styles.historyCard, i18n.language === 'ur' && styles.historyCardRTL]} onPress={() => handleHistoryPress(entry)} activeOpacity={0.7}>
                                            <View style={[styles.historyLeft, i18n.language === 'ur' && styles.historyLeftRTL]}>
                                                <Text style={styles.historyIcon}>{CROP_ICONS[entry.crop] || '🌱'}</Text>
                                                <View style={styles.historyInfo}>
                                                    <Text style={[styles.historyVariety, getHeaderFont(i18n.language), { textAlign: i18n.language === 'ur' ? 'right' : 'left' }]}>{getTranslatedVariety(entry.crop, entry.variety)}</Text>
                                                    <Text style={[styles.historyDate, getRegularFont(i18n.language), { textAlign: i18n.language === 'ur' ? 'right' : 'left' }]}>{formatDate(entry.date)}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.historyRight}>
                                                <Text style={[styles.historyNRate, getHeaderFont(i18n.language)]}>{Math.round(entry.n_rate)}</Text>
                                                <Text style={[styles.historyNRateLabel, getRegularFont(i18n.language)]}>{t('notifications.nRate')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Animated.View>
                                ))}
                                {history.length > 3 && (
                                    <Animated.View entering={FadeInUp.delay(590).springify()}>
                                        <TouchableOpacity
                                            style={[styles.viewAllButton, i18n.language === 'ur' && styles.viewAllButtonRTL]}
                                            onPress={() => router.push('/history')}
                                            activeOpacity={0.6}
                                        >
                                            <Text style={[styles.viewAllText, getHeaderFont(i18n.language)]}>
                                                {t('common.viewAll')} ({history.length})
                                            </Text>
                                            <Ionicons name="arrow-forward" size={moderateScale(16)} color={THEME_COLOR} />
                                        </TouchableOpacity>
                                    </Animated.View>
                                )}
                            </>
                        ) : (
                            <Text style={[styles.emptyText, getRegularFont(i18n.language)]}>{t('notifications.noHistory')}</Text>
                        )}
                    </Animated.View>

                    {/* ── Announcements & Weather Alerts ── */}
                    <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.section}>
                        <View style={[styles.sectionHeader, i18n.language === 'ur' && styles.sectionHeaderRTL]}>
                            <Ionicons name="megaphone-outline" size={moderateScale(20)} color={THEME_COLOR} />
                            <Text style={[styles.sectionTitle, getHeaderFont(i18n.language), i18n.language === 'ur' && { textAlign: 'right' }]}>{t('notifications.announcementsTitle')}</Text>
                        </View>

                        {announcements.length > 0 ? (
                            announcements.map((item, index) => {
                                const isWeather = item.type === 'weather';
                                const severityColor = item.severity === 'high' ? '#e87c3e' : '#e8a83e';

                                return (
                                    <Animated.View key={item.id} entering={FadeInUp.delay(550 + index * 80).springify()}>
                                        <View style={[
                                            isWeather ? styles.weatherAnnouncementCard : styles.announcementCard,
                                            isWeather && item.severity && { borderLeftColor: severityColor, borderRightColor: severityColor }
                                        ]}>
                                            {isWeather && (
                                                <View style={[styles.announcementHeader, i18n.language === 'ur' && styles.announcementHeaderRTL]}>
                                                    <Ionicons
                                                        name={item.severity === 'high' ? 'warning-outline' : 'alert-circle-outline'}
                                                        size={moderateScale(18)}
                                                        color={severityColor}
                                                    />
                                                    <Text style={[styles.announcementTitle, getHeaderFont(i18n.language), { textAlign: i18n.language === 'ur' ? 'right' : 'left' }]}>
                                                        {i18n.language === 'ur' ? item.title_ur : item.title_en}
                                                    </Text>
                                                </View>
                                            )}
                                            {!isWeather && (
                                                <Text style={[styles.announcementTitle, getHeaderFont(i18n.language), { textAlign: i18n.language === 'ur' ? 'right' : 'left' }]}>
                                                    {i18n.language === 'ur' ? item.title_ur : item.title_en}
                                                </Text>
                                            )}
                                            <Text style={[styles.announcementBody, getRegularFont(i18n.language), { textAlign: i18n.language === 'ur' ? 'right' : 'left' }]}>
                                                {i18n.language === 'ur' ? item.body_ur : item.body_en}
                                            </Text>
                                            <Text style={[styles.announcementDate, getRegularFont(i18n.language), { textAlign: i18n.language === 'ur' ? 'right' : 'left' }]}>{formatDate(item.date)}</Text>
                                        </View>
                                    </Animated.View>
                                );
                            })
                        ) : (
                            <Text style={[styles.emptyText, getRegularFont(i18n.language)]}>{t('notifications.noAnnouncements')}</Text>
                        )}
                    </Animated.View>

                    <View style={{ height: verticalScale(100) }} />
                </ScrollView>

                <Microphone />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME_COLOR,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        overflow: 'hidden',
    },
    scrollContent: {
        padding: horizontalScale(20),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(120),
    },
    section: {
        marginBottom: verticalScale(24),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: horizontalScale(8),
        marginBottom: verticalScale(12),
    },
    sectionHeaderRTL: {
        flexDirection: 'row-reverse',
    },
    sectionTitle: {
        fontSize: moderateScale(17),
        color: '#2a3510',
    },

    // ── Tips ──
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f6f9f0',
        borderRadius: moderateScale(14),
        padding: moderateScale(14),
        marginBottom: verticalScale(10),
        borderLeftWidth: 3,
        borderLeftColor: '#8BAA3D',
        gap: horizontalScale(10),
    },
    tipCardRTL: {
        flexDirection: 'row-reverse',
        borderLeftWidth: 0,
        borderRightWidth: 3,
        borderRightColor: '#8BAA3D',
    },
    tipCropIcon: {
        fontSize: moderateScale(22),
        marginTop: verticalScale(2),
    },
    tipText: {
        flex: 1,
        fontSize: moderateScale(13),
        color: '#444',
        lineHeight: moderateScale(22),
    },

    // ── History ──
    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: moderateScale(14),
        padding: moderateScale(14),
        marginBottom: verticalScale(10),
        borderWidth: 1,
        borderColor: '#e8e8e8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(1) },
        shadowOpacity: 0.08,
        shadowRadius: moderateScale(4),
        elevation: 2,
    },
    historyCardRTL: {
        flexDirection: 'row-reverse',
    },
    historyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: horizontalScale(10),
        flex: 1,
    },
    historyLeftRTL: {
        flexDirection: 'row-reverse',
    },
    historyIcon: {
        fontSize: moderateScale(28),
    },
    historyInfo: {
        flex: 1,
    },
    historyVariety: {
        fontSize: moderateScale(14),
        color: '#2a3510',
    },
    historyDate: {
        fontSize: moderateScale(11),
        color: '#888',
        marginTop: verticalScale(2),
    },
    historyRight: {
        alignItems: 'center',
        backgroundColor: '#f6f9f0',
        borderRadius: moderateScale(10),
        paddingHorizontal: horizontalScale(12),
        paddingVertical: verticalScale(6),
    },
    historyNRate: {
        fontSize: moderateScale(18),
        color: THEME_COLOR,
    },
    historyNRateLabel: {
        fontSize: moderateScale(9),
        color: '#888',
    },

    // ── Announcements ──
    announcementCard: {
        backgroundColor: '#fff9e6',
        borderRadius: moderateScale(14),
        padding: moderateScale(14),
        marginBottom: verticalScale(10),
        borderLeftWidth: 3,
        borderLeftColor: '#e0c040',
    },
    weatherAnnouncementCard: {
        backgroundColor: '#fff5ee',
        borderRadius: moderateScale(14),
        padding: moderateScale(14),
        marginBottom: verticalScale(10),
        borderLeftWidth: 3,
        borderLeftColor: '#e87c3e',
    },
    announcementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: horizontalScale(8),
        marginBottom: verticalScale(8),
    },
    announcementHeaderRTL: {
        flexDirection: 'row-reverse',
    },
    announcementTitle: {
        fontSize: moderateScale(14),
        color: '#2a3510',
        marginBottom: verticalScale(4),
    },
    announcementBody: {
        fontSize: moderateScale(12),
        color: '#555',
        lineHeight: moderateScale(20),
        marginBottom: verticalScale(6),
    },
    announcementDate: {
        fontSize: moderateScale(10),
        color: '#999',
    },

    // ── View All Button ──
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: verticalScale(12),
        paddingHorizontal: horizontalScale(10),
        gap: horizontalScale(6),
        marginTop: verticalScale(8),
    },
    viewAllButtonRTL: {
        justifyContent: 'flex-start',
    },
    viewAllText: {
        fontSize: moderateScale(13),
        color: THEME_COLOR,
    },

    // ── Empty state ──
    emptyText: {
        fontSize: moderateScale(13),
        color: '#999',
        textAlign: 'center',
        paddingVertical: verticalScale(16),
    },
});
