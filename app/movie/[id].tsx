import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../config/firebase';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const docRef = doc(db, 'movies', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMovie({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log('No such movie!');
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text>Không tìm thấy phim</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header với back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{movie.title}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Movie Info */}
        <View style={styles.content}>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>{movie.rating?.toFixed(1) || 'N/A'}</Text>
          </View>

          <Text style={styles.movieTitle}>{movie.title}</Text>
          
          <View style={styles.detailsRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{movie.duration || '120 phút'}</Text>
            
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{movie.releaseDate || '2024'}</Text>
          </View>

          {/* Genre Tags */}
          <View style={styles.genreContainer}>
            {movie.genre?.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nội dung</Text>
            <Text style={styles.description}>
              {movie.description || 'Nội dung phim đang cập nhật...'}
            </Text>
          </View>

          {/* Showtimes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suất chiếu</Text>
            <View style={styles.showtimeGrid}>
              {['14:00', '16:30', '19:00', '21:30'].map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.showtimeButton}
                  onPress={() => router.push({
                    pathname: '/movie/booking',
                    params: { movieId: id, time }
                  })}
                >
                  <Text style={styles.showtimeText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Book Button */}
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => router.push({
              pathname: '/movie/booking',
              params: { movieId: id }
            })}
          >
            <Text style={styles.bookButtonText}>Đặt vé ngay</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  movieTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 16,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  genreTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  showtimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  showtimeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  showtimeText: {
    color: 'white',
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});