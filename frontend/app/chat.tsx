// Purpose: Kisan Dost premium chatbot screen
import { useRouter } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExpoWebSpeechRecognition } from 'expo-speech-recognition';
import { THEME_COLOR } from '@/constants/theme';
import { BACKEND_API_URL } from '@/constants';
import {
    horizontalScale,
    moderateScale,
    verticalScale,
    getHeaderFont,
    getRegularFont,
} from '@/styles/common';

// ─── Types ────────────────────────────────────────────────────────────────────
type MessageType = 'bot' | 'user';

interface CropTile {
    id: string;
    label: string;
    emoji: string;
}

interface MessageAction {
    label: string;
    type: 'navigation' | 'action';
    target?: string;
}

interface Message {
    id: string;
    type: MessageType;
    text: string;
    cropTiles?: CropTile[];
    isTyping?: boolean;
    action?: MessageAction;
}

interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CREAM          = '#F5F2EB';
const CREAM_DARK     = '#EDE9E0';
const BUBBLE_BOT     = '#FFFFFF';
const BUBBLE_USER    = THEME_COLOR;
const GREEN_BORDER   = '#C8DFA0';
const DARK_GREEN     = '#3D5010';
const TEXT_DARK      = '#2A2A2A';

const GRAD_START = '#3D5010';
const GRAD_END   = '#5A7320';

const QUICK_REPLIES_CONFIG = [
    { icon: '☁️', translationKey: 'chat.weather' },
    { icon: '🌱', translationKey: 'chat.wheatPlanting' },
    { icon: '🌽', translationKey: 'chat.maizeDisease' },
    { icon: '💰', translationKey: 'chat.prices' },
];

const CROP_TILES_CONFIG = [
    { id: 'wheat', translationKey: 'chat.wheat', emoji: '🌾' },
    { id: 'rice',  translationKey: 'chat.rice', emoji: '🍚' },
    { id: 'maize', translationKey: 'chat.maize', emoji: '🌽' },
];

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev === '.') return '..';
                if (prev === '..') return '...';
                return '.';
            });
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return <Text style={{ fontSize: moderateScale(16) }}>{dots}</Text>;
}

// ─── Markdown Parser ──────────────────────────────────────────────────────────
function parseMarkdownText(text: string) {
    const parts: (string | { type: string; content: string })[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        parts.push({ type: 'bold', content: match[1] });
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length === 0 ? [text] : parts;
}

function MarkdownText({ text, style }: { text: string; style: any }) {
    const parts = parseMarkdownText(text);

    return (
        <Text style={style}>
            {parts.map((part, index) => {
                if (typeof part === 'string') {
                    return <Text key={index}>{part}</Text>;
                }
                if (part.type === 'bold') {
                    return (
                        <Text key={index} style={{ fontWeight: 'bold' }}>
                            {part.content}
                        </Text>
                    );
                }
                return null;
            })}
        </Text>
    );
}

// ─── Bot Avatar ───────────────────────────────────────────────────────────────
function BotAvatar({ size = 32, glow = false }: { size?: number; glow?: boolean }) {
    return (
        <View style={[
            styles.botAvatarOuter,
            {
                width: size + (glow ? 8 : 0),
                height: size + (glow ? 8 : 0),
                borderRadius: (size + (glow ? 8 : 0)) / 2,
            },
            glow && styles.botAvatarGlow,
        ]}>
            <View style={[styles.botAvatarCircle, { width: size, height: size, borderRadius: size / 2 }]}>
                <Text style={{ fontSize: size * 0.55 }}>🤖</Text>
            </View>
        </View>
    );
}

// ─── Crop Product Tile ────────────────────────────────────────────────────────
function CropProductTile({ crop, onPress, language = 'ur' }: { crop: CropTile; onPress: () => void; language?: string }) {
    return (
        <TouchableOpacity style={styles.cropTile} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.cropTileEmoji}>{crop.emoji}</Text>
            <Text style={[styles.cropTileLabel, getRegularFont(language)]}>{crop.label}</Text>
            <Text style={styles.cropTileChevron}>›</Text>
        </TouchableOpacity>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t, i18n } = useTranslation();

    const cropTiles: CropTile[] = CROP_TILES_CONFIG.map(tile => ({
        id: tile.id,
        label: t(tile.translationKey),
        emoji: tile.emoji,
    }));

    const initialMessages: Message[] = [
        {
            id: '1',
            type: 'bot',
            text: t('chat.welcome'),
            cropTiles,
        },
    ];

    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
    const flatListRef = useRef<FlatList>(null);
    const recognitionRef = useRef<ExpoWebSpeechRecognition | null>(null);

    useEffect(() => {
        recognitionRef.current = new ExpoWebSpeechRecognition();
    }, []);

    const handleMicPress = () => {
        if (!recognitionRef.current) {
            Alert.alert(t('common.error'), t('chat.speechError'));
            return;
        }

        if (isListening) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                console.error('Error stopping recognition:', e);
                setIsListening(false);
            }
            return;
        }

        try {
            const recognition = recognitionRef.current;
            // Note: Urdu might not be fully supported on web browsers
            // Fallback to English for web if Urdu isn't available
            const locale = i18n.language === 'ur' ? 'ur-PK' : 'en-US';

            // On web, if Urdu is selected, try it but be prepared to fallback
            console.log('Selected language:', i18n.language, 'Locale:', locale);

            // Reset recognition object to clear previous state
            recognition.lang = locale;
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            let hasResult = false;

            recognition.onstart = () => {
                console.log('Speech recognition started');
                setIsListening(true);
            };

            recognition.onresult = (event: any) => {
                console.log('Speech result event:', event);
                if (event.results && event.results.length > 0) {
                    const result = event.results[event.results.length - 1];
                    if (result && result[0]) {
                        const transcript = result[0].transcript;
                        console.log('Transcript:', transcript);
                        if (transcript.trim()) {
                            hasResult = true;
                            setInputText(transcript);
                            setTimeout(() => sendMessage(transcript), 300);
                        }
                    }
                }
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                const errorCode = event.error || 'unknown';

                // Silent errors
                if (errorCode === 'no-match' || errorCode === 'network') {
                    console.log('Expected speech error:', errorCode);
                    return;
                }

                if (errorCode === 'permission-denied') {
                    Alert.alert(t('common.error'), t('chat.micPermissionDenied'));
                } else if (errorCode === 'not-allowed') {
                    Alert.alert(t('common.error'), 'Microphone access required. Please enable in browser settings.');
                } else {
                    console.warn('Speech recognition error:', errorCode);
                }
            };

            recognition.onend = () => {
                console.log('Speech recognition ended, hasResult:', hasResult);
                setIsListening(false);

                if (!hasResult) {
                    console.log('No speech detected');
                }
            };

            console.log('Starting speech recognition with locale:', locale);
            recognition.start();
        } catch (error) {
            console.error('Error in handleMicPress:', error);
            setIsListening(false);
            Alert.alert(t('common.error'), t('chat.speechError'));
        }
    };

    const sendMessage = async (text: string) => {
        if (!text.trim() || isTyping) return;

        const trimmedText = text.trim();
        const userMsg: Message = { id: Date.now().toString(), type: 'user', text: trimmedText };
        const typingMsg: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            text: '...',
            isTyping: true,
        };

        setMessages(prev => [...prev, userMsg, typingMsg]);
        setInputText('');
        setIsTyping(true);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);

        try {
            const response = await fetch(`${BACKEND_API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: trimmedText,
                    history: conversationHistory,
                    language: i18n.language,
                }),
            });

            const data = await response.json();

            if (response.ok && data.response) {
                const botReply: Message = {
                    id: (Date.now() + 100).toString(),
                    type: 'bot',
                    text: data.response,
                    action: data.action,
                };

                setMessages(prev => prev.filter(m => !m.isTyping).concat(botReply));
                setConversationHistory(prev => [
                    ...prev,
                    { role: 'user', content: trimmedText },
                    { role: 'assistant', content: data.response },
                ]);
            } else {
                const errorMsg: Message = {
                    id: (Date.now() + 100).toString(),
                    type: 'bot',
                    text: t('chat.errorResponse'),
                };
                setMessages(prev => prev.filter(m => !m.isTyping).concat(errorMsg));
            }
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 100).toString(),
                type: 'bot',
                text: t('chat.connectionError'),
            };
            setMessages(prev => prev.filter(m => !m.isTyping).concat(errorMsg));
        } finally {
            setIsTyping(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isBot = item.type === 'bot';
        const isRTL = i18n.language === 'ur';
        return (
            <Animated.View entering={FadeInDown.duration(300)} style={[styles.messageRow, isBot ? styles.messageRowBot : styles.messageRowUser]}>
                {isBot && <BotAvatar size={26} />}
                <View style={{ flex: 1, alignItems: isBot ? 'flex-start' : 'flex-end' }}>
                    {/* Bubble */}
                    <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
                        {item.isTyping ? (
                            <View style={{ flexDirection: 'row', gap: horizontalScale(4) }}>
                                <TypingIndicator />
                            </View>
                        ) : (
                            <MarkdownText
                                text={item.text}
                                style={[styles.bubbleText, isBot ? styles.bubbleTextBot : styles.bubbleTextUser, getRegularFont(i18n.language), { textAlign: isRTL ? 'right' : 'left' }]}
                            />
                        )}
                    </View>
                    {/* Premium Crop Tiles */}
                    {isBot && item.cropTiles && (
                        <View style={[styles.cropTileRow, { justifyContent: isRTL ? 'flex-end' : 'flex-start' }]}>
                            {item.cropTiles.map(crop => (
                                <CropProductTile
                                    key={crop.id}
                                    crop={crop}
                                    language={i18n.language}
                                    onPress={() => sendMessage(
                                        i18n.language === 'ur'
                                            ? `${crop.label} کے بارے میں جاننا چاہتا ہوں`
                                            : `Tell me about ${crop.label}`
                                    )}
                                />
                            ))}
                        </View>
                    )}
                    {/* Action Button */}
                    {isBot && item.action && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                if (item.action?.type === 'navigation' && item.action?.target) {
                                    router.push(item.action.target as any);
                                }
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.actionButtonText, getRegularFont(i18n.language)]}>
                                {item.action.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        );
    };

    const HEADER_HEIGHT = verticalScale(155);

    return (
        <Animated.View entering={FadeIn.duration(600)} style={{ flex: 1 }}>
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: CREAM }}
            behavior="padding"
            keyboardVerticalOffset={0}
        >
            {/* ── Premium Gradient Header ── */}
            <Animated.View
                entering={FadeInDown.duration(500).springify()}
                style={[styles.headerWrapper, { height: HEADER_HEIGHT, paddingTop: insets.top }]}
            >
                {/* Gradient fill */}
                <LinearGradient
                    colors={[GRAD_START, GRAD_END]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                {/* Curved wave bottom */}
                <Svg
                    height={verticalScale(30)}
                    width="100%"
                    style={styles.headerCurve}
                    viewBox="0 0 375 30"
                    preserveAspectRatio="none"
                >
                    <Path d="M 0 0 Q 187.5 45 375 0 L 375 30 L 0 30 Z" fill={CREAM} />
                </Svg>

                {/* Close button top-left */}
                <TouchableOpacity
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/home');
                        }
                    }}
                    style={[styles.closeBtn, { top: insets.top + verticalScale(10) }]}
                    activeOpacity={0.7}
                >
                    <Svg width={moderateScale(16)} height={moderateScale(16)} viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M15 19l-7-7 7-7"
                            stroke="rgba(255,255,255,0.85)"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </TouchableOpacity>

                {/* Centered agent info */}
                <View style={styles.agentInfo}>
                    <Animated.View entering={ZoomIn.delay(100).duration(500).springify()}>
                        <BotAvatar size={46} glow />
                    </Animated.View>
                    <Animated.View
                        style={styles.agentText}
                        entering={FadeInDown.delay(200).duration(500)}
                    >
                        <Text style={[styles.agentName, getHeaderFont(i18n.language)]}>{t('chat.agentName')}</Text>
                        <Text style={[styles.agentSubtitle, getRegularFont(i18n.language)]}>{t('chat.agentSubtitle')}</Text>
                    </Animated.View>
                </View>
            </Animated.View>

            {/* ── Chat Body ── */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.chatBody}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* ── Action Area ── */}
            <View style={[styles.actionArea, { paddingBottom: insets.bottom }]}>
                {/* Quick reply pills */}
                <Animated.View entering={FadeInUp.duration(600).delay(200)}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.quickRepliesScroll}
                    >
                        {QUICK_REPLIES_CONFIG.map(r => {
                            const label = t(r.translationKey);
                            return (
                                <TouchableOpacity
                                    key={r.translationKey}
                                    style={styles.quickReplyPill}
                                    onPress={() => sendMessage(label)}
                                    activeOpacity={0.75}
                                >
                                    <Text style={styles.quickReplyIcon}>{r.icon}</Text>
                                    <Text style={[styles.quickReplyText, getRegularFont(i18n.language)]}>{label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </Animated.View>

                {/* Input row */}
                <View style={[styles.inputBar, { paddingBottom: verticalScale(6) }]}>
                    <TouchableOpacity
                        style={styles.micBtn}
                        disabled={isTyping}
                        onPress={handleMicPress}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require('../assets/icons/mic.png')}
                            style={[
                                styles.micIcon,
                                (isTyping || isListening) && styles.micIconActive,
                                isTyping && styles.micIconDisabled
                            ]}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.textInput, getRegularFont(i18n.language), isTyping && styles.textInputDisabled]}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={t('chat.placeholder')}
                        placeholderTextColor="#8FA870"
                        textAlign={i18n.language === 'ur' ? 'right' : 'left'}
                        multiline
                        editable={!isTyping}
                        onSubmitEditing={() => sendMessage(inputText)}
                    />
                    <TouchableOpacity style={[styles.sendBtn, isTyping && styles.sendBtnDisabled]} onPress={() => sendMessage(inputText)} activeOpacity={0.8} disabled={isTyping}>
                        <Text style={styles.sendBtnText}>{isTyping ? '⏳' : '➤'}</Text>
                    </TouchableOpacity>
                </View>
                {isListening && (
                    <View style={styles.listeningIndicator}>
                        <Text style={[styles.listeningText, getRegularFont(i18n.language)]}>
                            {t('chat.listening')}
                        </Text>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
        </Animated.View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    // ── Header ──
    headerWrapper: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
        zIndex: 10,
    },
    headerCurve: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    closeBtn: {
        position: 'absolute',
        left: horizontalScale(16),
        zIndex: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: moderateScale(12),
        width: moderateScale(38),
        height: moderateScale(38),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    agentInfo: {
        alignItems: 'center',
        gap: verticalScale(2),
        paddingBottom: verticalScale(8),
        flex: 1,
        justifyContent: 'center',
    },
    agentText: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    agentName: {
        color: 'white',
        fontSize: moderateScale(18),
        letterSpacing: 0.3,
        fontWeight: '700',
    },
    agentSubtitle: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: moderateScale(11),
        marginTop: verticalScale(1),
    },

    // ── Avatar ──
    botAvatarOuter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    botAvatarGlow: {
        backgroundColor: 'rgba(180,220,100,0.25)',
        borderWidth: 2,
        borderColor: 'rgba(180,220,100,0.5)',
        shadowColor: '#A8D060',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 6,
    },
    botAvatarCircle: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.45)',
    },

    // ── Chat body ──
    chatBody: {
        paddingHorizontal: horizontalScale(14),
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(8),
        gap: verticalScale(14),
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: horizontalScale(8),
    },
    messageRowBot: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    messageRowUser: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
    },

    // ── Bubbles ──
    bubble: {
        maxWidth: '80%',
        borderRadius: moderateScale(22),
        paddingHorizontal: horizontalScale(16),
        paddingVertical: verticalScale(11),
    },
    bubbleBot: {
        backgroundColor: BUBBLE_BOT,
        borderTopRightRadius: moderateScale(4),
        borderWidth: 1,
        borderColor: GREEN_BORDER,
        shadowColor: '#8CB840',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    bubbleUser: {
        backgroundColor: BUBBLE_USER,
        borderTopLeftRadius: moderateScale(4),
        shadowColor: DARK_GREEN,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    bubbleText: {
        fontSize: moderateScale(14),
        lineHeight: moderateScale(23),
    },
    bubbleTextBot: {
        color: TEXT_DARK,
    },
    bubbleTextUser: {
        color: 'white',
    },

    // ── Premium Crop Tiles ──
    cropTileRow: {
        flexDirection: 'row',
        gap: horizontalScale(8),
        marginTop: verticalScale(10),
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
    },
    cropTile: {
        backgroundColor: 'white',
        borderRadius: moderateScale(14),
        paddingHorizontal: horizontalScale(12),
        paddingVertical: verticalScale(10),
        alignItems: 'center',
        gap: horizontalScale(6),
        borderWidth: 1,
        borderColor: GREEN_BORDER,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
    },
    cropTileEmoji: {
        fontSize: moderateScale(20),
    },
    cropTileLabel: {
        color: TEXT_DARK,
        fontSize: moderateScale(13),
        fontWeight: '700',
        textAlign: 'center',
    },
    cropTileChevron: {
        color: THEME_COLOR,
        fontSize: moderateScale(18),
        fontWeight: 'bold',
    },

    // ── Action Area ──
    actionArea: {
        backgroundColor: CREAM_DARK,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 8,
    },
    quickRepliesScroll: {
        paddingHorizontal: horizontalScale(12),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(6),
        gap: horizontalScale(8),
        flexDirection: 'row',
    },
    quickReplyPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: horizontalScale(5),
        backgroundColor: 'rgba(88,115,32,0.12)',
        borderRadius: moderateScale(20),
        paddingHorizontal: horizontalScale(12),
        paddingVertical: verticalScale(6),
        borderWidth: 1,
        borderColor: 'rgba(88,115,32,0.25)',
    },
    quickReplyIcon: {
        fontSize: moderateScale(13),
    },
    quickReplyText: {
        color: DARK_GREEN,
        fontSize: moderateScale(12),
        fontWeight: '600',
    },

    // ── Input bar ──
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: horizontalScale(12),
        paddingTop: verticalScale(8),
        gap: horizontalScale(8),
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    micBtn: {
        padding: moderateScale(6),
    },
    micIcon: {
        width: horizontalScale(22),
        height: horizontalScale(22),
        tintColor: THEME_COLOR,
    },
    micIconActive: {
        tintColor: '#E74C3C',
        opacity: 1,
    },
    micIconDisabled: {
        opacity: 0.5,
    },
    textInput: {
        flex: 1,
        backgroundColor: CREAM,
        borderRadius: moderateScale(22),
        paddingHorizontal: horizontalScale(16),
        paddingVertical: verticalScale(9),
        fontSize: moderateScale(14),
        color: TEXT_DARK,
        maxHeight: verticalScale(100),
        borderWidth: 1,
        borderColor: GREEN_BORDER,
    },
    textInputDisabled: {
        opacity: 0.6,
        backgroundColor: '#f0f0f0',
    },
    sendBtn: {
        backgroundColor: THEME_COLOR,
        width: horizontalScale(40),
        height: horizontalScale(40),
        borderRadius: horizontalScale(20),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: DARK_GREEN,
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 6,
    },
    sendBtnDisabled: {
        opacity: 0.6,
    },
    sendBtnText: {
        color: 'white',
        fontSize: moderateScale(16),
        transform: [{ rotate: '-45deg' }],
    },

    // ── Action Button ──
    actionButton: {
        marginTop: verticalScale(12),
        paddingVertical: verticalScale(10),
        paddingHorizontal: horizontalScale(16),
        backgroundColor: THEME_COLOR,
        borderRadius: moderateScale(20),
        alignItems: 'center',
        shadowColor: DARK_GREEN,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButtonText: {
        color: 'white',
        fontSize: moderateScale(13),
        fontWeight: '600',
    },

    // ── Listening Indicator ──
    listeningIndicator: {
        backgroundColor: 'rgba(231, 76, 60, 0.08)',
        paddingHorizontal: horizontalScale(12),
        paddingVertical: verticalScale(8),
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(231, 76, 60, 0.2)',
    },
    listeningText: {
        color: '#E74C3C',
        fontSize: moderateScale(12),
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});
