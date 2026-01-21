import { db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Movie {
  id: string;
  title: string;
  poster: string;
  category: string[];
  rating: number;
  price: number;
  duration: string;
  year: number;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    fetchAllMovies();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'movies'));
      const moviesList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Chưa có tên',
          poster: data.poster || 'https://via.placeholder.com/300x450',
          category: data.category || [],
          rating: data.rating || 0,
          price: data.price || 0,
          duration: data.duration || '0',
          year: data.year || 2024,
        };
      });
      setMovies(moviesList);
      setFilteredMovies([]); // Ban đầu chưa hiển thị gì
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    // Animation khi nhập
    Animated.spring(inputScale, {
      toValue: text.length > 0 ? 1.02 : 1,
      useNativeDriver: true,
    }).start();
    
    if (text.trim() === '') {
      setFilteredMovies([]);
    } else {
      const filtered = movies.filter(movie => {
        const searchText = text.toLowerCase();
        return (
          movie.title.toLowerCase().includes(searchText) ||
          movie.category?.some((cat: string) => 
            cat.toLowerCase().includes(searchText)
          ) ||
          movie.year.toString().includes(searchText)
        );
      });
      setFilteredMovies(filtered);
      
      // Lưu lịch sử tìm kiếm
      if (text.trim() && !searchHistory.includes(text.trim())) {
        const updatedHistory = [text.trim(), ...searchHistory.slice(0, 4)];
        setSearchHistory(updatedHistory);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredMovies([]);
    Animated.spring(inputScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const removeSearchHistory = (index: number) => {
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(index, 1);
    setSearchHistory(updatedHistory);
  };

  const renderMovieItem = ({ item, index }: { item: Movie; index: number }) => {
    const opacity = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    const translateY = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    return (
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }],
        }}
      >
        <TouchableOpacity
          style={styles.movieCard}
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: '/movie/[id]', params: { id: item.id } })}
        >
          <View style={styles.posterContainer}>
            <Image 
              source={{ uri: item.poster }} 
              style={styles.poster} 
              defaultSource={{ uri: 'https://via.placeholder.com/300x450' }}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.2)']}
              style={styles.posterGradient}
            />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating?.toFixed(1) || '0.0'}</Text>
            </View>
          </View>
          
          <View style={styles.movieInfo}>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            
            <View style={styles.categoryContainer}>
              {item.category?.slice(0, 2).map((cat, idx) => (
                <View key={idx} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.movieMeta}>
              <Text style={styles.metaText}>{item.year}</Text>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>{item.duration} phút</Text>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{item.price?.toLocaleString('vi-VN')}đ</Text>
              <TouchableOpacity style={styles.addToCartBtn}>
                <Ionicons name="add" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header với hiệu ứng blur */}
      <LinearGradient
        colors={['#0A0F1C', '#1A1F2C', '#2A2F3C']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color="#00E5FF" />
          </TouchableOpacity>
          
          <Animated.View style={[styles.searchContainer, { transform: [{ scale: inputScale }] }]}>
            <Ionicons name="search" size={22} color="#00E5FF" style={styles.searchIcon} />
            
            <TextInput
              style={styles.input}
              placeholder="Tìm kiếm phim, thể loại, năm..."
              placeholderTextColor="#8A8D9B"
              autoFocus={true}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={clearSearch} 
                style={styles.clearButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </LinearGradient>

      {/* Nội dung chính */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00E5FF" />
            <Text style={styles.loadingText}>Đang tải phim...</Text>
          </View>
        ) : (
          <>
            {/* Lịch sử tìm kiếm khi chưa có kết quả */}
            {filteredMovies.length === 0 && searchQuery.length === 0 && searchHistory.length > 0 && (
              <View style={styles.historySection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
                  <TouchableOpacity onPress={() => setSearchHistory([])}>
                    <Text style={styles.clearAllText}>Xóa tất cả</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.historyList}>
                  {searchHistory.map((term, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.historyItem}
                      onPress={() => handleSearch(term)}
                    >
                      <Ionicons name="time-outline" size={16} color="#8A8D9B" />
                      <Text style={styles.historyText} numberOfLines={1}>{term}</Text>
                      <TouchableOpacity 
                        onPress={() => removeSearchHistory(index)}
                        style={styles.removeHistoryBtn}
                      >
                        <Ionicons name="close" size={14} color="#666" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Đề xuất khi chưa tìm kiếm */}
            {filteredMovies.length === 0 && searchQuery.length === 0 && (
              <View style={styles.suggestionsSection}>
                <Text style={styles.sectionTitle}>Đề xuất tìm kiếm</Text>
                <View style={styles.suggestionsGrid}>
                  {['Hành động', 'Lãng mạn', 'Kinh dị', 'Hài hước', 'Hoạt hình', 'Khoa học viễn tưởng']
                    .map((term, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionChip}
                        onPress={() => handleSearch(term)}
                      >
                        <Text style={styles.suggestionText}>{term}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            )}

            {/* Kết quả tìm kiếm */}
            {filteredMovies.length > 0 ? (
              <>
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsCount}>
                    {filteredMovies.length} kết quả cho "{searchQuery}"
                  </Text>
                  <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={18} color="#00E5FF" />
                    <Text style={styles.filterText}>Lọc</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={filteredMovies}
                  keyExtractor={(item) => item.id}
                  renderItem={renderMovieItem}
                  numColumns={2}
                  scrollEnabled={false}
                  contentContainerStyle={styles.listContent}
                  columnWrapperStyle={styles.columnWrapper}
                  showsVerticalScrollIndicator={false}
                />
              </>
            ) : searchQuery.length > 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={80} color="#3A3E4B" />
                <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
                <Text style={styles.emptySubtitle}>
                  Không có phim nào khớp với "{searchQuery}"
                </Text>
                <TouchableOpacity 
                  style={styles.tryAgainButton}
                  onPress={() => handleSearch('')}
                >
                  <Text style={styles.tryAgainText}>Thử tìm kiếm khác</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1C',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'System',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.6,
  },
  loadingText: {
    color: '#8A8D9B',
    fontSize: 14,
    marginTop: 12,
  },
  historySection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  clearAllText: {
    fontSize: 13,
    color: '#00E5FF',
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  historyText: {
    flex: 1,
    color: '#E0E0E0',
    fontSize: 14,
    marginLeft: 12,
  },
  removeHistoryBtn: {
    padding: 4,
  },
  suggestionsSection: {
    marginBottom: 30,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 15,
  },
  suggestionChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  suggestionText: {
    color: '#00E5FF',
    fontSize: 13,
    fontWeight: '500',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsCount: {
    fontSize: 16,
    color: '#8A8D9B',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  filterText: {
    color: '#00E5FF',
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  movieCard: {
    width: (width - 60) / 2,
    backgroundColor: '#1A1F2C',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  posterContainer: {
    width: '100%',
    height: ((width - 60) / 2) * 1.4,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
  },
  movieInfo: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    height: 40,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderRadius: 6,
  },
  categoryText: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '500',
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  metaText: {
    color: '#8A8D9B',
    fontSize: 11,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00E5FF',
  },
  addToCartBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#252938',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8A8D9B',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: width * 0.7,
  },
  tryAgainButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  tryAgainText: {
    color: '#00E5FF',
    fontSize: 14,
    fontWeight: '500',
  },
});