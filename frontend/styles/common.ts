import { StyleSheet, Platform } from 'react-native';
import { THEME_COLOR } from '@/constants/theme';


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
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: THEME_COLOR,
    },
    headerTitle: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },
    headerTitleSmall: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
    backButton: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white', // Default, can be overridden
        fontSize: 28,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
        paddingBottom: 100,
    },
    shadowSmall: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    shadowMedium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    card: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 20,
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
        backgroundColor: '#7cb342', // Default green
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    micButtonSecColor:{
        backgroundColor: '#6a8a2c'
    },
    micIcon: {
        width: 30,
        height: 30,
        tintColor: 'white',
    },
    midViewWidth:{
        width:40
    },
    textRight: {
        textAlign: 'right',
    },
    textCenter: {
        textAlign: 'center',
    },
    fontBold: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
    },
    fontRegular: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
    },

    titleText: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 22,
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
    },
    descriptionText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 16,
        color: 'black',
        textAlign: 'right',
        marginBottom: 20,
        lineHeight: 28,
    },
    packageContainer: {
        width: '100%',
        marginBottom: 15,
        alignItems: 'flex-end',
    },
    packageTitle: {
        fontFamily: 'NotoNastaliqUrdu-Bold',
        fontSize: 18,
        color: 'black',
        textAlign: 'right',
        marginBottom: 5,
    },
    packageText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 16,
        color: 'black',
        textAlign: 'right',
        lineHeight: 26,
    },
    noteText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 15,
        color: 'black',
        textAlign: 'right',
        marginTop: 20,
        marginBottom: 30,
        lineHeight: 26,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: '#b5d985',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#a3c970',
    },
    actionButtonText: {
        fontFamily: 'NotoNastaliqUrdu-Regular',
        fontSize: 18,
        color: 'black',
    },
});
