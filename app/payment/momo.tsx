import { auth, db } from '@/configs/firebaseConfig'; // Thêm import này
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'; // Thêm import này
import React, { useMemo } from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MomoPayment() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Lấy toàn bộ params

  // --- LẤY ĐẦY ĐỦ CÁC BIẾN TỪ PARAMS ĐỂ KHÔNG BỊ UNDEFINED ---
  const { 
    totalPrice, 
    title, 
    screeningId, 
    movieId, 
    seats, 
    date, 
    time, 
    cinema 
  } = params;

  // --- THÔNG TIN THẬT CỦA BẠN ---
  const MOMO_PHONE = "1036467062"; 
  const FULL_NAME = "HO CONG MINH"; 

  const qrUrl = useMemo(() => {
    const amount = totalPrice || 0;
    const message = `Thanh toan ve ${title}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const momoPayload = `2|99|${MOMO_PHONE}|${FULL_NAME}||0|0|${amount}|${message}|transfer_myqr`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(momoPayload)}`;
  }, [totalPrice, title]);

  // --- HÀM XỬ LÝ LƯU VÉ VÀO FIREBASE ---
  const handleConfirm = async () => {
    // KIỂM TRA NẾU THIẾU DỮ LIỆU THÌ BÁO LỖI LUÔN, KHÔNG ĐỂ FIREBASE BÁO LỖI UNDEFINED
    if (!screeningId || !movieId) {
      console.error("Lỗi: screeningId hoặc movieId bị undefined", { screeningId, movieId });
      Alert.alert("Lỗi", "Dữ liệu vé bị thiếu, vui lòng quay lại trang đặt vé.");
      return;
    }

    try {
      // Lưu vào collection 'bookings' hoặc 'tickets' tùy bạn đặt tên
      await addDoc(collection(db, "bookings"), {
        userId: auth.currentUser?.uid,
        screeningId: screeningId, // Lấy từ params
        movieId: movieId,         // Lấy từ params
        movieTitle: title,
        seats: typeof seats === 'string' ? seats.split(', ') : seats,
        date: date,
        time: time,
        cinemaName: cinema,
        totalPrice: Number(totalPrice),
        status: "PAID",
        paymentMethod: "MoMo",
        createdAt: serverTimestamp(),
      });

      // Lưu xong mới chuyển sang trang thành công
      router.replace('/payment/success' as any);
    } catch (e) {
      console.error("Lỗi lưu vé:", e);
      Alert.alert("Lỗi", "Không thể lưu thông tin đặt vé. Vui lòng thử lại.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' }} style={styles.logo} />
        <Text style={styles.title}>Thanh toán MoMo</Text>
        
        <View style={styles.qrBox}>
          <Image source={{ uri: qrUrl }} style={styles.qrImage} />
        </View>

        <Text style={styles.price}>{Number(totalPrice).toLocaleString()} đ</Text>
        <Text style={styles.guide}>Mở App MoMo {"\n"} [Quét mã] để tự điền tiền</Text>

        {/* Gọi hàm handleConfirm khi bấm nút */}
        <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
          <Text style={styles.btnText}>Xác nhận đã chuyển khoản</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1C', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 30, padding: 25, alignItems: 'center' },
  logo: { width: 50, height: 50, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#af206b' },
  qrBox: { padding: 10, backgroundColor: '#f4f4f4', borderRadius: 20, marginTop: 15 },
  qrImage: { width: 250, height: 250 },
  price: { fontSize: 26, fontWeight: 'bold', color: '#af206b', marginTop: 15 },
  guide: { textAlign: 'center', color: '#666', marginTop: 10, fontSize: 13, lineHeight: 20 },
  btn: { backgroundColor: '#af206b', width: '100%', padding: 16, borderRadius: 15, marginTop: 25 },
  btnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' }
});