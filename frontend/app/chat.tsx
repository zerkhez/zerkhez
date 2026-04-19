// Purpose: Kisan Dost premium chatbot screen
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
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
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME_COLOR } from '@/constants/theme';
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

interface Message {
    id: string;
    type: MessageType;
    text: string;
    cropTiles?: CropTile[];
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

const QUICK_REPLIES = [
    { icon: '☁️', label: 'موسم' },
    { icon: '🌱', label: 'گندم بوائی' },
    { icon: '🌽', label: 'مکئی بیماری' },
    { icon: '💰', label: 'قیمتیں' },
];

const CROP_TILES: CropTile[] = [
    { id: 'wheat', label: 'گندم', emoji: '🌾' },
    { id: 'rice',  label: 'چاول', emoji: '🍚' },
    { id: 'maize', label: 'مکئی', emoji: '🌽' },
];

const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        type: 'bot',
        text: 'خوش آمدید! آج میں آپ کی کیا مدد کر سکتا ہوں؟\nموسم، بوائی یا بیماری کے بارے میں پوچھیں۔',
        cropTiles: CROP_TILES,
    },
];

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
function CropProductTile({ crop, onPress }: { crop: CropTile; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.cropTile} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.cropTileEmoji}>{crop.emoji}</Text>
            <Text style={[styles.cropTileLabel, getRegularFont('ur')]}>{crop.label}</Text>
            <Text style={styles.cropTileChevron}>›</Text>
        </TouchableOpacity>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg: Message = { id: Date.now().toString(), type: 'user', text: text.trim() };
        const botReply: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            text: 'آپ کے سوال کا جواب تیار ہو رہا ہے... جلد ہی آپ کو مکمل معلومات فراہم کی جائیں گی۔',
        };
        setMessages(prev => [...prev, userMsg, botReply]);
        setInputText('');
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isBot = item.type === 'bot';
        return (
            <Animated.View entering={FadeInDown.duration(300)} style={[styles.messageRow, isBot ? styles.messageRowBot : styles.messageRowUser]}>
                {isBot && <BotAvatar size={26} />}
                <View style={{ flex: 1, alignItems: isBot ? 'flex-end' : 'flex-start' }}>
                    {/* Bubble */}
                    <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
                        <Text style={[styles.bubbleText, isBot ? styles.bubbleTextBot : styles.bubbleTextUser, getRegularFont('ur')]}>
                            {item.text}
                        </Text>
                    </View>
                    {/* Premium Crop Tiles */}
                    {isBot && item.cropTiles && (
                        <View style={styles.cropTileRow}>
                            {item.cropTiles.map(crop => (
                                <CropProductTile
                                    key={crop.id}
                                    crop={crop}
                                    onPress={() => sendMessage(`${crop.label} کے بارے میں جاننا چاہتا ہوں`)}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </Animated.View>
        );
    };

    const HEADER_HEIGHT = verticalScale(160);

    return (
        <Animated.View entering={FadeIn.duration(600)} style={{ flex: 1 }}>
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: CREAM }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* ── Premium Gradient Header ── */}
            <Animated.View
                entering={FadeInDown.duration(700)}
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
                    height={verticalScale(40)}
                    width="100%"
                    style={styles.headerCurve}
                    viewBox="0 0 375 40"
                    preserveAspectRatio="none"
                >
                    <Path d="M 0 0 Q 187.5 60 375 0 L 375 40 L 0 40 Z" fill={CREAM} />
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
                    <BotAvatar size={46} glow />
                    <View style={styles.agentText}>
                        <Text style={[styles.agentName, getHeaderFont('ur')]}>کسان دوست</Text>
                        <Text style={[styles.agentSubtitle, getRegularFont('ur')]}>زرعی مشیر</Text>
                    </View>
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
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* ── Action Area ── */}
            <View style={styles.actionArea}>
                {/* Quick reply pills */}
                <Animated.View entering={FadeInUp.duration(600).delay(200)}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.quickRepliesScroll}
                    >
                        {QUICK_REPLIES.map(r => (
                            <TouchableOpacity
                                key={r.label}
                                style={styles.quickReplyPill}
                                onPress={() => sendMessage(r.label)}
                                activeOpacity={0.75}
                            >
                                <Text style={styles.quickReplyIcon}>{r.icon}</Text>
                                <Text style={[styles.quickReplyText, getRegularFont('ur')]}>{r.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* Input row */}
                <View style={[styles.inputBar, { paddingBottom: insets.bottom + verticalScale(6) }]}>
                    <TouchableOpacity style={styles.micBtn}>
                        <Image source={require('../assets/icons/mic.png')} style={styles.micIcon} />
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.textInput, getRegularFont('ur')]}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="کچھ بھی پوچھیں..."
                        placeholderTextColor="#8FA870"
                        textAlign="right"
                        multiline
                        onSubmitEditing={() => sendMessage(inputText)}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(inputText)} activeOpacity={0.8}>
                        <Text style={styles.sendBtnText}>➤</Text>
                    </TouchableOpacity>
                </View>
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
        gap: verticalScale(6),
        paddingBottom: verticalScale(16),
    },
    agentText: {
        alignItems: 'center',
    },
    agentName: {
        color: 'white',
        fontSize: moderateScale(22),
        letterSpacing: 0.3,
    },
    agentSubtitle: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: moderateScale(12),
        marginTop: verticalScale(2),
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
        flexDirection: 'row-reverse',
    },
    messageRowUser: {
        flexDirection: 'row',
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
        textAlign: 'right',
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
    sendBtnText: {
        color: 'white',
        fontSize: moderateScale(16),
        transform: [{ rotate: '-45deg' }],
    },
});
