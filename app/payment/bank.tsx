import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useMemo } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BankPayment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Nhận đầy đủ params từ Checkout
  const { totalPrice, title, seats, date, time, cinema, movieId, screeningId } = params;

  // --- THÔNG TIN NGÂN HÀNG ---
  const BANK_ID = "VCB"; 
  const ACCOUNT_NO = "0345678999"; 
  const ACCOUNT_NAME = "HO CONG MINH";

  const qrUrl = useMemo(() => {
    const amount = totalPrice || 0;
    const description = `TT VE ${title}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-qr_only.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
  }, [totalPrice, title]);

  const handleConfirm = async () => {
    // KIỂM TRA DỮ LIỆU TRƯỚC KHI LƯU
    if (!screeningId || !movieId) {
      Alert.alert("Lỗi", "Thiếu thông tin suất chiếu. Vui lòng thử lại từ bước chọn ghế.");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), { // Đổi thành 'bookings' cho giống Momo
        userId: auth.currentUser?.uid,
        screeningId: screeningId,
        movieId: movieId,
        movieTitle: title,
        seats: typeof seats === 'string' ? seats.split(', ') : seats,
        date, time, cinemaName: cinema,
        totalPrice: Number(totalPrice),
        status: "PAID",
        paymentMethod: "Banking",
        createdAt: serverTimestamp(),
      });
      router.replace('/payment/success' as any);
    } catch (e) {
      console.error(e);
      Alert.alert("Lỗi", "Không thể lưu vé.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chuyển khoản</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.qrCard}>
          <Text style={styles.qrInstruction}>Quét mã VietQR để thanh toán</Text>
          <Image source={{ uri: qrUrl }} style={styles.qrImage} />
          <Text style={styles.amountValue}>{Number(totalPrice).toLocaleString()}đ</Text>
          <Text style={{color: '#666', marginTop: 5}}>{ACCOUNT_NAME}</Text>
        </View>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Tôi đã chuyển khoản xong</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1C' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { backgroundColor: '#161626', padding: 10, borderRadius: 12 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20, alignItems: 'center' },
  qrCard: { backgroundColor: '#fff', width: '100%', borderRadius: 25, padding: 25, alignItems: 'center' },
  qrInstruction: { fontSize: 14, color: '#000', marginBottom: 15, fontWeight: 'bold' },
  qrImage: { width: 250, height: 250 },
  amountValue: { fontSize: 28, fontWeight: 'bold', color: '#e21221', marginTop: 15 },
  confirmBtn: { backgroundColor: '#e21221', width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 25 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});