import { Image, StyleSheet, View } from 'react-native';
import { horizontalScale } from '@/styles/common';

export default function BlobDebugScreen() {
    return (
        <View style={styles.container}>
            {/* 
        This is the static blob shape.
        Tweak these values to get the perfect shape, 
        then copy them back to index.tsx 
      */}
            <View style={styles.blob} />

            <View style={styles.logoWrapper}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // COPY THIS TO index.tsx WHEN DONE
    blob: {
        position: 'absolute',
        width: horizontalScale(300),
        height: horizontalScale(260),
        backgroundColor: '#8BCB6B', // slightly softer green like image

        borderTopLeftRadius: horizontalScale(120),
        borderTopRightRadius: horizontalScale(160),

        borderBottomLeftRadius: horizontalScale(220),
        borderBottomRightRadius: horizontalScale(180),

        transform: [{ rotate: '-6deg' }],
    },
    logoWrapper: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    logoImage: {
        width: horizontalScale(150),
        height: horizontalScale(130),
    },
});
