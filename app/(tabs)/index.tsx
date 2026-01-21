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
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

// --- CẤU HÌNH KÍCH THƯỚC CHUẨN ---
const SPACING = 20;
const GAP = 15;
const CARD_WIDTH = (width - (SPACING * 2) - GAP) / 2;
const BANNER_WIDTH = width - (SPACING * 2);
const BANNER_HEIGHT = height * 0.45;

interface Movie {
  id: string;
  title: string;
  poster: string;
  category: string[];
  rating: number;
  year: number;
  duration: string;
  price: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (!refreshing) setLoading(true);
      
      const [moviesSnap, catsSnap] = await Promise.all([
        getDocs(collection(db, 'movies')),
        getDocs(collection(db, 'categories'))
      ]);

      const moviesList = moviesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        category: doc.data().category || [],
        rating: Number(doc.data().rating) || 0,
      })) as Movie[];
      
      const catsList = catsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];

      setMovies(moviesList);
      setFilteredMovies(moviesList);
      setFeaturedMovies([...moviesList].sort((a, b) => b.rating - a.rating).slice(0, 5));
      setCategories([{ id: 'all', name: 'Tất cả', icon: 'grid-outline', color: '#00E5FF' }, ...catsList]);
      
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterByCategory = (catId: string, catName: string) => {
    setSelectedCat(catId);
    if (catId === 'all') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(m =>
        m.category?.some(c => c.toLowerCase().includes(catName.toLowerCase()))
      );
      setFilteredMovies(filtered);
    }
  };

  // --- RENDER HEADER COMPONENTS ---
  const renderHeader = () => (
    <View style={{ paddingBottom: 10 }}>
      {/* User Info */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.userName}>Chào khán giả, 👋</Text>
          <Text style={styles.subUser}>Hôm nay xem gì nhỉ?</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.avatarBorder}>
          <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')}>
        <Ionicons name="search" size={20} color="#888" />
        <Text style={styles.searchText}>Tìm phim, rạp chiếu...</Text>
        <Ionicons name="options-outline" size={20} color="#00E5FF" />
      </TouchableOpacity>

      {/* Featured Banner */}
      <Text style={styles.sectionTitle}>Đang Hot 🔥</Text>
      <FlatList
        data={featuredMovies}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        decelerationRate="fast"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        keyExtractor={(item) => `featured-${item.id}`}
        renderItem={({ item, index }) => {
          const scale = scrollX.interpolate({
            inputRange: [(index - 1) * width, index * width, (index + 1) * width],
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });
          return (
            <View style={{ width: width, alignItems: 'center' }}>
              <Animated.View style={[styles.bannerCard, { transform: [{ scale }] }]}>
                <TouchableOpacity activeOpacity={0.9} style={{flex: 1}} onPress={() => router.push(`/movie/${item.id}`)}>
                  <Image source={{ uri: item.poster }} style={styles.bannerImg} />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.95)']} style={styles.bannerGradient} />
                  <View style={styles.bannerInfo}>
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                    <View style={styles.bannerMeta}>
                       <Ionicons name="star" size={14} color="#FFD700" />
                       <Text style={styles.bannerRating}>{item.rating.toFixed(1)}</Text>
                       <Text style={styles.bannerDots}>•</Text>
                       <Text style={styles.bannerMetaText}>{item.year} • {item.duration}p</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          );
        }}
      />

      {/* Categories */}
      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Thể loại</Text>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        keyExtractor={(item) => `cat-${item.id}`}
        renderItem={({ item }) => {
          const isActive = selectedCat === item.id;
          return (
            <TouchableOpacity 
              style={styles.catItem} 
              onPress={() => filterByCategory(item.id, item.name)}
            >
              <View style={[styles.catIcon, { backgroundColor: isActive ? item.color : '#161626' }]}>
                <Ionicons name={item.icon as any} size={22} color={isActive ? '#fff' : item.color} />
              </View>
              <Text style={[styles.catName, isActive && { color: '#fff' }]}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.moviesHeader}>
        <Text style={styles.sectionTitle}>
            {selectedCat === 'all' ? 'Mới cập nhật' : `Phim ${categories.find(c => c.id === selectedCat)?.name}`}
        </Text>
        <Text style={styles.countText}>{filteredMovies.length} phim</Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00E5FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={filteredMovies}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.movieRow}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} tintColor="#00E5FF" />}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.movieCard} 
            onPress={() => router.push(`/movie/${item.id}`)}
          >
            <View style={styles.posterBox}>
              <Image source={{ uri: item.poster }} style={styles.posterImg} />
              <View style={styles.ratingTag}>
                <Ionicons name="star" size={10} color="#FFD700" />
                <Text style={styles.ratingTagText}>{item.rating.toFixed(1)}</Text>
              </View>
            </View>
            <View style={styles.movieDetails}>
              <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.moviePrice}>{item.price.toLocaleString()}₫</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="film-outline" size={50} color="#333" />
            <Text style={styles.emptyText}>Không tìm thấy phim phù hợp</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1C' },
  loading: { flex: 1, backgroundColor: '#0A0F1C', justifyContent: 'center', alignItems: 'center' },
  
  // Header styles
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING },
  userName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  subUser: { color: '#888', fontSize: 13, marginTop: 4 },
  avatarBorder: { borderWidth: 2, borderColor: '#00E5FF', borderRadius: 25, padding: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  
  searchBar: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#161626', 
    marginHorizontal: SPACING, padding: 12, borderRadius: 15, marginBottom: 20,
    borderWidth: 1, borderColor: '#252938'
  },
  searchText: { color: '#666', flex: 1, marginLeft: 10, fontSize: 14 },
  
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: SPACING, marginBottom: 15 },
  
  // Banner
  bannerCard: { width: BANNER_WIDTH, height: BANNER_HEIGHT, borderRadius: 25, overflow: 'hidden', backgroundColor: '#161626' },
  bannerImg: { width: '100%', height: '100%' },
  bannerGradient: { ...StyleSheet.absoluteFillObject },
  bannerInfo: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  bannerMeta: { flexDirection: 'row', alignItems: 'center' },
  bannerRating: { color: '#FFD700', marginLeft: 5, fontWeight: 'bold', fontSize: 14 },
  bannerDots: { color: '#666', marginHorizontal: 8 },
  bannerMetaText: { color: '#ccc', fontSize: 12 },

  // Categories
  catItem: { alignItems: 'center', marginRight: 20, width: 70 },
  catIcon: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catName: { color: '#888', fontSize: 11, fontWeight: '600' },

  // Grid Movies
  moviesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  countText: { color: '#00E5FF', fontSize: 12, marginRight: SPACING, marginBottom: 15 },
  movieRow: { justifyContent: 'space-between', paddingHorizontal: SPACING },
  movieCard: { width: CARD_WIDTH, marginBottom: 20 },
  posterBox: { width: CARD_WIDTH, height: CARD_WIDTH * 1.5, borderRadius: 20, overflow: 'hidden', backgroundColor: '#161626' },
  posterImg: { width: '100%', height: '100%' },
  ratingTag: { 
    position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.8)', 
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 
  },
  ratingTagText: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginLeft: 3 },
  movieDetails: { marginTop: 10, paddingHorizontal: 5 },
  movieTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  moviePrice: { color: '#00E5FF', fontSize: 13, marginTop: 4, fontWeight: '600' },

  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#666', marginTop: 10, fontSize: 14 }
});