import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [extraData, setExtraData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Theo dõi trạng thái đăng nhập và lấy dữ liệu
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo(user);
        const userRef = doc(db, "users", user.uid);
        const unsubscribeDoc = onSnapshot(userRef, (snap) => {
          if (snap.exists()) setExtraData(snap.data());
          setLoading(false);
        });
        return () => unsubscribeDoc();
      } else {
        router.replace('/(auth)/login');
      }
    });
    return unsubscribeAuth;
  }, []);

  const performLogout = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert("Lỗi", "Đăng xuất thất bại!");
    } finally {
      setIsSigningOut(false);
      setShowLogoutModal(false);
    }
  };

  // Component MenuItem theo style trong ảnh (thẻ bo góc, icon bên trái)
  const MenuItem = ({ icon, title, color = "#fff", onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <View style={[styles.iconBg, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#333" />
    </TouchableOpacity>
  );

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator color="#e21221" size="large" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER SECTION - Giống hệt ảnh chụp */}
        <View style={styles.header}>
          <Image 
            source={{ uri: extraData?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
            style={styles.avatar} 
          />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{extraData?.fullName || "Người dùng"}</Text>
            <Text style={styles.email}>{userInfo?.email}</Text>
            <View style={styles.badgeFree}>
              <Text style={styles.badgeText}>{extraData?.membership || "FREE"}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editIconBtn}>
             <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* NHÓM TÀI KHOẢN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TÀI KHOẢN</Text>
          
          <MenuItem 
            icon="bookmark" title="Danh sách xem sau" color="#3498db" 
            onPress={() => router.push({ pathname: '/movie/list', params: { type: 'watchlater' } })}
          />
          <MenuItem 
            icon="time" title="Lịch sử xem" color="#f1c40f" 
            onPress={() => router.push({ pathname: '/movie/list', params: { type: 'history' } })}
          />
          <MenuItem 
            icon="heart" title="Phim yêu thích" color="#e74c3c" 
            onPress={() => router.push({ pathname: '/movie/list', params: { type: 'favorites' } })}
          />
          <MenuItem 
            icon="star" title="Đánh giá của tôi" color="#9b59b6" 
            onPress={() => router.push('/movie/reviews')}
          />
        </View>

        {/* NHÓM THIẾT LẬP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THIẾT LẬP</Text>
          
         <MenuItem 
    icon="settings-outline" 
    title="Cài đặt" 
    color="#95a5a6" 
    onPress={() => router.push('/settings')} // Kết nối tới app/settings/index.tsx
  />
         <MenuItem 
    icon="help-circle-outline" 
    title="Trợ giúp & Hỗ trợ" 
    color="#2ecc71" 
    onPress={() => router.push('/help')} // Kết nối tới app/help/index.tsx
  />
          
          <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowLogoutModal(true)}>
            <View style={styles.logoutLeft}>
               <View style={[styles.iconBg, { backgroundColor: '#e2122120' }]}>
                  <Ionicons name="log-out" size={20} color="#e21221" />
               </View>
               <Text style={styles.logoutText}>Đăng xuất</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#333" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đăng xuất</Text>
            <Text style={styles.modalSub}>Bạn có chắc chắn muốn thoát tài khoản?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowLogoutModal(false)}>
                <Text style={{color: '#fff'}}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirm} onPress={performLogout}>
                {isSigningOut ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{color: '#fff', fontWeight: 'bold'}}>Đăng xuất</Text>}
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' },
  scrollContent: { paddingBottom: 100 },

  // Header giống ảnh
  header: { flexDirection: 'row', alignItems: 'center', padding: 25, paddingTop: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#e21221' },
  headerInfo: { flex: 1, marginLeft: 15 },
  name: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  email: { color: '#888', fontSize: 13, marginTop: 2 },
  badgeFree: { backgroundColor: '#e21221', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 8 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  editIconBtn: { backgroundColor: '#1f1f2e', padding: 10, borderRadius: 20 },

  // Section & Menu style
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { color: '#444', fontSize: 11, fontWeight: 'bold', marginBottom: 15, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, backgroundColor: '#161626', padding: 12, borderRadius: 15 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { color: '#eee', fontSize: 14, fontWeight: '500' },

  // Logout riêng biệt
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#161626', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#e2122130' },
  logoutLeft: { flexDirection: 'row', alignItems: 'center' },
  logoutText: { color: '#e21221', fontSize: 14, fontWeight: 'bold' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#161626', padding: 25, borderRadius: 20, alignItems: 'center' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalSub: { color: '#888', textAlign: 'center', marginBottom: 20 },
  modalActions: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  btnCancel: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#333', borderRadius: 10, marginRight: 10 },
  btnConfirm: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#e21221', borderRadius: 10 }
});