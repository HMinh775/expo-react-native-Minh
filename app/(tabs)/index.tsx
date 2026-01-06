<<<<<<< HEAD
import { db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const FEATURED_HEIGHT = width * 0.55;

export default function HomeScreen() {
  const [movies, setMovies] = useState<any[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, icon: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const CATEGORY_ICONS = {
    'all': 'film',
    'action': 'flash',
    'adventure': 'compass',
    'sci-fi': 'planet',
    'animation': 'happy',
    'comedy': 'happy',
    'romance': 'heart',
    'drama': 'sad',
    'horror': 'skull',
    'fantasy': 'sparkles',
    'thriller': 'alert',
    'mystery': 'search',
  };

  useEffect(() => {
    fetchMoviesAndCategories();
  }, []);

  const fetchMoviesAndCategories = async () => {
    try {
      setLoading(true);
      
      const moviesSnapshot = await getDocs(collection(db, 'movies'));
      const moviesList = moviesSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        rating: doc.data().rating || 0
      }));
      setMovies(moviesList);
      setFilteredMovies(moviesList);
      
      const sorted = [...moviesList].sort((a, b) => b.rating - a.rating);
      setFeaturedMovies(sorted.slice(0, 4));
      
      const defaultCategories = [
        { id: 'all', name: 'Tất cả', icon: 'film' },
        { id: 'action', name: 'Hành động', icon: 'flash' },
        { id: 'adventure', name: 'Phiêu lưu', icon: 'compass' },
        { id: 'sci-fi', name: 'Khoa học viễn tưởng', icon: 'planet' },
        { id: 'animation', name: 'Hoạt hình', icon: 'happy' },
        { id: 'comedy', name: 'Hài hước', icon: 'happy' },
        { id: 'romance', name: 'Lãng mạn', icon: 'heart' },
        { id: 'drama', name: 'Tâm lý', icon: 'sad' },
      ];
      
      setCategories(defaultCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const renderFeaturedItem = ({ item, index }: { item: any; index: number }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [0, -10, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.featuredItemWrapper,
          { transform: [{ translateY }] }
        ]}
      >
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => router.push({ pathname: '/movie/[id]', params: { id: item.id } })}
          activeOpacity={0.9}
        >
          <Image 
            source={{ uri: item.poster }} 
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <View style={styles.featuredGradient} />
          <View style={styles.featuredContent}>
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.featuredBadgeText}>{item.rating?.toFixed(1)}</Text>
            </View>
            <Text style={styles.featuredTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.featuredInfoRow}>
              <View style={styles.featuredInfo}>
                <Ionicons name="time-outline" size={14} color="#fff" />
                <Text style={styles.featuredInfoText}>{item.duration || '120'} phút</Text>
              </View>
              <View style={styles.featuredInfo}>
                <Ionicons name="eye" size={14} color="#fff" />
                <Text style={styles.featuredInfoText}>HD</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.featuredButton}
              onPress={() => router.push({ pathname: '/movie/[id]', params: { id: item.id } })}
            >
              <Text style={styles.featuredButtonText}>Chi tiết</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => router.push({ pathname: '/movie/[id]', params: { id: item.id } })}
      activeOpacity={0.8}
    >
      <View style={styles.moviePosterContainer}>
        <Image 
          source={{ uri: item.poster }} 
          style={styles.moviePoster}
          resizeMode="cover"
        />
        <View style={styles.posterOverlay} />
        <View style={styles.movieRating}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.movieRatingText}>{item.rating?.toFixed(1)}</Text>
        </View>
      </View>
      
      <View style={styles.movieContent}>
        <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
        
        <View style={styles.categoryChips}>
          {item.category?.slice(0, 2).map((cat: string, idx: number) => (
            <View key={idx} style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{cat}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.movieFooter}>
          <View style={styles.movieMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={12} color="#666" />
              <Text style={styles.metaText}>{item.duration || '120'} phút</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="trending-up" size={12} color="#666" />
              <Text style={styles.metaText}>18+</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{item.price?.toLocaleString()}đ</Text>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => router.push({ 
                pathname: '/movie/[id]', 
                params: { id: item.id } 
              })}
            >
              <Text style={styles.bookButtonText}>Đặt vé</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xin chào!</Text>
          <Text style={styles.userName}>Khách hàng thân thiết</Text>
        </View>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-circle" size={40} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity 
        style={styles.searchContainer}
        onPress={() => router.push('/search')}
      >
        <View style={styles.searchIconContainer}>
          <Ionicons name="search" size={20} color="#fff" />
        </View>
        <Text style={styles.searchPlaceholder}>Tìm kiếm phim yêu thích...</Text>
        <View style={styles.filterBadge}>
          <Ionicons name="options" size={16} color="#FF6B6B" />
        </View>
      </TouchableOpacity>

      {/* Featured Movies */}
      {featuredMovies.length > 0 && (
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phim đang hot 🔥</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>Xem thêm</Text>
              <Ionicons name="chevron-forward" size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
          
          <Animated.FlatList
            data={featuredMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={width - 40}
            decelerationRate="fast"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            renderItem={renderFeaturedItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.featuredList}
          />
          
          <View style={styles.pagination}>
            {featuredMovies.map((_, i) => {
              const inputRange = [
                (i - 1) * width,
                i * width,
                (i + 1) * width,
              ];
              
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 20, 8],
                extrapolate: 'clamp',
              });
              
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.paginationDot,
                    { width: dotWidth, opacity }
                  ]}
                />
              );
            })}
          </View>
        </View>
      )}

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Thể loại phim</Text>
        <View style={styles.categoriesGrid}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                selectedCat === cat.id && styles.categoryCardActive
              ]}
              onPress={() => filterByCategory(cat.id)}
            >
              <View style={[
                styles.categoryIconContainer,
                selectedCat === cat.id && styles.categoryIconContainerActive
              ]}>
                <Ionicons 
                  name={cat.icon as any} 
                  size={24} 
                  color={selectedCat === cat.id ? '#fff' : '#FF6B6B'} 
                />
              </View>
              <Text style={[
                styles.categoryName,
                selectedCat === cat.id && styles.categoryNameActive
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Movies List */}
      <View style={styles.moviesSection}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {selectedCat === 'all' ? 'Tất cả phim' : categories.find(c => c.id === selectedCat)?.name}
            <Text style={styles.listCount}> • {filteredMovies.length} phim</Text>
          </Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="funnel" size={16} color="#666" />
            <Text style={styles.filterText}>Lọc</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredMovies}
          keyExtractor={item => item.id}
          renderItem={renderMovieItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.moviesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="film-outline" size={50} color="#ccc" />
              </View>
              <Text style={styles.emptyTitle}>Không tìm thấy phim</Text>
              <Text style={styles.emptySubtitle}>
                Không có phim nào thuộc thể loại này
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => setSelectedCat('all')}
              >
                <Text style={styles.emptyButtonText}>Xem tất cả phim</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </View>
=======
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
>>>>>>> 7bd92f365153ec1161411497496a958028054476
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e9ecef',
  },
  searchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    color: '#888',
    fontSize: 16,
  },
  filterBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moreButtonText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  featuredList: {
    paddingLeft: 24,
  },
  featuredItemWrapper: {
    width: width - 48,
    marginRight: 16,
  },
  featuredCard: {
    height: FEATURED_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
    backdropFilter: 'blur(10px)',
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
    marginBottom: 8,
  },
  featuredInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  featuredInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredInfoText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  featuredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
    gap: 6,
  },
  featuredButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
  },
  categoriesSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 72) / 4,
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryCardActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#FF6B6B',
  },
  categoryIconContainerActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#fff',
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryNameActive: {
    color: '#fff',
    fontWeight: '600',
  },
  moviesSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    gap: 4,
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  moviesList: {
    paddingBottom: 40,
  },
  movieCard: {
    width: (width - 56) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  moviePosterContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  moviePoster: {
    width: '100%',
    height: '100%',
  },
  posterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  movieRating: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  movieRatingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  movieContent: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  categoryChipText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  movieFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieMeta: {
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    color: '#666',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  bookButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: '80%',
  },
  emptyButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
=======
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
>>>>>>> 7bd92f365153ec1161411497496a958028054476
