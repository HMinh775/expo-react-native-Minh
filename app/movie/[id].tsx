import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (id) {
      fetchMovie();
      checkUserInteractions();
    }
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

  // Kiểm tra trạng thái yêu thích/xem sau của user
  const checkUserInteractions = async () => {
  const user = auth.currentUser;
  if (!user || !id) return;

  try {
    const docId = `${user.uid}_${id}`; // Tạo ID duy nhất cho mỗi tương tác

    // Kiểm tra trong collection favorites
    const favSnap = await getDoc(doc(db, 'favorites', docId));
    setIsFavorite(favSnap.exists());

    // Kiểm tra trong collection watchlater
    const wlSnap = await getDoc(doc(db, 'watchlater', docId));
    setIsWatchLater(wlSnap.exists());

    // Kiểm tra trong collection reviews
    const reviewSnap = await getDoc(doc(db, 'reviews', docId));
    if (reviewSnap.exists()) {
      setUserRating(reviewSnap.data().rating);
    }
  } catch (error) {
    console.error('Lỗi kiểm tra tương tác:', error);
  }
};

  // Toggle yêu thích
  const toggleFavorite = async () => {
  const user = auth.currentUser;
  if (!user) {
    Alert.alert('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để sử dụng tính năng này');
    return;
  }

  try {
    const docId = `${user.uid}_${id}`;
    const docRef = doc(db, 'favorites', docId);

    if (isFavorite) {
      await deleteDoc(docRef); // Xóa nếu đã thích
      setIsFavorite(false);
    } else {
      // Lưu mới kèm thông tin phim để hiển thị ở trang danh sách
      await setDoc(docRef, {
        userId: user.uid,
        movieId: id,
        title: movie.title,
        poster: movie.poster || movie.post,
        createdAt: new Date()
      });
      setIsFavorite(true);
    }
  } catch (error) {
    console.error('Lỗi cập nhật yêu thích:', error);
  }
};
  // Toggle xem sau
const toggleWatchLater = async () => {
  const user = auth.currentUser;
  if (!user) {
    Alert.alert('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để sử dụng tính năng này');
    return;
  }

  try {
    const docId = `${user.uid}_${id}`;
    const docRef = doc(db, 'watchlater', docId);

    if (isWatchLater) {
      await deleteDoc(docRef);
      setIsWatchLater(false);
    } else {
      await setDoc(docRef, {
        userId: user.uid,
        movieId: id,
        title: movie.title,
        poster: movie.poster || movie.post,
        createdAt: new Date()
      });
      setIsWatchLater(true);
    }
  } catch (error) {
    console.error('Lỗi cập nhật xem sau:', error);
  }
};

  // Lưu đánh giá
const submitRating = async () => {
  const user = auth.currentUser;
  if (!user) {
    Alert.alert('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để đánh giá');
    return;
  }

  try {
    const docId = `${user.uid}_${id}`;
    const docRef = doc(db, 'reviews', docId);

    await setDoc(docRef, {
      userId: user.uid,
      movieId: id,
      movieTitle: movie.title, // Lưu tên phim để hiện ở trang đánh giá của tôi
      rating: userRating,
      comment: "Đã đánh giá qua ứng dụng", // Bạn có thể thêm TextInput để lấy comment thật
      createdAt: new Date()
    });

    setShowRatingModal(false);
    Alert.alert('Thành công', 'Đánh giá của bạn đã được lưu!');
  } catch (error) {
    console.error('Lỗi lưu đánh giá:', error);
  }
};

  const handleBooking = () => {
    router.push({
      pathname: '/schedule',
      params: { 
        filterMovieId: id,
        filterTitle: movie.title 
      }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00E5FF" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy phim</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerContainer}>
          <Image 
            source={{ uri: movie.backdrop || movie.poster }} 
            style={styles.backdrop}
          />
          
          <LinearGradient
            colors={['rgba(10,15,28,0.3)', 'rgba(10,15,28,0.8)', '#0A0F1C']}
            style={styles.gradient}
          />

          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {/* Favorite Button */}
            <TouchableOpacity
              style={[styles.actionBtn, isFavorite && styles.actionBtnActive]}
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={22} 
                color={isFavorite ? "#FF4081" : "#fff"} 
              />
            </TouchableOpacity>

            {/* Watch Later Button */}
            <TouchableOpacity
              style={[styles.actionBtn, isWatchLater && styles.actionBtnActive]}
              onPress={toggleWatchLater}
            >
              <Ionicons 
                name={isWatchLater ? "bookmark" : "bookmark-outline"} 
                size={22} 
                color={isWatchLater ? "#00E5FF" : "#fff"} 
              />
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="share-social-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingText}>{movie.rating}</Text>
          </View>
        </View>

        {/* Movie Details */}
        <View style={styles.details}>
          <Text style={styles.title}>{movie.title}</Text>
          
          {/* Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoChip}>
              <Ionicons name="time-outline" size={16} color="#00E5FF" />
              <Text style={styles.infoText}>{movie.duration} phút</Text>
            </View>
            
            <View style={styles.infoChip}>
              <Ionicons name="calendar-outline" size={16} color="#00E5FF" />
              <Text style={styles.infoText}>{movie.releaseDate || '2024'}</Text>
            </View>
            
            <View style={styles.hdChip}>
              <Text style={styles.hdText}>HD</Text>
            </View>
          </View>

          {/* Categories */}
          {movie.category && movie.category.length > 0 && (
            <View style={styles.categoryRow}>
              {movie.category.map((cat: string, idx: number) => (
                <View key={idx} style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              ))}
            </View>
          )}

          {/* User Rating Section */}
          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Đánh giá của bạn</Text>
            <TouchableOpacity 
              style={styles.ratingButton}
              onPress={() => setShowRatingModal(true)}
            >
              <View style={styles.starsPreview}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= userRating ? "star" : "star-outline"}
                    size={20}
                    color={star <= userRating ? "#FFD700" : "#666"}
                  />
                ))}
              </View>
              <Text style={styles.ratingButtonText}>
                {userRating > 0 ? 'Sửa đánh giá' : 'Đánh giá phim'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#00E5FF" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Nội dung phim</Text>
          <Text style={styles.description}>{movie.description}</Text>

          {/* Additional Info */}
          <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Đạo diễn</Text>
              <Text style={styles.infoValue}>{movie.director || 'Đang cập nhật'}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Diễn viên</Text>
              <Text style={styles.infoValue}>
                {movie.cast?.join(', ') || 'Đang cập nhật'}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Ngôn ngữ</Text>
              <Text style={styles.infoValue}>{movie.language || 'Tiếng Việt'}</Text>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Giá vé</Text>
          <Text style={styles.price}>{movie.price?.toLocaleString()}đ</Text>
        </View>
        
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <LinearGradient
            colors={['#00E5FF', '#0097A7']}
            style={styles.bookGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.bookText}>Xem lịch chiếu</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đánh giá phim</Text>
              <TouchableOpacity onPress={() => setShowRatingModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>{movie.title}</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setUserRating(star)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= (hoverRating || userRating) ? "star" : "star-outline"}
                    size={48}
                    color={star <= (hoverRating || userRating) ? "#FFD700" : "#444"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingLabel}>
              {userRating === 0 ? 'Chưa chọn' : 
               userRating === 1 ? 'Tệ' :
               userRating === 2 ? 'Không hay' :
               userRating === 3 ? 'Tạm được' :
               userRating === 4 ? 'Hay' : 'Xuất sắc'}
            </Text>

            <TouchableOpacity 
              style={[styles.submitButton, userRating === 0 && styles.submitButtonDisabled]}
              onPress={submitRating}
              disabled={userRating === 0}
            >
              <Text style={styles.submitButtonText}>Xác nhận đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0A0F1C',
  },
  container: {
    flex: 1,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },

  // Header
  headerContainer: {
    position: 'relative',
    height: 400,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionButtons: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Details
  details: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 34,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,229,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.2)',
  },
  infoText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  hdChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FF4081',
    borderRadius: 8,
  },
  hdText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(156,39,176,0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(156,39,176,0.3)',
  },
  categoryText: {
    color: '#9C27B0',
    fontSize: 12,
    fontWeight: '600',
  },

  // Rating Section
  ratingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161626',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#252938',
  },
  starsPreview: {
    flexDirection: 'row',
    gap: 6,
  },
  ratingButtonText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 16,
  },

  // Description
  description: {
    color: '#bbb',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },

  // Info Card
  infoCard: {
    backgroundColor: '#161626',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#252938',
    marginBottom: 24,
  },
  infoItem: {
    paddingVertical: 12,
  },
  infoLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  infoValue: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#252938',
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0A0F1C',
    borderTopWidth: 1,
    borderTopColor: '#252938',
    gap: 16,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  price: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookButton: {
    flex: 1,
  },
  bookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  bookText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#161626',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 32,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  starButton: {
    padding: 8,
  },
  ratingLabel: {
    color: '#00E5FF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: '#00E5FF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#444',
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});