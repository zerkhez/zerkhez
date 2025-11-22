import { useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InstructionsScreen() {
  const router = useRouter();

  const videos = [
    {
      id: 1,
      title: 'فصلوں کی بیماریوں کی تشخیص',
      titleEng: 'Crop Disease Identification',
      url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_1',
      thumbnail: '📹',
    },
    {
      id: 2,
      title: 'ایپ استعمال کرنے کی ہدایات',
      titleEng: 'App Usage Instructions',
      url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_2',
      thumbnail: '📹',
    },
  ];

  const openVideo = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ہدایات</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>ویڈیو ٹیوٹوریلز</Text>
        <Text style={styles.sectionSubtitle}>مزید معلومات کے لیے یہ ویڈیوز دیکھیں</Text>

        <View style={styles.videosContainer}>
          {videos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoCard}
              onPress={() => openVideo(video.url)}
              activeOpacity={0.7}
            >
              <View style={styles.videoThumbnail}>
                <View style={styles.playButton}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
                <Text style={styles.thumbnailEmoji}>{video.thumbnail}</Text>
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.videoTitleEng}>{video.titleEng}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#5a7c3e',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  videosContainer: {
    gap: 20,
  },
  videoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoThumbnail: {
    height: 200,
    backgroundColor: '#5a7c3e',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnailEmoji: {
    fontSize: 64,
    opacity: 0.3,
  },
  playButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 32,
    color: '#5a7c3e',
    marginLeft: 4,
  },
  videoInfo: {
    padding: 20,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  videoTitleEng: {
    fontSize: 14,
    color: '#666',
  },
});