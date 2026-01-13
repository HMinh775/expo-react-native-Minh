import { db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const docRef = doc(db, "movies", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMovie(docSnap.data());
      }
    } catch (error) {
      console.error("Lỗi lấy chi tiết phim:", error);
    } finally {
      setLoading(false);
    }
  };

  // SỬA TẠI ĐÂY: Trỏ sang trang Lịch chiếu (Schedule)
  const handleBooking = () => {
    router.push({
      pathname: '/schedule', // Đường dẫn đến app/(tabs)/schedule.tsx
      params: { 
        filterMovieId: id, // Truyền ID để trang Lịch chiếu tự lọc
        filterTitle: movie.title 
      }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#e21221" />
      </View>
    );
  }

  if (!movie) return <View style={styles.container}><Text style={{color: '#fff'}}>Không tìm thấy phim</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f1a' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: movie.backdrop || movie.poster }} style={styles.backdrop} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.title}>{movie.title}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="star" size={16} color="#ffc107" />
              <Text style={styles.infoText}>{movie.rating}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color="#888" />
              <Text style={styles.infoText}>{movie.duration} phút</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color="#888" />
              <Text style={styles.infoText}>{movie.releaseDate || '2024'}</Text>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Nội dung</Text>
          <Text style={styles.desc}>{movie.description}</Text>

          <Text style={styles.sectionTitle}>Thông tin thêm</Text>
          <View style={styles.crewContainer}>
             <Text style={styles.crewLabel}>Đạo diễn: <Text style={styles.crewName}>{movie.director || 'Đang cập nhật'}</Text></Text>
             <Text style={styles.crewLabel}>Diễn viên: <Text style={styles.crewName}>{movie.cast?.join(', ') || 'Đang cập nhật'}</Text></Text>
          </View>
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Footer cố định */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.buyButton} onPress={handleBooking}>
          <Text style={styles.buyText}>
            Xem lịch chiếu - {movie.price?.toLocaleString()}đ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { position: 'relative' },
  backdrop: { width: '100%', height: 350, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 },
  details: { padding: 20 },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
  infoRow: { flexDirection: 'row', gap: 20, marginBottom: 25 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoText: { color: '#888', fontSize: 14 },
  sectionTitle: { color: '#e21221', fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  desc: { color: '#aaa', lineHeight: 22, fontSize: 15 },
  crewContainer: { backgroundColor: '#161626', padding: 15, borderRadius: 15 },
  crewLabel: { color: '#666', fontSize: 13, marginBottom: 6 },
  crewName: { color: '#eee', fontWeight: '500' },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: 'rgba(15, 15, 26, 0.98)', borderTopWidth: 1, borderTopColor: '#1a1a2a' },
  buyButton: { backgroundColor: '#e21221', padding: 16, borderRadius: 16, alignItems: 'center' },
  buyText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});