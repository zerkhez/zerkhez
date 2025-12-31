import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME_COLOR = '#4F611C';

export default function CropTypesScreen() {
    const router = useRouter();
    const searchParams = useLocalSearchParams();
    const { id, name, nextRoute } = searchParams;

    // Data for crop types
    const cropTypesData: Record<string, string[]> = {
        rice: [
            'سونا سپر باسمتی - 282',
            'کسان باسمتی',
            'سپر باسمتی',
            'باسمتی - 515',
            'پی کے خوشبودار - 1121',
            'پی کے خوشبودار - 2021',
        ],
        // wheat: [
        //     'گندم - 1',
        //     'گندم - 2',
        //     'گندم - 3',
        // ],
        maize: [
            'عام  ورائٹی',
            'ہائبرڈ ورائٹی',
        ],
    };

    const currentCropTypes = cropTypesData[id as string] || [];

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
                <Text style={styles.instructionText}>{name} کی قسم کا انتخاب کریں:</Text>

                <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
                    {currentCropTypes.map((type, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInUp.delay(400 + index * 60).springify()}
                            style={{ width: '100%' }}
                        >
                            <TouchableOpacity
                                style={styles.typeButton}
                                onPress={() => {
                                    console.log(`Selected type: ${type}`);
                                    const params: any = { typeName: type, name, id };

                                    if (nextRoute) {
                                        // If nextRoute is passed, navigate there
                                        router.push({
                                            pathname: nextRoute as any,
                                            params: { typeName: type }
                                        });
                                    } else {
                                        // Default behavior
                                        router.push({
                                            pathname: '/crop-stages' as any,
                                            params: params
                                        });
                                    }
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.typeButtonText}>{type}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </ScrollView>
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
        paddingTop: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    instructionText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 18,
        color: 'black',
        marginBottom: 20,
        textAlign: 'center',
    },
    listContainer: {
        width: '100%',
        paddingBottom: 100, // Space for mic button
        gap: 15,
        alignItems: 'center',
    },
    typeButton: {
        backgroundColor: '#b5d985', // Light green color from image
        paddingVertical: 4,
        paddingHorizontal: 40,
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
    typeButtonText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 15,
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
        backgroundColor: '#6a8a2c', // Slightly darker green for mic button
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
