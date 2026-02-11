import { THEME_COLOR } from '@/constants/theme';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME_COLOR,
    },
    safeArea: {
        flex: 1,
        backgroundColor: THEME_COLOR,
    },
    lightContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: horizontalScale(20),
        paddingVertical: verticalScale(15),
        backgroundColor: THEME_COLOR,
    },
    headerTitle: {
        fontFamily: 'NotoSansArabic-Bold',
        color: 'white',
        textAlign: 'center',
    },
    headerTitleSmall: {
        fontFamily: 'NotoSansArabic-Bold',
        fontSize: moderateScale(20),
        color: 'white',
        textAlign: 'center',
    },
    backButton: {
        padding: moderateScale(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white', // Default, can be overridden
        fontSize: moderateScale(28),
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
        alignItems: 'center',
        paddingBottom: verticalScale(100),
    },
    shadowSmall: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: verticalScale(2),
        },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(3.84),
        elevation: 3,
    },
    shadowMedium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.3,
        shadowRadius: moderateScale(4),
        elevation: 5,
    },
    card: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: moderateScale(20),
        paddingVertical: verticalScale(15),
        paddingHorizontal: horizontalScale(20),
        marginBottom: verticalScale(20),
    },
    micContainer: {
        position: 'absolute',
        bottom: verticalScale(50),
        left: horizontalScale(20),
    },
    micButton: {
        width: horizontalScale(60),
        height: horizontalScale(60),
        borderRadius: horizontalScale(30),
        backgroundColor: '#7cb342', // Default green
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.3,
        shadowRadius: moderateScale(4),
        elevation: 5,
    },
    micButtonSecColor: {
        backgroundColor: '#6a8a2c'
    },
    micIcon: {
        width: horizontalScale(30),
        height: horizontalScale(30),
        tintColor: 'white',
    },
    midViewWidth: {
        width: horizontalScale(40)
    },
    textRight: {
        textAlign: 'right',
    },
    textCenter: {
        textAlign: 'center',
    },
    fontBold: {
        fontFamily: 'NotoSansArabic-Bold',
    },
    fontRegular: {
        fontFamily: 'NotoSansArabic-Regular',
    },

    titleText: {
        fontFamily: 'NotoSansArabic-Bold',
        fontSize: moderateScale(18),
        color: 'black',
        textAlign: 'center',
        marginBottom: verticalScale(20),
    },
    descriptionText: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(16),
        color: 'black',
        // textAlign: 'right',
        marginBottom: verticalScale(20),
        lineHeight: verticalScale(28),
    },
    packageContainer: {
        width: '100%',
        marginBottom: verticalScale(15),
        // alignItems: 'flex-start',
    },
    packageTitle: {
        fontFamily: 'NotoSansArabic-Bold',
        fontSize: moderateScale(18),
        color: 'black',
        // textAlign: 'right',
        marginBottom: verticalScale(5),
    },
    packageText: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(16),
        color: 'black',
        // textAlign: 'right',
        lineHeight: verticalScale(26),
    },
    packageInstruction: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(16),
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: verticalScale(26),
        marginBottom: verticalScale(20),
    },
    noteText: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(15),
        color: 'black',
        textAlign: 'center',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(30),
        lineHeight: verticalScale(26),
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: '#b5d985',
        paddingVertical: verticalScale(16),
        paddingHorizontal: horizontalScale(40),
        borderRadius: moderateScale(25),
        width: '85%',
        minHeight: verticalScale(60),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(3),
        elevation: 4,
        borderWidth: 1,
        borderColor: '#a3c970',
    },
    actionButtonText: {
        fontFamily: 'NotoSansArabic-Regular',
        fontSize: moderateScale(15),
        color: 'black',
        textAlign: 'center',
        lineHeight: moderateScale(30),
    },
});
