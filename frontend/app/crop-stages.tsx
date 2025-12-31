import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME_COLOR = '#4F611C';

export default function CropStagesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, name, typeName } = params;

    // Data for crop stages
    let stage1 = "لاب";
    if(id!=="rice"){
        stage1="بیج"
    }
    const stages = [
        `${stage1} لگانے سے پہلے کھادوں کا استعمال`,
        'شاخیں پھوٹنے کے مرحلہ پر کھاد کا استعمال',
        'گوبھ پر کھاد کا استعمال',
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{typeName}</Text>
                <View style={{ width: 40 }} />
            </Animated.View>

            {/* Content Container */}
            <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={styles.contentContainer}>
                <Text style={styles.instructionText}>مرحلہ کا انتخاب کریں:</Text>

                <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
                    {stages.map((stage, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInUp.delay(400 + index * 60).springify()}
                            style={{ width: '100%' }}
                        >
                            <TouchableOpacity
                                style={styles.typeButton}
                                onPress={() => {
                                    console.log(`Selected stage: ${stage}`);
                                    if (index === 0) {
                                        router.push({
                                            pathname: '/pre-planting-instructions' as any,
                                            params: { id: typeName, name: typeName, stage:stages[0] } // Passing typeName as id/name for context
                                        });
                                    } else if (index === 1) {
                                        router.push({
                                            pathname: '/sprout-instructions' as any,
                                            params: { typeName: typeName }
                                        });
                                    } else if (index === 2) {
                                        router.push({
                                            pathname: '/gobh-instructions' as any,
                                            params: { typeName: typeName }
                                        });
                                    } else {
                                        // Navigate to other screens or handle selection
                                    }
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.typeButtonText}>{stage}</Text>
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
        paddingVertical: 15, // Increased padding for better touch area
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
    typeButtonText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 16, // Slightly larger font for readability
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
