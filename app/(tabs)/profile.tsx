<<<<<<< HEAD
import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng Ionicons cho Mobile
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
=======
import { useRouter } from 'expo-router';
import {
>>>>>>> 7bd92f365153ec1161411497496a958028054476
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
<<<<<<< HEAD

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
=======
// Import Hook lấy dữ liệu toàn cục
import { useAuth } from '../../constants/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  
  // Lấy trạng thái đăng nhập và thông tin user từ Context (thay vì useState cục bộ)
  const { isLoggedIn, user, logout } = useAuth();

  const handleLoginPress = () => {
    // Chuyển sang màn hình login nằm trong thư mục (auth)
    router.push('/(auth)/login');
  };

  const handleLogoutPress = () => {
    // Gọi hàm logout từ Context
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header Profile */}
        <View style={styles.header}>
          {/* Kiểm tra isLoggedIn từ Context */}
          {isLoggedIn && user ? (
            <>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: user.avatar || 'https://via.placeholder.com/100' }} 
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.editAvatarBtn}>
                  <Text style={styles.editAvatarText}>✎</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </>
          ) : (
            <>
              <View style={styles.guestAvatar}>
                <Text style={styles.guestAvatarText}>👤</Text>
              </View>
              <Text style={styles.guestTitle}>Khách</Text>
              <Text style={styles.guestSubtitle}>Đăng nhập để sử dụng đầy đủ tính năng</Text>
            </>
          )}
        </View>

        {/* Nút hành động chính */}
        <View style={styles.actionSection}>
          {isLoggedIn ? (
            <TouchableOpacity 
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogoutPress}
            >
              <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.actionButton, styles.loginButton]}
              onPress={handleLoginPress}
            >
              <Text style={styles.loginButtonText}>Đăng nhập / Đăng ký</Text>
            </TouchableOpacity>
          )}
        </View>

     {/* Menu chức năng */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Tài khoản</Text>
          
          <View style={styles.menuList}>
            {isLoggedIn ? (
              // --- GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP ---
              <>
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => router.push('/settings/personal-info')} // ✅ Link đến trang Thông tin
                >
                  <Text style={styles.menuIcon}>📋</Text>
                  <Text style={styles.menuText}>Thông tin cá nhân</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  // Chưa có file security.tsx thì bạn cần tạo thêm, hoặc tạm thời chưa dẫn đi đâu
                  onPress={() => router.push('/settings/security')} 
                >
                  <Text style={styles.menuIcon}>🔒</Text>
                  <Text style={styles.menuText}>Bảo mật & Đăng nhập</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => router.push('/settings/app-settings')} // ✅ Link đến Cài đặt
                >
                  <Text style={styles.menuIcon}>📱</Text>
                  <Text style={styles.menuText}>Cài đặt ứng dụng</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => router.push('/settings/help')} // Cần tạo file help.tsx
                >
                  <Text style={styles.menuIcon}>❓</Text>
                  <Text style={styles.menuText}>Trợ giúp & Hỗ trợ</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
              </>
            ) : (
              // --- GIAO DIỆN KHI CHƯA ĐĂNG NHẬP (KHÁCH) ---
              <>
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => router.push('/settings/about')} // ✅ Link đến Giới thiệu
                >
                  <Text style={styles.menuIcon}>ℹ️</Text>
                  <Text style={styles.menuText}>Giới thiệu ứng dụng</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => router.push('/settings/app-settings')} // ✅ Link đến Cài đặt
                >
                  <Text style={styles.menuIcon}>📱</Text>
                  <Text style={styles.menuText}>Cài đặt ứng dụng</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  {/* Nút này thường mở App Store/CH Play chứ không chuyển trang nội bộ */}
                  <Text style={styles.menuIcon}>⭐</Text>
                  <Text style={styles.menuText}>Đánh giá ứng dụng</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => router.push('/settings/help')} 
                >
                  <Text style={styles.menuIcon}>❓</Text>
                  <Text style={styles.menuText}>Trợ giúp & Hỗ trợ</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Thông tin phiên bản */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Phiên bản 1.1.3</Text>
          <Text style={styles.copyrightText}>© 2026 Ứng dụng của Minh</Text>
>>>>>>> 7bd92f365153ec1161411497496a958028054476
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guestAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  guestAvatarText: {
    fontSize: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  guestSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  actionSection: {
    padding: 20,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: '#007AFF',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  logoutButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 15,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    paddingHorizontal: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  menuList: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 15,
    width: 30,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 20,
    color: '#ccc',
    fontWeight: 'bold',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: '#bbb',
  },
>>>>>>> 7bd92f365153ec1161411497496a958028054476
});