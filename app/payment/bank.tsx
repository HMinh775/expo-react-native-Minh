import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BankPayment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { totalPrice, title, seats } = params;

  const handleConfirm = () => {
    router.push({
      pathname: '/payment/success',
      params: { ...params, method: 'Chuyển khoản Ngân hàng' }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Chuyển khoản</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>Vui lòng chuyển khoản đúng số tiền và nội dung bên dưới:</Text>
        
        <View style={styles.bankCard}>
          <Text style={styles.label}>NGÂN HÀNG</Text>
          <Text style={styles.value}>VIETCOMBANK (VCB)</Text>

          <Text style={styles.label}>SỐ TÀI KHOẢN</Text>
          <Text style={styles.accountNumber}>1023456789</Text>

          <Text style={styles.label}>CHỦ TÀI KHOẢN</Text>
          <Text style={styles.value}>CONG TY DAT VE PHIM</Text>

          <Text style={styles.label}>SỐ TIỀN</Text>
          <Text style={styles.price}>{Number(totalPrice).toLocaleString()}đ</Text>

          <Text style={styles.label}>NỘI DUNG CHUYỂN KHOẢN</Text>
          <View style={styles.copyBox}>
            <Text style={styles.copyText}>TICKET {seats}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Tôi đã chuyển khoản xong</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1C' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  instruction: { color: '#888', textAlign: 'center', marginBottom: 25 },
  bankCard: { backgroundColor: '#161626', padding: 25, borderRadius: 20, borderWidth: 1, borderColor: '#2a2a3a' },
  label: { color: '#555', fontSize: 11, fontWeight: 'bold', marginTop: 15 },
  value: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  accountNumber: { color: '#00E5FF', fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  price: { color: '#e21221', fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  copyBox: { backgroundColor: '#0f0f1a', padding: 12, borderRadius: 10, marginTop: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: '#444' },
  copyText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', letterSpacing: 1 },
  confirmBtn: { backgroundColor: '#e21221', padding: 18, borderRadius: 15, marginTop: 40, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});