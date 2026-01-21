import { db } from '@/configs/firebaseConfig';
import { generateShowtimes } from '@/services/showtimeGenerator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  FlatList, Image, SafeAreaView, ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

export default function ScheduleScreen() {
  const router = useRouter();
  const { filterMovieId } = useLocalSearchParams();

  // Tạo 7 ngày tới
  const dateTabs = useMemo(() => {
    const dates = [];
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        label: i === 0 ? 'H.Nay' : daysOfWeek[d.getDay()],
        dateNum: d.getDate().toString(),
        fullValue: d.toISOString().split('T')[0],
      });
    }
    return dates;
  }, []);

  const [movies, setMovies] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(dateTabs[0].fullValue);
  const [selectedCinemaId, setSelectedCinemaId] = useState('all');

  const loadData = async () => {
    try {
      setLoading(true);
      const [mSnap, cSnap, sSnap] = await Promise.all([
        getDocs(collection(db, 'movies')),
        getDocs(collection(db, 'cinemas')),
        getDocs(collection(db, 'showtimes'))
      ]);
      setMovies(mSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCinemas(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setShowtimes(sSnap.docs.map(d => d.data()));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async () => {
    await generateShowtimes();
    await loadData();
  };

  // --- LOGIC LỌC DỮ LIỆU CHÍNH ---
  const filteredList = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return showtimes
      .filter(st => {
        const matchDate = st.date === selectedDate;
        const matchCinema = selectedCinemaId === 'all' || st.cinemaId === selectedCinemaId;
        const matchMovie = filterMovieId ? st.movieId === filterMovieId : true;

        // Nếu là ngày hôm nay, kiểm tra xem còn suất chiếu nào chưa qua không
        if (matchDate && st.date === todayStr) {
          const hasFutureTime = st.times.some((t: string) => {
            const [h, m] = t.split(':').map(Number);
            return h > currentHour || (h === currentHour && m >= currentMinute);
          });
          // Nếu phim không còn suất nào trong tương lai thì loại bỏ khỏi danh sách hiển thị
          if (!hasFutureTime) return false;
        }

        return matchDate && matchCinema && matchMovie;
      })
      .map(st => ({
        ...st,
        movie: movies.find(m => m.id === st.movieId),
        cinema: cinemas.find(c => c.id === st.cinemaId)
      }))
      .filter(item => item.movie && item.cinema);
  }, [selectedDate, selectedCinemaId, showtimes, movies, filterMovieId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Lịch chiếu</Text>
        <TouchableOpacity style={styles.adminBtn} onPress={handleGenerate}>
          <Text style={styles.adminBtnText}>AUTO DATA</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{height: 80, marginBottom: 15}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingLeft: 20}}>
          {dateTabs.map((item) => (
            <TouchableOpacity 
              key={item.fullValue} 
              style={[styles.dateCard, selectedDate === item.fullValue && styles.activeDateCard]}
              onPress={() => setSelectedDate(item.fullValue)}
            >
              <Text style={[styles.dateLabel, selectedDate === item.fullValue && {color: '#fff'}]}>{item.label}</Text>
              <Text style={[styles.dateNum, selectedDate === item.fullValue && {color: '#fff'}]}>{item.dateNum}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{height: 45, marginBottom: 20}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingLeft: 20}}>
          <TouchableOpacity 
            style={[styles.cinemaChip, selectedCinemaId === 'all' && styles.activeCinemaChip]}
            onPress={() => setSelectedCinemaId('all')}
          >
            <Text style={[styles.chipText, selectedCinemaId === 'all' && {color: '#fff'}]}>Tất cả rạp</Text>
          </TouchableOpacity>
          {cinemas.map((c) => (
            <TouchableOpacity 
              key={c.id} 
              style={[styles.cinemaChip, selectedCinemaId === c.id && styles.activeCinemaChip]}
              onPress={() => setSelectedCinemaId(c.id)}
            >
              <Text style={[styles.chipText, selectedCinemaId === c.id && {color: '#fff'}]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color="#00E5FF" size="large" />
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={<Text style={{color: '#888', textAlign: 'center', marginTop: 20}}>Không còn suất chiếu nào trong hôm nay</Text>}
          renderItem={({ item }) => (
            <View style={styles.movieCard}>
              <View style={styles.movieRow}>
                <Image 
                  source={{ uri: item.movie?.post || item.movie?.poster }} 
                  style={styles.poster} 
                />
                <View style={styles.movieInfo}>
                  <Text style={styles.movieTitle}>{item.movie?.title}</Text>
                  <Text style={styles.cinemaName}>📍 {item.cinema?.name}</Text>
                </View>
              </View>

              <View style={styles.timeGrid}>
                {item.times
                  .filter((t: string) => {
                    // Lọc bỏ giờ đã qua nếu là ngày hôm nay
                    const now = new Date();
                    const todayStr = now.toISOString().split('T')[0];
                    if (item.date !== todayStr) return true; // Ngày mai, ngày kia... hiện hết

                    const currentHour = now.getHours();
                    const currentMinute = now.getMinutes();
                    const [h, m] = t.split(':').map(Number);
                    
                    return h > currentHour || (h === currentHour && m >= currentMinute);
                  })
                  .map((t: string) => {
                    const screeningId = `${item.movieId}_${item.cinemaId}_${item.date}_${t}`;
                    return (
                      <TouchableOpacity
                        key={t}
                        style={styles.timeBtn}
                        onPress={() =>
                          router.push({
                            pathname: '/movie/booking',
                            params: {
                              screeningId,
                              movieId: item.movieId,
                              title: item.movie?.title,
                              price: item.movie?.price,
                              time: t,
                              date: item.date,
                              cinemaName: item.cinema?.name,
                              image: item.movie?.post || item.movie?.poster,
                            },
                          })
                        }
                      >
                        <Text style={styles.timeText}>{t}</Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
}

// Giữ nguyên Stylesheet...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1C' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', padding: 20 },
  adminBtn: { backgroundColor: '#e21221', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  adminBtnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  dateCard: { width: 60, height: 75, backgroundColor: '#161626', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  activeDateCard: { backgroundColor: '#e21221' },
  dateLabel: { color: '#777', fontSize: 11 },
  dateNum: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cinemaChip: { paddingHorizontal: 15, height: 40, backgroundColor: '#161626', borderRadius: 20, justifyContent: 'center', marginRight: 10 },
  activeCinemaChip: { backgroundColor: '#00E5FF' },
  chipText: { color: '#888', fontSize: 13 },
  movieCard: { backgroundColor: '#161626', margin: 20, marginTop: 0, borderRadius: 20, padding: 15, marginBottom: 15 },
  movieRow: { flexDirection: 'row' },
  poster: { width: 70, height: 100, borderRadius: 10 },
  movieInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  movieTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cinemaName: { color: '#00E5FF', fontSize: 12, marginTop: 5 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 15 },
  timeBtn: { width: '30%', backgroundColor: '#1f1f2e', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  timeText: { color: '#fff', fontWeight: 'bold' }
});