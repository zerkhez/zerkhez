// Purpose: Use to create a customize pacakage for fertlizers
// Author: 
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME_COLOR } from '@/constants/theme';
import Header from '@/components/header';
import { commonStyles, horizontalScale, verticalScale, moderateScale } from '@/styles/common';

// Placeholder data for fertilizers
const GROUP_1_FERTILIZERS = [
    { id: '1', name: 'DAP (18:46:0)\nڈی۔ اے۔ پی' },
    { id: '2', name: 'SSP (0:18:0)\nایس۔ ایس۔ پی' },
    { id: '3', name: 'Nitrophos (23:23:0)\nنائٹروفاس' },
    { id: '4', name: 'TSP (0:46:0)\nٹی۔ ایس۔ پی' },
    { id: '5', name: 'MAP (13:52:0)\nایم۔ اے۔ پی' },
];

const GROUP_2_FERTILIZERS = [
    { id: '1', name: 'Urea (46:0:0)\nیوریا' },
    { id: '2', name: 'CAN (26:0:0)\nسی۔ اے۔ این' },
    { id: '3', name: 'Ammonium Sulfate (21:0:0)\nامونیم سلفیٹ' },
];

const GROUP_3_FERTILIZERS = [
    { id: '1', name: 'SOP (0:0:50)\nایس۔ او۔ پی' },
    { id: '2', name: 'MOP (0:0:60)\nایم۔ او۔ پی' },
];

interface SelectionGroup {
    fertilizer: { id: string; name: string } | null;
    amount: string;
}

export default function FertilizerSelectionScreen() {
    const router = useRouter();

    const [group1, setGroup1] = useState<SelectionGroup>({ fertilizer: null, amount: '' });
    const [group2, setGroup2] = useState<SelectionGroup>({ fertilizer: null, amount: '' });
    const [group3, setGroup3] = useState<SelectionGroup>({ fertilizer: null, amount: '' });

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<1 | 2 | 3 | null>(null);

    const openModal = (group: 1 | 2 | 3) => {
        setCurrentGroup(group);
        setModalVisible(true);
    };

    const selectFertilizer = (item: { id: string; name: string }) => {
        if (currentGroup === 1) setGroup1({ ...group1, fertilizer: item });
        if (currentGroup === 2) setGroup2({ ...group2, fertilizer: item });
        if (currentGroup === 3) setGroup3({ ...group3, fertilizer: item });
        setModalVisible(false);
    };

    const getCurrentList = () => {
        if (currentGroup === 1) return GROUP_1_FERTILIZERS;
        if (currentGroup === 2) return GROUP_2_FERTILIZERS;
        if (currentGroup === 3) return GROUP_3_FERTILIZERS;
        return [];
    };

    const handleCalculate = async () => {
        console.log('Calculating with:', { group1, group2, group3 });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Navigate to result page
        router.push('/results');
    };

    const renderGroup = (
        groupNum: 1 | 2 | 3,
        title: string,
        state: SelectionGroup,
        setState: (val: SelectionGroup) => void
    ) => (
        <View style={styles.groupContainer}>
            <Text style={styles.groupLabel}>{title}</Text>

            {/* Dropdown Trigger */}
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => { openModal(groupNum) }}
                activeOpacity={0.7}
            >
                <Text style={[styles.dropdownText, !state.fertilizer && styles.placeholderText]}>
                    {state.fertilizer ? state.fertilizer.name : 'کھاد کا انتخاب کریں'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            {/* Amount Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>مقدار (کلوگرام):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={state.amount}
                    onChangeText={(text) => { setState({ ...state, amount: text }) }}
                    placeholder="0"
                    placeholderTextColor="#999"
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text="کھاد کا انتخاب" />

            <View style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInUp.delay(200).springify()}>
                        {renderGroup(1, 'گروپ - 1 (نائٹروجن)', group1, setGroup1)}
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(300).springify()}>
                        {renderGroup(2, 'گروپ - 2 (فاسفورس)', group2, setGroup2)}
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).springify()}>
                        {renderGroup(3, 'گروپ - 3 (پوٹاش)', group3, setGroup3)}
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(500).springify()} style={{ width: '100%', alignItems: 'center', marginTop: verticalScale(20) }}>
                        <TouchableOpacity
                            style={commonStyles.actionButton}
                            onPress={handleCalculate}
                            activeOpacity={0.8}
                        >
                            <Text style={commonStyles.actionButtonText}>حساب لگائیں</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </View>

            {/* Custom Dropdown Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => { setModalVisible(false); }}
            >
                <TouchableWithoutFeedback onPress={() => { setModalVisible(false); }}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>کھاد کا انتخاب کریں</Text>
                                    <TouchableOpacity onPress={() => { setModalVisible(false); }}>
                                        <Text style={styles.closeButton}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    data={getCurrentList()}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.modalItem}
                                            onPress={() => { selectFertilizer(item); }}
                                        >
                                            <Text style={styles.modalItemText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: horizontalScale(25),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(100),
        width: '100%',
    },
    groupContainer: {
        marginBottom: verticalScale(15),
        backgroundColor: '#c2e7bdff',
        padding: moderateScale(12),
        borderRadius: moderateScale(15),
        borderWidth: 1,
        borderColor: '#eee',
    },
    groupLabel: {
        fontFamily: 'NotoSansArabic-Bold',
        fontSize: moderateScale(16),
        color: THEME_COLOR,
        textAlign: 'right',
        marginBottom: verticalScale(8),
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        marginBottom: verticalScale(12),
    },
    dropdownText: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(16),
        color: 'black',
        flex: 1,
        textAlign: 'right',
    },
    placeholderText: {
        color: '#999',
    },
    dropdownIcon: {
        fontSize: moderateScale(12),
        color: '#666',
        marginRight: horizontalScale(10),
    },
    inputContainer: {
        flexDirection: 'row-reverse', // Right to left layout
        alignItems: 'center',
        gap: horizontalScale(10),
    },
    inputLabel: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(16),
        color: '#333',
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        textAlign: 'right',
        fontSize: moderateScale(16),
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20),
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: moderateScale(20),
        width: '100%',
        maxHeight: '60%',
        padding: moderateScale(20),
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(15),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: verticalScale(10),
    },
    modalTitle: {
        fontFamily: 'NotoSansArabic-Bold',
        fontSize: moderateScale(18),
        color: THEME_COLOR,
    },
    closeButton: {
        fontSize: moderateScale(24),
        color: '#999',
        padding: moderateScale(5),
    },
    modalItem: {
        paddingVertical: verticalScale(15),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemText: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(16),
        color: '#333',
        textAlign: 'right',
    },
});

