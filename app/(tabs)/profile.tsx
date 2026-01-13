import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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

  // Theo dõi trạng thái đăng nhập của người dùng
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Người dùng đã đăng nhập
        setUserInfo(user);
        try {
          // Lấy thông tin bổ sung từ Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) setExtraData(userDoc.data());
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        }
        setLoading(false);
      } else {
        // Người dùng chưa đăng nhập, chuyển về trang login
        router.replace('/(auth)/login');
      }
    });
    
    // Dọn dẹp khi component unmount
    return unsubscribe;
  }, []);

  // Hàm xử lý đăng xuất chính
  const performLogout = async () => {
    console.log("Bắt đầu quá trình đăng xuất...");
    setIsSigningOut(true);
    
    try {
      // 1. Đăng xuất khỏi Firebase Authentication
      await signOut(auth);
      console.log("Đăng xuất Firebase thành công");
      
      // 2. Đợi một chút để đảm bảo state được cập nhật
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 3. Chuyển hướng về trang đăng nhập
      console.log("Đang chuyển hướng về trang đăng nhập...");
      router.replace('/(auth)/login');
      
    } catch (error: any) {
      console.error("Lỗi đăng xuất:", error);
      Alert.alert("Lỗi", "Đăng xuất thất bại. Vui lòng thử lại!");
    } finally {
      setIsSigningOut(false);
    }
  };

  // Mở modal xác nhận đăng xuất
  const openLogoutModal = () => {
    console.log("Mở modal xác nhận đăng xuất");
    setShowLogoutModal(true);
  };

  // Đóng modal
  const closeLogoutModal = () => {
    console.log("Đóng modal đăng xuất");
    setShowLogoutModal(false);
  };

  // Xác nhận đăng xuất từ modal
  const confirmLogout = () => {
    console.log("Xác nhận đăng xuất từ modal");
    closeLogoutModal();
    performLogout();
  };

  // Component cho các mục menu
  const MenuItem = ({ 
    icon, 
    title, 
    color = "#fff", 
    onPress, 
    disabled = false 
  }: any) => (
    <TouchableOpacity 
      style={[styles.menuItem, disabled && styles.menuItemDisabled]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        {/* Background với màu nhạt của icon */}
        <View style={[styles.iconBg, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={[styles.menuText, disabled && styles.menuTextDisabled]}>
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#444" />
    </TouchableOpacity>
  );

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator color="#e21221" size="large" />
      <Text style={styles.loadingText}>Đang tải thông tin...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Phần Header với thông tin người dùng */}
        <View style={styles.header}>
          {/* Avatar người dùng */}
          <Image 
            source={{ 
              uri: extraData?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg' 
            }} 
            style={styles.avatar} 
          />
          
          {/* Thông tin chi tiết */}
          <View style={styles.info}>
            <Text style={styles.name}>
              {extraData?.fullName || "Người dùng"}
            </Text>
            <Text style={styles.email}>
              {userInfo?.email}
            </Text>
            {/* Badge hiển thị cấp độ thành viên */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {extraData?.membership || "FREE"}
              </Text>
            </View>
          </View>
          
          {/* Nút chỉnh sửa (placeholder) */}
          <TouchableOpacity 
            style={styles.editBtn} 
            activeOpacity={0.7}
            onPress={() => Alert.alert("Thông báo", "Tính năng chỉnh sửa sẽ sớm ra mắt!")}
          >
            <Ionicons name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Thống kê hoạt động */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>
              {extraData?.watchTime || "0h"}
            </Text>
            <Text style={styles.statLabel}>Xem phim</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statBox}>
            <Text style={styles.statNum}>
              {extraData?.favoriteMovies?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Yêu thích</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statBox}>
            <Text style={styles.statNum}>
              {extraData?.purchasedMovies?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Đã mua</Text>
          </View>
        </View>

        {/* Nhóm menu: Tài khoản */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TÀI KHOẢN</Text>
          
          <MenuItem 
            icon="bookmark-outline" 
            title="Danh sách xem sau" 
            color="#3498db" 
            onPress={() => Alert.alert("Thông báo", "Tính năng sẽ sớm ra mắt!")}
          />
          
          <MenuItem 
            icon="time-outline" 
            title="Lịch sử xem" 
            color="#f1c40f" 
            onPress={() => Alert.alert("Thông báo", "Tính năng sẽ sớm ra mắt!")}
          />
          
          <MenuItem 
            icon="heart-outline" 
            title="Phim yêu thích" 
            color="#e74c3c" 
            onPress={() => Alert.alert("Thông báo", "Tính năng sẽ sớm ra mắt!")}
          />
          
          <MenuItem 
            icon="star-outline" 
            title="Đánh giá của tôi" 
            color="#9b59b6" 
            onPress={() => Alert.alert("Thông báo", "Tính năng sẽ sớm ra mắt!")}
          />
        </View>

        {/* Nhóm menu: Thiết lập */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THIẾT LẬP</Text>
          
          <MenuItem 
            icon="settings-outline" 
            title="Cài đặt" 
            color="#95a5a6" 
            onPress={() => Alert.alert("Cài đặt", "Tính năng đang được phát triển!")}
          />
          
          <MenuItem 
            icon="help-circle-outline" 
            title="Trợ giúp & Hỗ trợ" 
            color="#2ecc71" 
            onPress={() => Alert.alert(
              "Trợ giúp", 
              "Liên hệ với chúng tôi:\n\n📧 Email: support@moviehub.com\n📞 Hotline: 1900 1234"
            )}
          />
          
          {/* Nút đăng xuất - Sử dụng Modal thay vì Alert */}
          <TouchableOpacity 
            style={[
              styles.logoutButton,
              isSigningOut && styles.logoutButtonDisabled
            ]}
            onPress={openLogoutModal}
            disabled={isSigningOut}
            activeOpacity={0.7}
          >
            <View style={styles.logoutLeft}>
              <View style={[styles.iconBg, { backgroundColor: '#e2122115' }]}>
                <Ionicons name="log-out-outline" size={22} color="#e21221" />
              </View>
              <Text style={styles.logoutText}>
                {isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}
              </Text>
            </View>
            {isSigningOut ? (
              <ActivityIndicator color="#e21221" size="small" />
            ) : (
              <Ionicons name="chevron-forward" size={20} color="#444" />
            )}
          </TouchableOpacity>
        </View>

      
      </ScrollView>

      {/* Modal xác nhận đăng xuất */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeLogoutModal}
      >
        {/* Overlay mờ phía sau modal */}
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeLogoutModal}
        >
          {/* Nội dung modal - Ngăn không cho touch trên overlay đóng modal */}
          <TouchableOpacity 
            style={styles.modalContentWrapper}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalContent}>
              
              {/* Icon và tiêu đề */}
              <View style={styles.modalHeader}>
                <Ionicons name="log-out-outline" size={48} color="#e21221" />
                <Text style={styles.modalTitle}>Đăng xuất</Text>
                <Text style={styles.modalSubtitle}>
                  Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
                </Text>
              </View>

              {/* Nút hành động */}
              <View style={styles.modalButtons}>
                {/* Nút hủy */}
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={closeLogoutModal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelText}>Hủy</Text>
                </TouchableOpacity>

                {/* Nút xác nhận đăng xuất */}
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalConfirmButton]}
                  onPress={confirmLogout}
                  activeOpacity={0.7}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.modalConfirmText}>Đăng xuất</Text>
                  )}
                </TouchableOpacity>
              </View>
              
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

// Stylesheet cho toàn bộ component
const styles = StyleSheet.create({
  // Container chính
  container: { 
    flex: 1, 
    backgroundColor: '#0f0f1a' 
  },
  
  // Loading state
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0f0f1a' 
  },
  loadingText: {
    color: '#888',
    marginTop: 10,
    fontSize: 14,
  },
  
  // ScrollView content
  scrollContent: { 
    paddingBottom: 100 
  },
  
  // Header section
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 25, 
    paddingTop: 40 
  },
  avatar: { 
    width: 85, 
    height: 85, 
    borderRadius: 45, 
    borderWidth: 2, 
    borderColor: '#e21221' 
  },
  info: { 
    flex: 1, 
    marginLeft: 15 
  },
  name: { 
    color: '#fff', 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  email: { 
    color: '#888', 
    fontSize: 14, 
    marginVertical: 4 
  },
  badge: { 
    backgroundColor: '#e21221', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 10, 
    paddingVertical: 2, 
    borderRadius: 6 
  },
  badgeText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: '800' 
  },
  editBtn: { 
    backgroundColor: '#1a1a2a', 
    padding: 10, 
    borderRadius: 20 
  },
  
  // Stats row
  statsRow: { 
    flexDirection: 'row', 
    backgroundColor: '#161626', 
    margin: 20, 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center' 
  },
  statBox: { 
    flex: 1, 
    alignItems: 'center' 
  },
  statNum: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  statLabel: { 
    color: '#666', 
    fontSize: 12, 
    marginTop: 4 
  },
  divider: { 
    width: 1, 
    height: 30, 
    backgroundColor: '#2a2a3a' 
  },
  
  // Menu sections
  section: { 
    paddingHorizontal: 20, 
    marginTop: 25 
  },
  sectionTitle: { 
    color: '#444', 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    letterSpacing: 1 
  },
  
  // Menu items
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 12, 
    backgroundColor: '#1a1a2a', 
    padding: 12, 
    borderRadius: 15 
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconBg: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  menuText: { 
    color: '#eee', 
    fontSize: 15, 
    fontWeight: '500' 
  },
  menuTextDisabled: {
    color: '#666',
  },
  
  // Logout button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#1a1a2a',
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e21221',
  },
  logoutButtonDisabled: {
    opacity: 0.7,
    borderColor: '#a00d17',
  },
  logoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#e21221',
    fontSize: 15,
    fontWeight: 'bold',
  },
  
  // Debug info
  debugInfo: {
    backgroundColor: '#1a1a2a',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
  },
  debugText: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContentWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#1a1a2a',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2a2a3a',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#2a2a3a',
  },
  modalConfirmButton: {
    backgroundColor: '#e21221',
  },
  modalCancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});