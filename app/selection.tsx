import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME_COLOR = '#4F611C';

export default function SelectionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, name } = params;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{name} کی فصل</Text>
                <View style={{ width: 40 }} />
            </Animated.View>

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={styles.contentContainer}>

                <View style={styles.buttonsContainer}>
                    <Animated.View entering={FadeInUp.delay(400).springify()} style={{ width: '100%' }}>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => {
                                router.push({
                                    pathname: '/crop-types',
                                    params: { id, name }
                                });
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.optionButtonText}>دھان کی قسم کا انتخاب</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(500).springify()} style={{ width: '100%' }}>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => {
                                router.push({
                                    pathname: '/instruction-nitrogen' as any,
                                    params: { id, name }
                                });
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.optionButtonText}>ہدایات برائے کافی نائٹروجن پلاٹ</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

            </Animated.View>

            {/* Mic Button */}
            <Animated.View entering={ZoomIn.delay(800).springify()} style={styles.micContainer}>
                <TouchableOpacity style={styles.micButton}>
                    <Image source={require('../assets/icons/mic.png')} style={styles.micIcon} resizeMode="contain" />
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME_COLOR,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    backIcon: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 50,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    buttonsContainer: {
        width: '100%',
        gap: 20,
        alignItems: 'center',
        marginTop: 50,
    },
    optionButton: {
        backgroundColor: '#b5d985',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#a3c970',
    },
    optionButtonText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 12,
        color: 'black',
        textAlign: 'center',
    },
    micContainer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
    },
    micButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6a8a2c',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    micIcon: {
        width: 30,
        height: 30,
        tintColor: 'white',
    },
});
