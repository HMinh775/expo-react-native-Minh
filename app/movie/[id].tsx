<<<<<<< HEAD
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
=======
import { Calendar, ChevronLeft, Clock, Heart, Play, Share2, Star, Users } from 'lucide-react';
import { Movie } from '../App';

interface MovieDetailProps {
  movie: Movie;
  onBookNow: () => void;
  onBack: () => void;
}

export function MovieDetail({ movie, onBookNow, onBack }: MovieDetailProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Backdrop Image */}
      <div className="relative h-[450px]">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-gray-900/80 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button className="w-10 h-10 bg-gray-900/80 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-gray-900/80 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Play Trailer */}
        <button className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-full active:scale-95 transition-transform">
          <Play className="w-5 h-5 fill-white" />
          <span>Xem trailer</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pb-24">
        {/* Title & Rating */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-xs">
              Đang chiếu
            </span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs">
              {movie.ageRating}
            </span>
          </div>
          <h1 className="text-3xl mb-3">{movie.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-lg">{movie.rating}</span>
              <span className="text-gray-400">/10</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{movie.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{movie.releaseDate}</span>
            </div>
          </div>
        </div>

        {/* Genre */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-2">Thể loại</h3>
          <div className="flex flex-wrap gap-2">
            {movie.genre.split(', ').map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-2">Nội dung phim</h3>
          <p className="text-gray-300 leading-relaxed">{movie.description}</p>
        </div>

        {/* Cast */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Diễn viên
          </h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {movie.cast.map((actor, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="w-20 h-20 bg-gray-800 rounded-full mb-2"></div>
                <p className="text-xs text-center line-clamp-2 w-20">{actor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent p-6 pb-8">
        <button
          onClick={onBookNow}
          className="w-full bg-yellow-500 text-gray-900 py-4 rounded-xl transition-all active:scale-95"
        >
          Đặt vé ngay
        </button>
      </div>
    </div>
  );
}
>>>>>>> 4b405c09b26fd3291582b53f2b7fea9ea6f69fba
