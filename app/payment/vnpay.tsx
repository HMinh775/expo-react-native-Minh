import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VnpayPayment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { totalPrice } = params;

  const handleConfirm = () => {
    router.push({
      pathname: '/payment/success',
      params: { ...params, method: 'VNPAY' }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
        <Image source={{ uri: 'https://vnpay.vn/s_vnpay_vn/72/2022/11/logo-vnpay.png' }} style={styles.headerLogo} resizeMode="contain" />
        <View style={{width: 28}} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Số tiền thanh toán</Text>
        <Text style={styles.amount}>{Number(totalPrice).toLocaleString()}đ</Text>
        
        <View style={styles.qrContainer}>
          <Image source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VNPAY_Example' }} style={styles.qr} />
        </View>
        <Text style={styles.hint}>Vui lòng quét mã QR qua ứng dụng ngân hàng của bạn</Text>

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Xác nhận thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerLogo: { width: 100, height: 30 },
  content: { flex: 1, alignItems: 'center', paddingTop: 40, paddingHorizontal: 20 },
  label: { color: '#666', fontSize: 16 },
  amount: { color: '#005baa', fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  qrContainer: { marginTop: 40, padding: 15, borderWidth: 1, borderColor: '#eee', borderRadius: 20 },
  qr: { width: 220, height: 220 },
  hint: { marginTop: 20, color: '#888', textAlign: 'center' },
  confirmBtn: { position: 'absolute', bottom: 40, backgroundColor: '#005baa', width: '100%', padding: 18, borderRadius: 15, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});