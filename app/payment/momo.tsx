import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MomoPayment() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Nhận movieId, title, seats, totalPrice...
  const { totalPrice } = params;

  const handleConfirm = () => {
    router.push({
      pathname: '/payment/success',
      params: { ...params, method: 'Ví MoMo' } // Truyền tiếp tất cả + phương thức
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={28} color="#fff" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán MoMo</Text>
        <View style={{width: 28}} />
      </View>

      <View style={styles.content}>
        <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' }} style={styles.logo} />
        <Text style={styles.amountText}>{Number(totalPrice).toLocaleString()}đ</Text>
        
        <View style={styles.qrCard}>
          <Image source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Momo_Payment_Example' }} style={styles.qrCode} />
          <Text style={styles.qrHint}>Quét mã để thanh toán</Text>
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Xác nhận đã chuyển tiền</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ae2070' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: { width: 70, height: 70, borderRadius: 15, marginBottom: 10 },
  amountText: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 30 },
  qrCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, alignItems: 'center', width: '90%' },
  qrCode: { width: 220, height: 220 },
  qrHint: { marginTop: 15, color: '#666', fontWeight: '500' },
  confirmBtn: { marginTop: 40, backgroundColor: '#fff', paddingHorizontal: 40, paddingVertical: 18, borderRadius: 30, width: '90%', alignItems: 'center' },
  confirmBtnText: { color: '#ae2070', fontWeight: 'bold', fontSize: 16 }
});