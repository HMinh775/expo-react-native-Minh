import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [isNotifEnabled, setIsNotifEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const [language, setLanguage] = useState('Tiếng Việt');
  const [videoQuality, setVideoQuality] = useState('1080p');
  const [cacheSize, setCacheSize] = useState('256 MB');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);

  const SettingOption = ({ 
    icon, 
    title, 
    value, 
    type = 'arrow', 
    onPress, 
    danger = false,
    subtitle 
  }: any) => (
    <TouchableOpacity 
      style={styles.option} 
      onPress={onPress}
      disabled={type === 'switch'}
    >
      <View style={styles.optionLeft}>
        <View style={[styles.iconBg, danger && styles.iconBgDanger]}>
          <Ionicons name={icon} size={20} color={danger ? '#FF453A' : '#00E5FF'} />
        </View>
        <View>
          <Text style={[styles.optionText, danger && styles.dangerText]}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.optionRight}>
        {value && type !== 'switch' && (
          <Text style={styles.optionValue}>{value}</Text>
        )}
        {type === 'arrow' && <Ionicons name="chevron-forward" size={18} color="#666" />}
        {type === 'switch' && (
          <Switch 
            value={value} 
            onValueChange={onPress} 
            trackColor={{ false: "#333", true: "#00E5FF" }}
            thumbColor={Platform.OS === 'ios' ? '#fff' : value ? '#fff' : '#f4f3f4'}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đăng xuất", 
          style: "destructive",
          onPress: () => {
            // Xử lý đăng xuất ở đây
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      "Xóa bộ nhớ đệm",
      "Bạn có chắc chắn muốn xóa bộ nhớ đệm? Thao tác này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa ngay", 
          style: "destructive",
          onPress: () => {
            setCacheSize('0 MB');
            Alert.alert("Thành công", "Đã xóa bộ nhớ đệm");
          }
        }
      ]
    );
  };

  const openPrivacyPolicy = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://example.com/privacy-policy');
    } catch (error) {
      Alert.alert("Lỗi", "Không thể mở liên kết");
    }
  };

  const openTermsOfService = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://example.com/terms-of-service');
    } catch (error) {
      Alert.alert("Lỗi", "Không thể mở liên kết");
    }
  };

  const openSupport = () => {
    // Thay vì Alert.prompt, chuyển đến trang hỗ trợ
    router.push('/help'); // Đảm bảo bạn có file help/index.tsx
  };

  const openFeedback = () => {
    Alert.alert(
      "Phản hồi",
      "Vui lòng gửi phản hồi của bạn đến email: support@cinemaapp.com",
      [
        { text: "Đóng", style: "cancel" },
        { 
          text: "Mở Email", 
          onPress: () => {
            // Có thể dùng Linking.openURL('mailto:support@cinemaapp.com')
            Alert.alert("Thông tin", "Gửi email đến: support@cinemaapp.com");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <TouchableOpacity onPress={() => Alert.alert("Trợ giúp", "Nhấn vào từng mục để điều chỉnh cài đặt")}>
          <Ionicons name="help-circle-outline" size={24} color="#00E5FF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Thông tin tài khoản */}
        <View style={styles.accountSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>U</Text>
            </View>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>Người dùng</Text>
            <Text style={styles.accountEmail}>user@example.com</Text>
          </View>
          <TouchableOpacity 
            style={styles.editProfileBtn}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons name="create-outline" size={18} color="#00E5FF" />
            <Text style={styles.editProfileText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        {/* TÀI KHOẢN */}
        <Text style={styles.sectionTitle}>TÀI KHOẢN</Text>
        <SettingOption 
          icon="person-outline" 
          title="Thông tin cá nhân" 
          onPress={() => router.push('/(tabs)/profile')}
        />
        <SettingOption 
          icon="card-outline" 
          title="Phương thức thanh toán" 
        //   onPress={() => router.push('/payment')}
        />
        <SettingOption 
          icon="ticket-outline" 
          title="Vé của tôi" 
          onPress={() => router.push('/(tabs)/tickets')}
          value="3 vé"
        />

        {/* THÔNG BÁO */}
        <Text style={styles.sectionTitle}>THÔNG BÁO</Text>
        <SettingOption 
          icon="notifications-outline" 
          title="Thông báo đẩy" 
          type="switch" 
          value={isNotifEnabled} 
          onPress={() => setIsNotifEnabled(!isNotifEnabled)}
        />
        <SettingOption 
          icon="mail-outline" 
          title="Email thông báo" 
          type="switch" 
          value={true}
          onPress={() => Alert.alert("Thông báo", "Tính năng đang phát triển")}
        />
        <SettingOption 
          icon="megaphone-outline" 
          title="Khuyến mãi" 
          type="switch" 
          value={true}
          onPress={() => Alert.alert("Thông báo", "Tính năng đang phát triển")}
        />

        {/* CÀI ĐẶT ỨNG DỤNG */}
        <Text style={styles.sectionTitle}>CÀI ĐẶT ỨNG DỤNG</Text>
        <SettingOption 
          icon="moon-outline" 
          title="Chế độ tối" 
          type="switch" 
          value={isDarkMode} 
          onPress={() => setIsDarkMode(!isDarkMode)}
        />
        <SettingOption 
          icon="language-outline" 
          title="Ngôn ngữ" 
          value={language}
          onPress={() => setShowLanguageModal(true)}
        />
        <SettingOption 
          icon="videocam-outline" 
          title="Chất lượng video" 
          value={videoQuality}
          onPress={() => setShowQualityModal(true)}
        />
        <SettingOption 
          icon="play-circle-outline" 
          title="Tự động phát" 
          type="switch" 
          value={isAutoPlayEnabled}
          onPress={() => setIsAutoPlayEnabled(!isAutoPlayEnabled)}
        />
        <SettingOption 
          icon="cellular-outline" 
          title="Chỉ tải về WiFi" 
          type="switch" 
          value={true}
          onPress={() => Alert.alert("Thông báo", "Tính năng đang phát triển")}
        />

        {/* BẢO MẬT */}
        <Text style={styles.sectionTitle}>BẢO MẬT</Text>
        <SettingOption 
          icon="lock-closed-outline" 
          title="Đổi mật khẩu" 
          onPress={() => Alert.alert("Thông báo", "Tính năng đang phát triển")}
        />
        <SettingOption 
          icon="finger-print-outline" 
          title="Đăng nhập bằng vân tay" 
          type="switch" 
          value={isBiometricEnabled}
          onPress={() => setIsBiometricEnabled(!isBiometricEnabled)}
        />
        <SettingOption 
          icon="shield-checkmark-outline" 
          title="Quyền riêng tư" 
          onPress={openPrivacyPolicy}
        />

        {/* HỖ TRỢ */}
        <Text style={styles.sectionTitle}>HỖ TRỢ</Text>
        <SettingOption 
          icon="help-circle-outline" 
          title="Trung tâm hỗ trợ" 
          onPress={openSupport}
        />
        <SettingOption 
          icon="chatbubble-ellipses-outline" 
          title="Phản hồi" 
          onPress={openFeedback}
        />
        <SettingOption 
          icon="information-circle-outline" 
          title="Về ứng dụng" 
          value="Phiên bản 1.0.0"
          onPress={() => Alert.alert("Phiên bản", "Cinema App v1.0.0\n© 2024 All rights reserved")}
        />
        <SettingOption 
          icon="document-text-outline" 
          title="Điều khoản dịch vụ" 
          onPress={openTermsOfService}
        />

        {/* BỘ NHỚ */}
        <Text style={styles.sectionTitle}>BỘ NHỚ</Text>
        <SettingOption 
          icon="trash-outline" 
          title="Xóa bộ nhớ đệm" 
          subtitle={`Hiện tại: ${cacheSize}`}
          onPress={handleClearCache}
        />

        {/* TÀI KHOẢN */}
        <Text style={styles.sectionTitle}>TÀI KHOẢN</Text>
        <SettingOption 
          icon="log-out-outline" 
          title="Đăng xuất" 
          danger={true}
          onPress={handleLogout}
        />
        <SettingOption 
          icon="trash-bin-outline" 
          title="Xóa tài khoản" 
          danger={true}
          onPress={() => Alert.alert("Thông báo", "Tính năng đang phát triển")}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Cinema App v1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2024 All rights reserved</Text>
        </View>
      </ScrollView>

      {/* Modal chọn ngôn ngữ */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn ngôn ngữ</Text>
            {['Tiếng Việt', 'English', '中文', '日本語'].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={styles.modalOption}
                onPress={() => {
                  setLanguage(lang);
                  setShowLanguageModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, language === lang && styles.selectedText]}>
                  {lang}
                </Text>
                {language === lang && <Ionicons name="checkmark" size={20} color="#00E5FF" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.modalCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal chọn chất lượng video */}
      <Modal
        visible={showQualityModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chất lượng video</Text>
            {['Auto', '1080p', '720p', '480p', '360p'].map((quality) => (
              <TouchableOpacity
                key={quality}
                style={styles.modalOption}
                onPress={() => {
                  setVideoQuality(quality);
                  setShowQualityModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, videoQuality === quality && styles.selectedText]}>
                  {quality}
                </Text>
                {videoQuality === quality && <Ionicons name="checkmark" size={20} color="#00E5FF" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowQualityModal(false)}
            >
              <Text style={styles.modalCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0f0f1a' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e'
  },
  backButton: {
    padding: 5
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  content: { 
    paddingHorizontal: 20,
    paddingBottom: 40 
  },
  
  // Account Section
  accountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161626',
    padding: 20,
    borderRadius: 20,
    marginVertical: 20,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00E5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f0f1a',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accountEmail: {
    color: '#aaa',
    fontSize: 14,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
  editProfileText: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  
  // Section Title
  sectionTitle: { 
    color: '#666', 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    marginTop: 25, 
    letterSpacing: 1 
  },
  
  // Option
  option: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#161626', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 8 
  },
  optionLeft: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1 
  },
  iconBg: { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    backgroundColor: 'rgba(0, 229, 255, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  iconBgDanger: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
  },
  optionText: { 
    color: '#eee', 
    fontSize: 15,
    fontWeight: '500' 
  },
  dangerText: {
    color: '#FF453A',
  },
  optionSubtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    color: '#888',
    fontSize: 14,
    marginRight: 10,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
  },
  footerSubtext: {
    color: '#444',
    fontSize: 11,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#161626',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  modalOptionText: {
    color: '#ccc',
    fontSize: 16,
  },
  selectedText: {
    color: '#00E5FF',
    fontWeight: '600',
  },
  modalClose: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});