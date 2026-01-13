import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState('momo');

  // Nhận dữ liệu (Đảm bảo lấy đúng totalPrice)
  const { screeningId, movieId, title, seats, totalPrice, time, date, cinema, image } = params;

  const paymentMethods = [
    { id: 'momo', name: 'Ví MoMo', icon: 'wallet', color: '#af206b' },
    { id: 'vnpay', name: 'VNPAY', icon: 'card', color: '#005baa' },
    { id: 'bank', name: 'Thẻ ATM / Internet Banking', icon: 'business', color: '#4caf50' },
  ];

  const processPayment = () => {
    router.push({
      pathname: `/payment/${paymentMethod}` as any, 
      params: { 
        ...params, // Truyền tất cả dữ liệu sang trang thanh toán
        method: paymentMethod 
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Xác nhận thanh toán</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin đơn hàng</Text>
          <View style={styles.infoRow}><Text style={styles.label}>Phim:</Text><Text style={styles.value}>{title}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Rạp:</Text><Text style={styles.value}>{cinema}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Suất chiếu:</Text><Text style={styles.value}>{time} • {date}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Chỗ ngồi:</Text><Text style={[styles.value, { color: '#00E5FF' }]}>{seats}</Text></View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <Text style={styles.totalLabel}>Tổng tiền:</Text>
            {/* Sửa lỗi NaN bằng cách ép kiểu Number và dùng đúng biến totalPrice */}
            <Text style={styles.totalValue}>{Number(totalPrice || 0).toLocaleString()}đ</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodItem, paymentMethod === method.id && styles.methodSelected]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <View style={[styles.iconBox, { backgroundColor: method.color }]}>
                <Ionicons name={method.icon as any} size={20} color="#fff" />
              </View>
              <Text style={styles.methodName}>{method.name}</Text>
              <View style={[styles.radio, paymentMethod === method.id && styles.radioActive]}>
                {paymentMethod === method.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn} onPress={processPayment}>
          <Text style={styles.payBtnText}>Thanh toán ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1C' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { backgroundColor: '#161626', padding: 10, borderRadius: 12 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  card: { backgroundColor: '#161626', margin: 20, marginTop: 0, borderRadius: 20, padding: 20 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: '#888', fontSize: 14 },
  value: { color: '#fff', fontSize: 14, fontWeight: '500', textAlign: 'right', flex: 1, marginLeft: 20 },
  borderTop: { borderTopWidth: 1, borderTopColor: '#2a2a3a', paddingTop: 15, marginTop: 5 },
  totalLabel: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  totalValue: { color: '#e21221', fontSize: 22, fontWeight: 'bold' },
  methodItem: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#1a1a2a', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'transparent' },
  methodSelected: { borderColor: '#e21221', backgroundColor: 'rgba(226, 18, 33, 0.05)' },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  methodName: { color: '#fff', marginLeft: 15, flex: 1, fontSize: 14 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#444', justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: '#e21221' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#e21221' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#1f1f2e' },
  payBtn: { backgroundColor: '#e21221', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});