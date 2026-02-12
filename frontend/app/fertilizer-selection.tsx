// Purpose: Use to create a customize pacakage for fertlizers
// Author: 
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { commonStyles, horizontalScale, verticalScale, moderateScale, getHeaderFont, getRegularFont } from '@/styles/common';

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
    const { t, i18n } = useTranslation();

    const isRTL = i18n.language === 'ur';

    const [group1, setGroup1] = useState<SelectionGroup>({ fertilizer: null, amount: '' });
    const [group2, setGroup2] = useState<SelectionGroup>({ fertilizer: null, amount: '' });
    const [group3, setGroup3] = useState<SelectionGroup>({ fertilizer: null, amount: '' });

    // Expansion state for collapsible cards
    const [expandedGroup1, setExpandedGroup1] = useState(false);
    const [expandedGroup2, setExpandedGroup2] = useState(false);
    const [expandedGroup3, setExpandedGroup3] = useState(false);

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
        setState: (val: SelectionGroup) => void,
        isExpanded: boolean,
        setExpanded: (val: boolean) => void
    ) => (
        <View style={styles.groupContainer}>
            {/* Header - Always visible */}
            <TouchableOpacity
                style={styles.groupHeader}
                onPress={() => setExpanded(!isExpanded)}
                activeOpacity={0.7}
            >
                <Text style={[styles.groupLabel, getHeaderFont(i18n.language)]}>{title}</Text>
                <Text style={[styles.chevronIcon, isExpanded && styles.chevronExpanded]}>
                    ▼
                </Text>
            </TouchableOpacity>

            {/* Collapsible Content */}
            {isExpanded && (
                <View style={styles.groupContent}>
                    {/* Dropdown Trigger */}
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => { openModal(groupNum) }}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.dropdownText, !state.fertilizer && styles.placeholderText, !isRTL && styles.textLeft, getRegularFont(i18n.language)]}>
                            {state.fertilizer ? state.fertilizer.name : t('fertilizerSelection.selectFertilizer')}
                        </Text>
                        <Text style={styles.dropdownIcon}>▼</Text>
                    </TouchableOpacity>

                    {/* Amount Input */}
                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, !isRTL && styles.textLeft, getRegularFont(i18n.language)]}>{t('fertilizerSelection.amountLabel')}</Text>
                        <TextInput
                            style={[styles.input, !isRTL && styles.textLeft]}
                            keyboardType="numeric"
                            value={state.amount}
                            onChangeText={(text) => { setState({ ...state, amount: text }) }}
                            placeholder="0"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            {/* Header */}
            <Header text={t('fertilizerSelection.header')} textSize={moderateScale(15)} />

            <View style={commonStyles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInUp.delay(200).springify()}>
                        {renderGroup(1, t('fertilizerSelection.group1'), group1, setGroup1, expandedGroup1, setExpandedGroup1)}
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(300).springify()}>
                        {renderGroup(2, t('fertilizerSelection.group2'), group2, setGroup2, expandedGroup2, setExpandedGroup2)}
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).springify()}>
                        {renderGroup(3, t('fertilizerSelection.group3'), group3, setGroup3, expandedGroup3, setExpandedGroup3)}
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(500).springify()} style={{ width: '100%', alignItems: 'center', marginTop: verticalScale(20) }}>
                        <TouchableOpacity
                            style={commonStyles.actionButton}
                            onPress={handleCalculate}
                            activeOpacity={0.8}
                        >
                            <Text style={commonStyles.actionButtonText}>{t('fertilizerSelection.calculate')}</Text>
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
                                    <Text style={[styles.modalTitle, getHeaderFont(i18n.language)]}>{t('fertilizerSelection.selectFertilizer')}</Text>
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
                                            <Text style={[styles.modalItemText, !isRTL && styles.textLeft, getRegularFont(i18n.language)]}>{item.name}</Text>
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
        paddingHorizontal: horizontalScale(20),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(100),
        width: '100%',
    },
    groupContainer: {
        marginBottom: verticalScale(15),
        backgroundColor: 'white',
        padding: moderateScale(16),
        borderRadius: moderateScale(20),
        borderWidth: 2,
        borderColor: THEME_COLOR,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(4) },
        shadowOpacity: 0.15,
        shadowRadius: moderateScale(8),
        elevation: 6,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(4),
    },
    groupLabel: {
        fontSize: moderateScale(18),
        color: THEME_COLOR,
        flex: 1,
        textAlign: 'center',
    },
    chevronIcon: {
        fontSize: moderateScale(16),
        color: THEME_COLOR,
        fontWeight: 'bold',
        transform: [{ rotate: '-90deg' }],
    },
    chevronExpanded: {
        transform: [{ rotate: '0deg' }],
    },
    groupContent: {
        marginTop: verticalScale(12),
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: moderateScale(15),
        paddingVertical: moderateScale(16),
        paddingHorizontal: moderateScale(15),
        marginBottom: verticalScale(15),
        minHeight: verticalScale(55),
    },
    dropdownText: {
        fontSize: moderateScale(16),
        color: 'black',
        flex: 1,
        textAlign: 'right',
        paddingRight: horizontalScale(10),
    },
    placeholderText: {
        color: '#999',
    },
    dropdownIcon: {
        fontSize: moderateScale(14),
        color: THEME_COLOR,
        fontWeight: 'bold',
    },
    inputContainer: {
        width: '100%',
    },
    inputLabel: {
        fontSize: moderateScale(15),
        color: '#555',
        marginBottom: verticalScale(8),
        textAlign: 'right',
    },
    input: {
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: moderateScale(15),
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(15),
        textAlign: 'right',
        fontSize: moderateScale(16),
    },
    textLeft: {
        textAlign: 'left',
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
        fontSize: moderateScale(16),
        color: '#333',
        textAlign: 'right',
    },
});

