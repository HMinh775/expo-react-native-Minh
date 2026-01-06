import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng Ionicons cho Mobile
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserInfo(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) setExtraData(userDoc.data());
        setLoading(false);
      } else {
        router.replace('/(auth)/login');
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn muốn thoát tài khoản?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", onPress: () => signOut(auth), style: "destructive" }
    ]);
  };

  const MenuItem = ({ icon, title, color = "#fff", onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={[styles.iconBg, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#444" />
    </TouchableOpacity>
  );

  if (loading) return <View style={styles.loading}><ActivityIndicator color="#e21221" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Image 
            source={{ uri: extraData?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
            style={styles.avatar} 
          />
          <View style={styles.info}>
            <Text style={styles.name}>{extraData?.fullName || "Người dùng"}</Text>
            <Text style={styles.email}>{userInfo?.email}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{extraData?.membership || "FREE"}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{extraData?.watchTime || "0h"}</Text>
            <Text style={styles.statLabel}>Xem phim</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{extraData?.favoriteMovies?.length || 0}</Text>
            <Text style={styles.statLabel}>Yêu thích</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{extraData?.purchasedMovies?.length || 0}</Text>
            <Text style={styles.statLabel}>Đã mua</Text>
          </View>
        </View>

        {/* Menu Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TÀI KHOẢN</Text>
          <MenuItem icon="bookmark-outline" title="Danh sách xem sau" color="#3498db" />
          <MenuItem icon="time-outline" title="Lịch sử xem" color="#f1c40f" />
          <MenuItem icon="heart-outline" title="Phim yêu thích" color="#e74c3c" />
          <MenuItem icon="star-outline" title="Đánh giá của tôi" color="#9b59b6" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THIẾT LẬP</Text>
          <MenuItem icon="settings-outline" title="Cài đặt" color="#95a5a6" />
          <MenuItem icon="help-circle-outline" title="Trợ giúp & Hỗ trợ" color="#2ecc71" />
          <MenuItem icon="log-out-outline" title="Đăng xuất" color="#e21221" onPress={handleLogout} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  loading: { flex: 1, justifyContent: 'center', backgroundColor: '#0f0f1a' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 25, paddingTop: 40 },
  avatar: { width: 85, height: 85, borderRadius: 45, borderWidth: 2, borderColor: '#e21221' },
  info: { flex: 1, marginLeft: 15 },
  name: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  email: { color: '#888', fontSize: 14, marginVertical: 4 },
  badge: { backgroundColor: '#e21221', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  editBtn: { backgroundColor: '#1a1a2a', padding: 10, borderRadius: 20 },
  statsRow: { flexDirection: 'row', backgroundColor: '#161626', margin: 20, padding: 20, borderRadius: 20, alignItems: 'center' },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 12, marginTop: 4 },
  divider: { width: 1, height: 30, backgroundColor: '#2a2a3a' },
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { color: '#444', fontSize: 12, fontWeight: 'bold', marginBottom: 15, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, backgroundColor: '#1a1a2a', padding: 12, borderRadius: 15 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuText: { color: '#eee', fontSize: 15, fontWeight: '500' }
});