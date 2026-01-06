import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookingScreen() {
  const { id, title, price } = useLocalSearchParams();
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Tạo sơ đồ ghế: 6 hàng (A-F), mỗi hàng 6 ghế
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6];

  // Hàm chọn/hủy chọn ghế
  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Hàm xác nhận đặt vé và lưu vào Firebase
  const handleConfirm = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert("Lưu ý", "Vui lòng chọn ít nhất một chỗ ngồi.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Lỗi", "Bạn cần đăng nhập để đặt vé.");
        return;
      }

      // Cập nhật Firestore: Thêm ID phim vào mảng purchasedMovies của User
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        purchasedMovies: arrayUnion(id)
      });

      Alert.alert(
        "Đặt vé thành công!",
        `Chúc mừng bạn đã đặt thành công phim: ${title}\nGhế: ${selectedSeats.join(', ')}`,
        [{ text: "Xem vé của tôi", onPress: () => router.replace('/(tabs)/tickets') }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi đặt vé. Vui lòng thử lại.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubTitle}>Chọn chỗ ngồi</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Màn hình rạp chiếu */}
        <View style={styles.screenContainer}>
          <View style={styles.screenLine} />
          <Text style={styles.screenText}>MÀN HÌNH</Text>
        </View>

        {/* Sơ đồ ghế */}
        <View style={styles.grid}>
          {rows.map(row => (
            <View key={row} style={styles.row}>
              <Text style={styles.rowLabel}>{row}</Text>
              <View style={styles.seatRow}>
                {cols.map(col => {
                  const seatId = `${row}${col}`;
                  const isSelected = selectedSeats.includes(seatId);
                  return (
                    <TouchableOpacity
                      key={seatId}
                      style={[styles.seat, isSelected && styles.seatSelected]}
                      onPress={() => toggleSeat(seatId)}
                    >
                      <Text style={[styles.seatText, isSelected && {color: '#fff'}]}>{col}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Chú thích */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={styles.seat} /><Text style={styles.legendText}>Trống</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.seat, styles.seatSelected]} /><Text style={styles.legendText}>Đang chọn</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.seat, {backgroundColor: '#333'}]} /><Text style={styles.legendText}>Đã bán</Text>
          </View>
        </View>
      </ScrollView>

      {/* Thanh toán ở dưới cùng */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Tổng cộng ({selectedSeats.length} ghế)</Text>
          <Text style={styles.totalPrice}>
            {(selectedSeats.length * Number(price)).toLocaleString()}đ
          </Text>
        </View>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { backgroundColor: '#1a1a2a', padding: 10, borderRadius: 12 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  headerSubTitle: { color: '#888', fontSize: 12, textAlign: 'center' },
  scrollContent: { alignItems: 'center', paddingTop: 30 },
  screenContainer: { marginBottom: 50, alignItems: 'center' },
  screenLine: { width: 300, height: 4, backgroundColor: '#e21221', borderRadius: 2, shadowColor: '#e21221', shadowOpacity: 1, shadowRadius: 10, elevation: 10 },
  screenText: { color: '#333', marginTop: 10, fontSize: 10, letterSpacing: 5 },
  grid: { paddingHorizontal: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rowLabel: { color: '#444', width: 25, fontWeight: 'bold' },
  seatRow: { flexDirection: 'row', gap: 10 },
  seat: { width: 35, height: 35, backgroundColor: '#1a1a2a', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a3a' },
  seatSelected: { backgroundColor: '#e21221', borderColor: '#e21221' },
  seatText: { color: '#444', fontSize: 12 },
  legend: { flexDirection: 'row', gap: 20, marginTop: 50 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendText: { color: '#888', fontSize: 12 },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#161626', padding: 25, paddingBottom: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  totalLabel: { color: '#888', fontSize: 12 },
  totalPrice: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  confirmBtn: { backgroundColor: '#e21221', paddingHorizontal: 35, paddingVertical: 16, borderRadius: 16 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});