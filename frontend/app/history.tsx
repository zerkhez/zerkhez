import { useEffect, useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { THEME_COLOR } from '@/constants/theme';
import Header from '@/components/header';
import Microphone from '@/components/microphone';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
    getHeaderFont,
    getRegularFont,
} from '@/styles/common';
import { AnalysisHistoryEntry } from './notifications';

const CROP_ICONS: Record<string, string> = {
    rice: '🍚',
    wheat: '🌾',
    maize: '🌽',
};

export default function HistoryScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ur';

    const [history, setHistory] = useState<AnalysisHistoryEntry[]>([]);
    const [cropFilter, setCropFilter] = useState<'all' | 'rice' | 'wheat' | 'maize'>('all');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const historyJson = await AsyncStorage.getItem('analysis_history');
            const parsedHistory: AnalysisHistoryEntry[] = historyJson ? JSON.parse(historyJson) : [];
            setHistory(parsedHistory);
        } catch (error) {
            console.log('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    };

    const displayedHistory = useMemo(() => {
        let filtered = history.filter(e => cropFilter === 'all' || e.crop === cropFilter);

        filtered.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [history, cropFilter, sortOrder]);

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

    const deleteEntry = async (id: string) => {
        const updated = history.filter(e => e.id !== id);
        setHistory(updated);
        await AsyncStorage.setItem('analysis_history', JSON.stringify(updated));
    };

    const handleDelete = (id: string, variety: string) => {
        Alert.alert(
            t('common.deleteRecord') || 'Delete Record',
            `${t('common.deleteConfirm') || 'Are you sure you want to delete this record?'} (${variety})`,
            [
                {
                    text: t('common.cancel') || 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: t('common.delete') || 'Delete',
                    onPress: () => deleteEntry(id),
                    style: 'destructive',
                },
            ]
        );
    };

    const cropOptions = [
        { value: 'all', label: t('common.all') || 'All', emoji: '' },
        { value: 'rice', label: t('cropNames.rice') || 'Rice', emoji: '🍚' },
        { value: 'wheat', label: t('cropNames.wheat') || 'Wheat', emoji: '🌾' },
        { value: 'maize', label: t('cropNames.maize') || 'Maize', emoji: '🌽' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header text={t('history.title') || 'Analysis History'} textSize={moderateScale(15)} />

            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* ── Crop Filter Chips ── */}
                    <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.filterSection}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={[styles.chipContainer, isRTL && styles.chipContainerRTL]}
                            scrollEnabled={true}
                        >
                            {cropOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.filterChip,
                                        cropFilter === option.value ? styles.filterChipActive : styles.filterChipInactive,
                                    ]}
                                    onPress={() => setCropFilter(option.value as any)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.filterChipText,
                                            getRegularFont(i18n.language),
                                            cropFilter === option.value ? styles.filterChipTextActive : styles.filterChipTextInactive,
                                        ]}
                                    >
                                        {option.emoji ? `${option.emoji} ` : ''}{option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>

                    {/* ── Sort Toggle ── */}
                    <Animated.View entering={FadeInUp.delay(150).springify()} style={[styles.sortSection, isRTL && styles.sortSectionRTL]}>
                        <TouchableOpacity
                            style={styles.sortButton}
                            onPress={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                            activeOpacity={0.6}
                        >
                            <Ionicons
                                name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'}
                                size={moderateScale(14)}
                                color={THEME_COLOR}
                                style={{ marginRight: horizontalScale(4) }}
                            />
                            <Text style={[styles.sortButtonText, getRegularFont(i18n.language)]}>
                                {sortOrder === 'desc' ? t('history.newest') || 'Newest' : t('history.oldest') || 'Oldest'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* ── History List ── */}
                    {displayedHistory.length > 0 ? (
                        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.historySection}>
                            {displayedHistory.map((entry, index) => (
                                <Animated.View
                                    key={entry.id}
                                    entering={FadeInUp.delay(250 + index * 60).springify()}
                                >
                                    <View style={[styles.historyCard, isRTL && styles.historyCardRTL]}>
                                        <TouchableOpacity
                                            style={styles.historyCardContent}
                                            onPress={() => handleHistoryPress(entry)}
                                            activeOpacity={0.6}
                                        >
                                            <View style={[styles.historyLeft, isRTL && styles.historyLeftRTL]}>
                                                <Text style={styles.historyIcon}>{CROP_ICONS[entry.crop] || '🌱'}</Text>
                                                <View style={styles.historyInfo}>
                                                    <Text
                                                        style={[
                                                            styles.historyVariety,
                                                            getHeaderFont(i18n.language),
                                                            { textAlign: isRTL ? 'right' : 'left' },
                                                        ]}
                                                    >
                                                        {getTranslatedVariety(entry.crop, entry.variety)}
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            styles.historyDate,
                                                            getRegularFont(i18n.language),
                                                            { textAlign: isRTL ? 'right' : 'left' },
                                                        ]}
                                                    >
                                                        {formatDate(entry.date)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.historyRight}>
                                                <Text style={[styles.historyNRate, getHeaderFont(i18n.language)]}>
                                                    {Math.round(entry.n_rate)}
                                                </Text>
                                                <Text style={[styles.historyNRateLabel, getRegularFont(i18n.language)]}>
                                                    {t('notifications.nRate')}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => handleDelete(entry.id, entry.variety)}
                                            activeOpacity={0.5}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Ionicons name="trash-outline" size={moderateScale(20)} color="#cc4444" />
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            ))}
                        </Animated.View>
                    ) : (
                        <Animated.View entering={FadeInUp.delay(250).springify()} style={styles.emptyState}>
                            <Ionicons name="leaf-outline" size={moderateScale(48)} color="#ddd" />
                            <Text style={[styles.emptyText, getRegularFont(i18n.language)]}>
                                {t('history.noRecords') || 'No records found'}
                            </Text>
                        </Animated.View>
                    )}

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

    // ── Filter Section ──
    filterSection: {
        marginBottom: verticalScale(16),
    },
    chipContainer: {
        flexDirection: 'row',
        gap: horizontalScale(8),
        paddingRight: horizontalScale(10),
    },
    chipContainerRTL: {
        flexDirection: 'row-reverse',
        paddingRight: 0,
        paddingLeft: horizontalScale(10),
    },
    filterChip: {
        paddingHorizontal: horizontalScale(14),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(20),
        borderWidth: 1,
    },
    filterChipActive: {
        backgroundColor: THEME_COLOR,
        borderColor: THEME_COLOR,
    },
    filterChipInactive: {
        backgroundColor: '#f0f0f0',
        borderColor: '#e0e0e0',
    },
    filterChipText: {
        fontSize: moderateScale(12),
    },
    filterChipTextActive: {
        color: 'white',
        fontWeight: '600',
    },
    filterChipTextInactive: {
        color: '#555',
    },

    // ── Sort Section ──
    sortSection: {
        alignItems: 'flex-end',
        marginBottom: verticalScale(12),
    },
    sortSectionRTL: {
        alignItems: 'flex-start',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: horizontalScale(12),
        paddingVertical: verticalScale(6),
        backgroundColor: '#f9f9f9',
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    sortButtonText: {
        fontSize: moderateScale(12),
        color: THEME_COLOR,
        fontWeight: '500',
    },

    // ── History List ──
    historySection: {
        gap: verticalScale(10),
    },
    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: moderateScale(14),
        borderWidth: 1,
        borderColor: '#e8e8e8',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(1) },
        shadowOpacity: 0.08,
        shadowRadius: moderateScale(4),
        elevation: 2,
    },
    historyCardRTL: {
        flexDirection: 'row-reverse',
    },
    historyCardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: moderateScale(12),
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
        marginBottom: verticalScale(2),
    },
    historyDate: {
        fontSize: moderateScale(11),
        color: '#888',
    },
    historyRight: {
        alignItems: 'center',
        backgroundColor: '#f6f9f0',
        borderRadius: moderateScale(10),
        paddingHorizontal: horizontalScale(12),
        paddingVertical: verticalScale(6),
    },
    historyNRate: {
        fontSize: moderateScale(16),
        color: THEME_COLOR,
    },
    historyNRateLabel: {
        fontSize: moderateScale(9),
        color: '#888',
        marginTop: verticalScale(1),
    },
    deleteButton: {
        paddingHorizontal: horizontalScale(14),
        paddingVertical: verticalScale(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: horizontalScale(4),
    },

    // ── Empty State ──
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(60),
    },
    emptyText: {
        fontSize: moderateScale(13),
        color: '#999',
        marginTop: verticalScale(12),
        textAlign: 'center',
    },
});
