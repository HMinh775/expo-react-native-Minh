import { useRouter } from 'expo-router';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
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
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});