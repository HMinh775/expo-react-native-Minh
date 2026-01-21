import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // State cho Modal xác nhận xóa
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'reviews'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Mở modal xác nhận
  const requestDelete = (id: string) => {
    setSelectedReviewId(id);
    setIsModalVisible(true);
  };

  // Thực hiện xóa sau khi xác nhận
  const confirmDelete = async () => {
    if (!selectedReviewId) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'reviews', selectedReviewId));
      setIsModalVisible(false);
      setSelectedReviewId(null);
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#e21221" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.movieName}>{item.movieTitle}</Text>
                  <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Ionicons key={s} name="star" size={16} color={s <= item.rating ? "#f1c40f" : "#333"} />
                    ))}
                  </View>
                </View>
                
                {/* Nút thùng rác để mở Modal */}
                <TouchableOpacity 
                  onPress={() => requestDelete(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#e21221" />
                </TouchableOpacity>
              </View>
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Bạn chưa có đánh giá nào</Text>}
        />
      )}

      {/* MODAL XÁC NHẬN XÓA (Giống kiểu trang Profile) */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="alert-circle" size={50} color="#e21221" style={{ alignSelf: 'center' }} />
            <Text style={styles.modalTitle}>Xác nhận xóa</Text>
            <Text style={styles.modalText}>Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.btn, styles.btnCancel]} 
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.btn, styles.btnConfirm]} 
                onPress={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.btnText}>Xóa ngay</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  reviewCard: { backgroundColor: '#161626', margin: 15, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#252538' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  movieName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  starRow: { flexDirection: 'row', marginVertical: 8 },
  comment: { color: '#aaa', fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  empty: { color: '#444', textAlign: 'center', marginTop: 100 },
  deleteButton: { padding: 8, backgroundColor: 'rgba(226, 18, 33, 0.1)', borderRadius: 10 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#1a1a2e', borderRadius: 20, padding: 25, borderWidth: 1, borderColor: '#333' },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  modalText: { color: '#bbb', textAlign: 'center', marginVertical: 15, lineHeight: 22 },
  modalButtons: { flexDirection: 'row', gap: 15, marginTop: 10 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnCancel: { backgroundColor: '#333' },
  btnConfirm: { backgroundColor: '#e21221' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});