import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, orderBy, query, Unsubscribe, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function TicketsScreen() {
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;
    const user = auth.currentUser;

    if (user) {
      const q = query(
        collection(db, "bookings"), 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const tickets = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMyTickets(tickets);
        setLoading(false);
      }, (error) => {
        console.error("Lỗi lấy vé:", error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const renderTicketItem = ({ item }: { item: any }) => (
    <View style={styles.ticketCard}>
      {/* Phần trên của vé: Tên phim & Trạng thái */}
      <View style={styles.ticketTop}>
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>{item.movieTitle}</Text>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={12} color="#4caf50" />
            <Text style={styles.statusText}>VÉ HỢP LỆ</Text>
          </View>
        </View>
        <View style={styles.priceTag}>
           <Text style={styles.priceValue}>{item.totalAmount?.toLocaleString()}đ</Text>
        </View>
      </View>

      {/* Đường cắt vé */}
      <View style={styles.dashedLineContainer}>
        <View style={styles.circleLeft} />
        <View style={styles.dashedLine} />
        <View style={styles.circleRight} />
      </View>

      {/* Phần dưới của vé: Chi tiết suất chiếu */}
      <View style={styles.ticketBottom}>
        <View style={styles.infoGrid}>
          {/* Cột 1 */}
          <View style={styles.infoCol}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>RẠP CHIẾU</Text>
              <Text style={styles.value} numberOfLines={1}>
                {item.theater || 'CGV Vincom Center'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>NGÀY CHIẾU</Text>
              <Text style={styles.value}>Ngày {item.showDate || '---'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>PHƯƠNG THỨC</Text>
              <Text style={styles.value}>{item.paymentMethod || 'MoMo'}</Text>
            </View>
          </View>

          {/* Cột 2 */}
          <View style={styles.infoCol}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>GIỜ CHIẾU</Text>
              <Text style={[styles.value, {color: '#00E5FF'}]}>
                {item.showTime || '09:00'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>SỐ GHẾ</Text>
              <Text style={[styles.value, {color: '#e21221'}]}>
                {item.seats?.join(', ')}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>MÃ ĐẶT VÉ</Text>
              <Text style={styles.value}>#{item.id.slice(0, 8).toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Mã QR giả lập / Barcode */}
        <View style={styles.barcodeContainer}>
          <View style={styles.barcodePlaceholder}>
            {[...Array(20)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.barcodeLine, 
                  { width: Math.random() * 5 + 1, opacity: Math.random() + 0.3 }
                ]} 
              />
            ))}
          </View>
          <Text style={styles.barcodeText}>{item.id}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e21221" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vé của tôi</Text>
        <Text style={styles.headerSubtitle}>Bạn có {myTickets.length} suất chiếu sắp tới</Text>
      </View>

      <FlatList
        data={myTickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicketItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="ticket-outline" size={80} color="#2a2a3a" />
            <Text style={styles.emptyText}>Chưa có lịch sử đặt vé</Text>
            <Text style={styles.emptySubText}>Các vé bạn đã mua sẽ xuất hiện tại đây.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1C' },
  header: { paddingHorizontal: 20, paddingTop: 60, marginBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { color: '#888', fontSize: 14, marginTop: 4 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  centerContainer: { flex: 1, backgroundColor: '#0A0F1C', justifyContent: 'center', alignItems: 'center' },
  
  ticketCard: { backgroundColor: '#161626', borderRadius: 24, marginBottom: 25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 },
  ticketTop: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  movieInfo: { flex: 1, paddingRight: 10 },
  movieTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8, lineHeight: 24 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(76, 175, 80, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  statusText: { color: '#4caf50', fontSize: 9, fontWeight: 'bold', marginLeft: 4 },
  priceTag: { backgroundColor: '#2a2a3a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  priceValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  dashedLineContainer: { flexDirection: 'row', alignItems: 'center', height: 24, width: '100%' },
  circleLeft: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#0A0F1C', marginLeft: -12 },
  circleRight: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#0A0F1C', marginRight: -12 },
  dashedLine: { flex: 1, height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#333' },

  ticketBottom: { padding: 20 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  infoCol: { flex: 1 },
  detailItem: { marginBottom: 15 },
  label: { color: '#555', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  value: { color: '#fff', fontSize: 13, fontWeight: 'bold' },

  barcodeContainer: { marginTop: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#2a2a3a', paddingTop: 20 },
  barcodePlaceholder: { flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'center' },
  barcodeLine: { height: 30, backgroundColor: '#fff', marginHorizontal: 1, borderRadius: 1 },
  barcodeText: { color: '#444', fontSize: 10, marginTop: 5, letterSpacing: 2 },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  emptySubText: { color: '#666', fontSize: 14, marginTop: 5, textAlign: 'center' },
});