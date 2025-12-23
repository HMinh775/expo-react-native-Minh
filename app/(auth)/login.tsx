 
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// 1. IMPORT HOOK AUTH
import { useAuth } from '@/constants/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  
  // 2. LẤY HÀM LOGIN TỪ CONTEXT
  const { login } = useAuth(); 

  const [isLoginMode, setIsLoginMode] = useState(true); // true: Đăng nhập, false: Đăng ký
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = () => {
    // Validate cơ bản
    if (!formData.email || !formData.password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (isLoginMode) {
      // --- XỬ LÝ ĐĂNG NHẬP ---
      
      // Giả lập API call thành công...
      console.log('Đang đăng nhập...');
      
      // 3. GỌI HÀM LOGIN CỦA CONTEXT ĐỂ CẬP NHẬT TRẠNG THÁI TOÀN CỤC
      // (Trong thực tế, name sẽ được trả về từ server)
      login({
        email: formData.email,
        password: formData.password,
        name: formData.name || 'Người dùng Demo', // Lấy tên nếu có, hoặc dùng tên mặc định
      });

      Alert.alert('Thành công', 'Đăng nhập thành công!');
      
      // 4. QUAY VỀ TRANG TRƯỚC (PROFILE)
      router.dismiss(); 

    } else {
      // --- XỬ LÝ ĐĂNG KÝ ---
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');
        return;
      }
      if (!formData.name) {
        Alert.alert('Lỗi', 'Vui lòng nhập họ tên!');
        return;
      }

      console.log('Đăng ký thành công:', formData);
      Alert.alert('Thành công', 'Đăng ký thành công! Vui lòng đăng nhập.');
      
      // Chuyển sang mode đăng nhập và giữ lại email/pass để người dùng đỡ phải nhập lại
      setIsLoginMode(true);
      setFormData(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleSocialLogin = (platform: string) => {
    // Giả lập login social
    login({
        email: `${platform.toLowerCase()}@user.com`,
        name: `User ${platform}`,
        password: 'social-login'
    });
    Alert.alert('Thành công', `Đăng nhập ${platform} thành công!`);
    router.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          
          {/* Logo và Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="person-circle" size={80} color="#007AFF" />
              </View>
              <Text style={styles.appName}>MyApp</Text>
            </View>
            
            <Text style={styles.title}>
              {isLoginMode ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
            </Text>
            <Text style={styles.subtitle}>
              {isLoginMode 
                ? 'Đăng nhập để tiếp tục trải nghiệm' 
                : 'Điền thông tin để bắt đầu'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLoginMode && (
              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <FontAwesome name="user" size={20} color="#666" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Họ và tên"
                  placeholderTextColor="#999"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <MaterialIcons name="email" size={20} color="#666" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Ionicons name="lock-closed" size={20} color="#666" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {!isLoginMode && (
              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <Ionicons name="lock-closed" size={20} color="#666" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Xác nhận mật khẩu"
                  placeholderTextColor="#999"
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
            )}

            {isLoginMode && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            )}

            {/* Nút chính */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {isLoginMode ? 'Đăng nhập' : 'Đăng ký'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 10 }} />
            </TouchableOpacity>

            {/* Hoặc đăng nhập với */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Nút mạng xã hội */}
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialLogin('Google')}
              >
                <View style={styles.socialIcon}>
                  <FontAwesome name="google" size={20} color="#DB4437" />
                </View>
                <Text style={[styles.socialButtonText, styles.googleText]}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <View style={styles.socialIcon}>
                  <FontAwesome name="facebook" size={20} color="#4267B2" />
                </View>
                <Text style={[styles.socialButtonText, styles.facebookText]}>Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Chuyển đổi giữa đăng nhập/đăng ký */}
            <View style={styles.switchModeContainer}>
              <Text style={styles.switchModeText}>
                {isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              </Text>
              <TouchableOpacity onPress={() => setIsLoginMode(!isLoginMode)}>
                <Text style={styles.switchModeLink}>
                  {isLoginMode ? ' Đăng ký ngay' : ' Đăng nhập ngay'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Điều khoản */}
            {!isLoginMode && (
              <Text style={styles.termsText}>
                Bằng việc đăng ký, bạn đồng ý với{' '}
                <Text style={styles.termsLink}>Điều khoản dịch vụ</Text> và{' '}
                <Text style={styles.termsLink}>Chính sách bảo mật</Text>
              </Text>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 MyApp. Tất cả các quyền được bảo lưu.
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e6f2ff',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    paddingHorizontal: 25,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 15,
    height: 56,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 25,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#999',
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  facebookButton: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  googleText: {
    color: '#333',
  },
  facebookText: {
    color: '#333',
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchModeText: {
    color: '#666',
    fontSize: 14,
  },
  switchModeLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  termsLink: {
    color: '#007AFF',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 10,
  },
  footerText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
});