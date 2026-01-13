import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Lấy dữ liệu từ params (đảm bảo tên biến khớp với trang Booking/Checkout gửi sang)
  const { screeningId, movieId, title, seats, total, time, date, cinema } = params;

  useEffect(() => {
    saveBooking();
  }, []);

  const saveBooking = async () => {
    try {
      // CHUYỂN ĐỔI: ghế từ chuỗi "A1, A2" thành mảng ["A1", "A2"] để trang Tickets dùng được hàm .join()
      const seatsArray = typeof seats === 'string' ? seats.split(', ') : seats;

      await addDoc(collection(db, 'bookings'), {
        userId: auth.currentUser?.uid,
        screeningId: screeningId, 
        movieId: movieId,
        movieTitle: title,
        
        // ĐỔI TÊN TRƯỜNG ĐỂ KHỚP VỚI TRANG TICKETS CỦA BẠN
        theater: cinema,       // Trang Tickets dùng 'theater'
        showDate: date,       // Trang Tickets dùng 'showDate'
        showTime: time,       // Trang Tickets dùng 'showTime'
        
        seats: seatsArray,     // Lưu dạng mảng
        totalAmount: Number(total || 0), // Lưu dạng số
        paymentMethod: "Ví MoMo",
        status: "PAID",
        createdAt: serverTimestamp() 
      });
      console.log("✅ Đã lưu vé thành công!");
    } catch (error) {
      console.error("❌ Lỗi lưu vé:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={100} color="#4caf50" />
      <Text style={styles.title}>Thanh toán thành công!</Text>
      <Text style={styles.sub}>Ghế {seats} của bạn đã được đặt.</Text>
      
      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.btnTxt}>VỀ TRANG CHỦ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1C', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  sub: { color: '#888', marginTop: 10, textAlign: 'center', paddingHorizontal: 40 },
  btn: { marginTop: 40, backgroundColor: '#e21221', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 12 },
  btnTxt: { color: '#fff', fontWeight: 'bold' }
});