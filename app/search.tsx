import { db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<any[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load toàn bộ phim một lần để tìm kiếm nhanh (hoặc có thể query trực tiếp từ Firebase)
  useEffect(() => {
    fetchAllMovies();
  }, []);

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'movies'));
      const moviesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMovies(moviesList);
      setFilteredMovies(moviesList);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => 
        movie.title.toLowerCase().includes(text.toLowerCase()) ||
        (movie.category && movie.category.some((cat: string) => cat.toLowerCase().includes(text.toLowerCase())))
      );
      setFilteredMovies(filtered);
    }
  };

  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => router.push({ pathname: '/movie/[id]', params: { id: item.id } })}
    >
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <View style={styles.movieInfo}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating?.toFixed(1) || '0.0'}</Text>
        </View>
        <Text style={styles.price}>{item.price?.toLocaleString()}đ</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Tìm kiếm */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#764ba2" />
            <TextInput
              style={styles.input}
              placeholder="Tìm tên phim, thể loại..."
              placeholderTextColor="#999"
              autoFocus={true}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={18} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#764ba2" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id}
          renderItem={renderMovieItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>Không tìm thấy phim nào khớp với "{searchQuery}"</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    padding: 15,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  movieCard: {
    width: (width - 45) / 2,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 220,
  },
  movieInfo: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#764ba2',
    marginTop: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});