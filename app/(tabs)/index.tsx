import { db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  // State Management
  const [movies, setMovies] = useState<any[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  
  // Refs
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const featuredListRef = useRef<FlatList>(null);
  const router = useRouter();
  
  // Categories with enhanced data
  const categories = [
    { id: 'all', name: 'Tất cả', icon: 'film', color: '#00E5FF' },
    { id: 'action', name: 'Hành động', icon: 'flash', color: '#FF4081' },
    { id: 'adventure', name: 'Phiêu lưu', icon: 'compass', color: '#FF9100' },
    { id: 'sci-fi', name: 'Sci-Fi', icon: 'planet', color: '#00E5FF' },
    { id: 'comedy', name: 'Hài', icon: 'happy', color: '#FFD600' },
    { id: 'drama', name: 'Drama', icon: 'sad', color: '#9C27B0' },
    { id: 'romance', name: 'Lãng mạn', icon: 'heart', color: '#E91E63' },
    { id: 'horror', name: 'Kinh dị', icon: 'skull', color: '#607D8B' },
  ];

  // Header Animation Values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 80],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const moviesSnapshot = await getDocs(collection(db, 'movies'));
      const moviesList = moviesSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        rating: doc.data().rating || 0,
        year: doc.data().year || 2024,
        duration: doc.data().duration || '120',
      }));
      
      setMovies(moviesList);
      setFilteredMovies(moviesList);
      
      // Get top 5 rated movies for featured section
      const sorted = [...moviesList].sort((a, b) => b.rating - a.rating);
      setFeaturedMovies(sorted.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMovies();
    setRefreshing(false);
  }, []);

  const filterByCategory = (catId: string) => {
    setSelectedCat(catId);
    if (catId === 'all') {
      setFilteredMovies(movies);
    } else {
      const selectedCategory = categories.find(c => c.id === catId);
      if (selectedCategory) {
        const filtered = movies.filter(m => 
          m.category && m.category.some((c: string) => 
            c.toLowerCase().includes(selectedCategory.name.toLowerCase())
          )
        );
        setFilteredMovies(filtered);
      }
    }
  };

  // Featured Carousel Item
  // eslint-disable-next-line react/display-name
  const FeaturedItem = React.memo(({ item, index }: { item: any; index: number }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [-width * 0.3, 0, width * 0.3],
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.featuredItem,
          {
            transform: [{ translateX }, { scale }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/movie/[id]', params: { id: item.id } })}
          style={styles.featuredCard}
        >
          <Image
            source={{ uri: item.poster }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
            style={styles.featuredGradient}
          />

          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating?.toFixed(1)}</Text>
          </View>

          {/* Movie Info Overlay */}
          <View style={styles.featuredInfo}>
            <View style={styles.featuredHeader}>
              <Text style={styles.featuredTitle} numberOfLines={2}>
                {item.title}
              </Text>
              
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#fff" />
                  <Text style={styles.metaText}>{item.duration} phút</Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color="#fff" />
                  <Text style={styles.metaText}>{item.year}</Text>
                </View>
                
                <View style={styles.hdBadge}>
                  <Text style={styles.hdText}>4K</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.watchButton}
              onPress={() => router.push({ pathname: '/movie/[id]', params: { id: item.id } })}
            >
              <Ionicons name="play" size={20} color="#fff" />
              <Text style={styles.watchButtonText}>Xem ngay</Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  });

  // Movie Grid Item
  // eslint-disable-next-line react/display-name
  const MovieItem = React.memo(({ item }: { item: any; index: number }) => {
    const [pressed, setPressed] = useState(false);
    
    return (
      <TouchableOpacity
        style={[
          styles.movieItem,
          pressed && styles.movieItemPressed,
        ]}
        activeOpacity={0.9}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={() => router.push({ pathname: '/movie/[id]', params: { id: item.id } })}
      >
        <View style={styles.moviePosterContainer}>
          <Image
            source={{ uri: item.poster }}
            style={styles.moviePoster}
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.movieGradient}
          />

          {/* Rating Overlay */}
          <View style={styles.movieRating}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.movieRatingText}>{item.rating?.toFixed(1)}</Text>
          </View>

          {/* Play Button Overlay */}
          <View style={styles.playOverlay}>
            <Ionicons name="play-circle" size={40} color="#fff" />
          </View>
        </View>

        <View style={styles.movieDetails}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.genreContainer}>
            {item.category?.slice(0, 2).map((cat: string, idx: number) => (
              <View key={idx} style={styles.genreBadge}>
                <Text style={styles.genreText}>{cat}</Text>
              </View>
            ))}
          </View>

          <View style={styles.movieFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceSymbol}>₫</Text>
              <Text style={styles.priceAmount}>
                {item.price?.toLocaleString()}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => router.push({ pathname: '/movie/[id]', params: { id: item.id } })}
            >
              <Text style={styles.bookButtonText}>Đặt vé</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  // Category Item
  // eslint-disable-next-line react/display-name
  const CategoryItem = React.memo(({ 
    item, 
    isActive, 
    onPress 
  }: { 
    item: any; 
    isActive: boolean; 
    onPress: (id: string) => void;
  }) => {
    const category = categories.find(c => c.id === item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isActive && styles.categoryItemActive,
          isActive && { borderColor: category?.color || '#00E5FF' }
        ]}
        onPress={() => onPress(item.id)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isActive ? 
            [category?.color || '#00E5FF', category?.color + '80' || '#00E5FF80'] : 
            ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
          }
          style={styles.categoryIcon}
        >
          <Ionicons 
            name={item.icon as any} 
            size={22} 
            color={isActive ? '#fff' : category?.color || '#00E5FF'} 
          />
        </LinearGradient>
        <Text style={[
          styles.categoryName,
          isActive && styles.categoryNameActive,
          isActive && { color: category?.color || '#00E5FF' }
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  });

  // Loading Screen
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#0A1D37', '#1A237E', '#311B92']}
          style={styles.loadingBackground}
        >
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#00E5FF" />
            <View style={styles.loadingTextWrapper}>
              <Text style={styles.loadingTitle}>Cinema Pro</Text>
              <Text style={styles.loadingSubtitle}>Đang tải rạp phim của bạn</Text>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          { 
            height: headerHeight,
            opacity: headerOpacity,
          }
        ]}
      >
        <LinearGradient
          colors={['#0A1D37', '#1A237E']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.userName}>Khán giả thân thiết</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
            >
              <LinearGradient
                colors={['#00E5FF', '#2979FF']}
                style={styles.profileIcon}
              >
                <Ionicons name="person" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            style={styles.searchContainer}
            onPress={() => router.push('/search')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
              style={styles.searchBar}
            >
              <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" />
              <Text style={styles.searchPlaceholder}>Tìm kiếm phim, diễn viên...</Text>
              <View style={styles.filterButton}>
                <Ionicons name="options" size={18} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00E5FF']}
            tintColor="#00E5FF"
            progressBackgroundColor="#1A237E"
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Movies Carousel */}
        {featuredMovies.length > 0 && (
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <LinearGradient
                  colors={['#FF4081', '#FF9100']}
                  style={styles.titleIcon}
                >
                  <Ionicons name="flame" size={18} color="#fff" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>ĐANG HOT</Text>
              </View>
              
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>Xem tất cả</Text>
                <Ionicons name="chevron-forward" size={16} color="#00E5FF" />
              </TouchableOpacity>
            </View>

            <Animated.FlatList
              ref={featuredListRef}
              data={featuredMovies}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={width - 40}
              decelerationRate="fast"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => (
                <FeaturedItem item={item} index={index} />
              )}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.featuredList}
            />

            {/* Custom Pagination */}
            <View style={styles.paginationContainer}>
              {featuredMovies.map((_, index) => {
                const inputRange = [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ];

                const dotWidth = scrollX.interpolate({
                  inputRange,
                  outputRange: [8, 24, 8],
                  extrapolate: 'clamp',
                });

                const dotOpacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.4, 1, 0.4],
                  extrapolate: 'clamp',
                });

                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.paginationDot,
                      {
                        width: dotWidth,
                        opacity: dotOpacity,
                      }
                    ]}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <LinearGradient
                colors={['#00E5FF', '#2979FF']}
                style={styles.titleIcon}
              >
                <Ionicons name="apps" size={18} color="#fff" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>THỂ LOẠI</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((item) => (
              <CategoryItem
                key={item.id}
                item={item}
                isActive={selectedCat === item.id}
                onPress={filterByCategory}
              />
            ))}
          </ScrollView>
        </View>

        {/* Movies Grid */}
        <View style={styles.moviesSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <LinearGradient
                colors={['#7B1FA2', '#E91E63']}
                style={styles.titleIcon}
              >
                <Ionicons name="film" size={18} color="#fff" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>
                {selectedCat === 'all' ? 'TẤT CẢ PHIM' : 
                 categories.find(c => c.id === selectedCat)?.name.toUpperCase()}
                <Text style={styles.movieCount}> • {filteredMovies.length}</Text>
              </Text>
            </View>

            <TouchableOpacity style={styles.sortButton}>
              <Ionicons name="funnel" size={18} color="#00E5FF" />
              <Text style={styles.sortText}>Lọc</Text>
            </TouchableOpacity>
          </View>

          {filteredMovies.length > 0 ? (
            <View style={styles.moviesGrid}>
              {filteredMovies.map((item, index) => (
                <MovieItem key={item.id} item={item} index={index} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={['rgba(0,229,255,0.1)', 'rgba(41,121,255,0.05)']}
                style={styles.emptyIconContainer}
              >
                <Ionicons name="film-outline" size={64} color="#00E5FF" />
              </LinearGradient>
              <Text style={styles.emptyTitle}>Không tìm thấy phim</Text>
              <Text style={styles.emptyDescription}>
                Không có phim nào trong thể loại này
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => filterByCategory('all')}
              >
                <Text style={styles.emptyButtonText}>Xem tất cả phim</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#0A0F1C',
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
  },
  loadingBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingTextWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  
  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  profileButton: {
    marginLeft: 15,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  // Search
  searchContainer: {
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  filterButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,229,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.3)',
  },
  
  // Scroll Content
  scrollContent: {
    paddingTop: 180,
    paddingBottom: 100,
  },
  
  // Section Common
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#00E5FF',
    fontWeight: '600',
  },
  
  // Featured Section
  featuredSection: {
    marginBottom: 30,
  },
  featuredList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  featuredItem: {
    width: width - 40,
    marginRight: 20,
  },
  featuredCard: {
    height: width * 0.6,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1A237E',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 2,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  featuredInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    zIndex: 2,
  },
  featuredHeader: {
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  hdBadge: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hdText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00E5FF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    alignSelf: 'flex-start',
    gap: 10,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E5FF',
  },
  
  // Categories Section
  categoriesSection: {
    marginBottom: 30,
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryItemActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryName: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryNameActive: {
    fontWeight: 'bold',
  },
  
  // Movies Section
  moviesSection: {
    paddingHorizontal: 20,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,229,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.2)',
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    color: '#00E5FF',
    fontWeight: '600',
  },
  movieCount: {
    fontSize: 16,
    color: '#FF4081',
    fontWeight: '600',
  },
  moviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  // Movie Item
  movieItem: {
    width: (width - 60) / 2,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    transform: [{ scale: 1 }],
    // transition: 'transform 0.2s ease',
  },
  movieItemPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  moviePosterContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  moviePoster: {
    width: '100%',
    height: '100%',
  },
  movieGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  movieRating: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  movieRatingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,229,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  movieDetails: {
    padding: 16,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    lineHeight: 22,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 15,
  },
  genreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(41,121,255,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(41,121,255,0.3)',
  },
  genreText: {
    fontSize: 11,
    color: '#2979FF',
    fontWeight: '600',
  },
  movieFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceSymbol: {
    fontSize: 14,
    color: '#FF4081',
    fontWeight: 'bold',
    marginRight: 2,
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  bookButton: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#FF4081',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(0,229,255,0.2)',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: '80%',
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: '#00E5FF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Bottom Spacing
  bottomSpacing: {
    height: 40,
  },
});