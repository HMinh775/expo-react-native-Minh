import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useMemo } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VNPayPaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { screeningId, movieId, title, seats, totalPrice, time, date, cinema } = params;

  // --- CẤU HÌNH VNPAY (DÙNG VIETQR) ---
  const BANK_CONFIG = {
    ID: "MB", // Ngân hàng bạn dùng để nhận tiền VNPAY
    ACCOUNT_NO: "0345678999",
    ACCOUNT_NAME: "NGUYEN VAN MINH"
  };

  const qrUrl = useMemo(() => {
    const amount = totalPrice || 0;
    const info = `VNPAY Thanh toan ${title}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return `https://img.vietqr.io/image/${BANK_CONFIG.ID}-${BANK_CONFIG.ACCOUNT_NO}-qr_only.png?amount=${amount}&addInfo=${info}`;
  }, [totalPrice, title]);

  const handleConfirm = async () => {
    if (!screeningId || !movieId) {
      Alert.alert("Lỗi", "Thiếu thông tin suất chiếu!");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        userId: auth.currentUser?.uid,
        screeningId: screeningId, // Thêm dòng này để fix lỗi undefined
        movieId: movieId,         // Thêm dòng này
        movieTitle: title,
        seats: typeof seats === 'string' ? seats.split(', ') : seats,
        date, 
        time, 
        cinemaName: cinema,
        totalPrice: Number(totalPrice),
        status: "PAID",
        paymentMethod: "VNPAY",
        createdAt: serverTimestamp(),
      });
      router.replace('/payment/success' as any);
    } catch (e) {
      console.error(e);
      Alert.alert("Lỗi", "Thanh toán thất bại.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán VNPAY</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.qrCard, { borderColor: '#005baa', borderWidth: 2 }]}>
          <Image 
            source={{ uri: 'https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxm6773ndv31687154089304.png' }} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.qrInstruction}>Quét mã qua Ứng dụng Ngân hàng</Text>
          <View style={styles.qrWrapper}>
            <Image source={{ uri: qrUrl }} style={styles.qrImage} />
          </View>
          <Text style={styles.amountValue}>{Number(totalPrice).toLocaleString()}đ</Text>
        </View>

        <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: '#005baa' }]} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Xác nhận thanh toán VNPAY</Text>
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
  logo: { width: 150, height: 40, marginBottom: 15 },
  qrInstruction: { fontSize: 13, color: '#666', marginBottom: 15 },
  qrWrapper: { padding: 10, backgroundColor: '#f4f4f4', borderRadius: 15 },
  qrImage: { width: 220, height: 220 },
  amountValue: { fontSize: 28, fontWeight: 'bold', color: '#005baa', marginTop: 15 },
  confirmBtn: { width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 25 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});