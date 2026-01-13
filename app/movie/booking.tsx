import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookingScreen() {
  const router = useRouter();
  const { screeningId, movieId, title, price, time, date, cinemaName, image } = useLocalSearchParams();
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  // RÀNG BUỘC GHẾ THEO SCREENING ID
  useEffect(() => {
    if (!screeningId) return;

    const q = query(
      collection(db, 'bookings'),
      where('screeningId', '==', screeningId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booked = new Set<string>();
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.seats) {
          // Xử lý cả dạng mảng ['A1'] hoặc chuỗi 'A1, A2'
          const seatData = Array.isArray(data.seats) ? data.seats : data.seats.split(', ');
          seatData.forEach((s: string) => booked.add(s.trim()));
        }
      });
      setBookedSeats(Array.from(booked));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [screeningId]);

  const toggleSeat = (id: string) => {
    if (bookedSeats.includes(id)) return;
    setSelectedSeats(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : (prev.length < 8 ? [...prev, id] : prev)
    );
  };

const handleNext = () => {
  if (selectedSeats.length === 0) return Alert.alert("Lỗi", "Hãy chọn ghế");
  if (!auth.currentUser) return router.push('/(auth)/login');

  const totalValue = selectedSeats.length * Number(price || 0);

  router.push({
    pathname: '/checkout',
    params: {
      screeningId: screeningId as string,
      movieId: movieId as string,
      title: title as string,
      image: image as string,
      price: price as string,
      time: time as string,
      date: date as string,
      cinema: cinemaName as string,
      seats: selectedSeats.join(', '), 
      totalPrice: totalValue.toString(), // <--- CHUẨN HÓA TÊN BIẾN LÀ totalPrice
    }
  });
};
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color="#fff" /></TouchableOpacity>
        <View style={{flex: 1, marginLeft: 15}}><Text style={styles.title}>{title}</Text><Text style={styles.sub}>{cinemaName} • {time}</Text></View>
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 120}}>
        <View style={styles.screen}><View style={styles.screenLine} /><Text style={styles.screenTxt}>MÀN HÌNH</Text></View>

        {loading ? <ActivityIndicator color="#00E5FF" /> : (
          <View style={styles.map}>
            {rows.map(row => (
              <View key={row} style={styles.row}>
                <Text style={styles.rowLbl}>{row}</Text>
                {cols.map(col => {
                  const sId = `${row}${col}`;
                  const isS = selectedSeats.includes(sId);
                  const isB = bookedSeats.includes(sId);
                  return (
                    <TouchableOpacity 
                        key={sId} 
                        disabled={isB} 
                        onPress={() => toggleSeat(sId)}
                        style={[styles.seat, isS && styles.seatS, isB && styles.seatB]}
                    >
                      <Text style={[styles.sNum, isS && {color:'#fff'}]}>{isB ? 'x' : col}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View><Text style={styles.fTotal}>{(selectedSeats.length * Number(price)).toLocaleString()}đ</Text><Text style={styles.fSeats}>{selectedSeats.join(', ')}</Text></View>
        <TouchableOpacity style={styles.btn} onPress={handleNext}><Text style={styles.btnTxt}>TIẾP TỤC</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1C' },
  header: { flexDirection: 'row', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#222' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  sub: { color: '#888', fontSize: 12 },
  screen: { alignItems: 'center', marginVertical: 30 },
  screenLine: { width: '80%', height: 3, backgroundColor: '#00E5FF', borderRadius: 2 },
  screenTxt: { color: '#333', fontSize: 10, marginTop: 5 },
  map: { paddingHorizontal: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  rowLbl: { color: '#444', width: 20, fontWeight: 'bold' },
  seat: { width: 32, height: 32, backgroundColor: '#161626', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  seatS: { backgroundColor: '#00E5FF' },
  seatB: { backgroundColor: '#2a2a3a' },
  sNum: { color: '#555', fontSize: 10 },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#161626', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fTotal: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  fSeats: { color: '#00E5FF', fontSize: 12 },
  btn: { backgroundColor: '#e21221', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
  btnTxt: { color: '#fff', fontWeight: 'bold' }
});