import { db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Thêm Icon cho đẹp
import { useLocalSearchParams, useRouter } from 'expo-router'; // Thêm useRouter
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter(); // Khởi tạo router để điều hướng
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

  // Hàm xử lý khi nhấn Đặt vé
  const handleBooking = () => {
    router.push({
      pathname: '/movie/booking', // Trỏ đến file app/movie/booking.tsx
      params: { 
        id: id, 
        title: movie.title, 
        price: movie.price 
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
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Ảnh nền Backdrop */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: movie.backdrop }} style={styles.backdrop} />
          {/* Nút Back quay lại trang chủ */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
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
              <Text style={styles.infoText}>{movie.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color="#888" />
              <Text style={styles.infoText}>{movie.releaseDate}</Text>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Nội dung</Text>
          <Text style={styles.desc}>{movie.description}</Text>

          <Text style={styles.sectionTitle}>Đạo diễn & Diễn viên</Text>
          <View style={styles.crewContainer}>
             <Text style={styles.crewLabel}>Đạo diễn: <Text style={styles.crewName}>{movie.director}</Text></Text>
             <Text style={styles.crewLabel}>Diễn viên: <Text style={styles.crewName}>{movie.cast?.join(', ')}</Text></Text>
          </View>

          {/* Khoảng cách để không bị nút đè lên nội dung cuối */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Nút Đặt vé cố định ở dưới màn hình (Floating Button) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.buyButton} onPress={handleBooking}>
          <Text style={styles.buyText}>Đặt vé ngay - {movie.price?.toLocaleString()}đ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  imageContainer: { position: 'relative' },
  backdrop: { width: '100%', height: 300, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 },
  details: { padding: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
  infoRow: { flexDirection: 'row', gap: 20, marginBottom: 25 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoText: { color: '#888', fontSize: 14 },
  sectionTitle: { color: '#e21221', fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 12, textTransform: 'uppercase' },
  desc: { color: '#ccc', lineHeight: 24, fontSize: 15, textAlign: 'justify' },
  crewContainer: { backgroundColor: '#161626', padding: 15, borderRadius: 15, marginTop: 5 },
  crewLabel: { color: '#666', fontSize: 14, marginBottom: 8 },
  crewName: { color: '#fff', fontWeight: '500' },
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 20, 
    backgroundColor: 'rgba(15, 15, 26, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#1a1a2a'
  },
  buyButton: { backgroundColor: '#e21221', padding: 18, borderRadius: 15, alignItems: 'center', shadowColor: '#e21221', shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 },
  buyText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});