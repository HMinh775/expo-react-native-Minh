import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
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

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return false;
    }
    if (!acceptTerms) {
      Alert.alert('Lỗi', 'Vui lòng đồng ý với điều khoản dịch vụ');
      return false;
    }
    return true;
  };

  const handleRegister = () => {
    if (!validateForm()) return;
    
    console.log('Đăng ký với:', formData);
    Alert.alert(
      'Thành công', 
      'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Sau khi đăng ký thành công, có thể:
            // 1. Quay lại trang đăng nhập
            router.back();
            // 2. Hoặc chuyển thẳng đến trang xác thực email
            // router.push('/verify-email');
          }
        }
      ]
    );
  };

  const handleSocialRegister = (platform: string) => {
    Alert.alert('Đăng ký', `Đăng ký với ${platform}`);
    // Xử lý đăng ký social ở đây
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
          
          {/* Header với nút back */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Đăng ký</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          {/* Logo và tiêu đề */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="person-add" size={70} color="#007AFF" />
              </View>
              <Text style={styles.appName}>MyApp</Text>
            </View>
            
            <Text style={styles.title}>Tạo tài khoản mới</Text>
            <Text style={styles.subtitle}>
              Điền thông tin để bắt đầu hành trình với chúng tôi
            </Text>
          </View>

          {/* Form đăng ký */}
          <View style={styles.form}>
            {/* Họ và tên */}
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <FontAwesome name="user" size={20} color="#666" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Họ và tên đầy đủ"
                placeholderTextColor="#999"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <MaterialIcons name="email" size={20} color="#666" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ email"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Số điện thoại (tuỳ chọn) */}
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Feather name="phone" size={20} color="#666" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại (tuỳ chọn)"
                placeholderTextColor="#999"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                keyboardType="phone-pad"
              />
            </View>

            {/* Mật khẩu */}
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Ionicons name="lock-closed" size={20} color="#666" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu (ít nhất 6 ký tự)"
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

            {/* Xác nhận mật khẩu */}
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

            {/* Điều khoản dịch vụ */}
            {/* <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.termsText}>
                Tôi đồng ý với{' '}
                <Text style={styles.termsLink} onPress={() => router.push('/terms')}>
                  Điều khoản dịch vụ
                </Text>{' '}
                và{' '}
                <Text style={styles.termsLink} onPress={() => router.push('/privacy')}>
                  Chính sách bảo mật
                </Text>
              </Text>
            </TouchableOpacity> */}

            {/* Nút đăng ký */}
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Đăng ký tài khoản</Text>
              <Ionicons name="arrow-forward-circle" size={22} color="#fff" style={{ marginLeft: 10 }} />
            </TouchableOpacity>

            {/* Hoặc đăng ký với */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc đăng ký với</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Nút mạng xã hội */}
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialRegister('Google')}
              >
                <View style={styles.socialIcon}>
                  <FontAwesome name="google" size={20} color="#DB4437" />
                </View>
                <Text style={[styles.socialButtonText, styles.googleText]}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialRegister('Facebook')}
              >
                <View style={styles.socialIcon}>
                  <FontAwesome name="facebook" size={20} color="#4267B2" />
                </View>
                <Text style={[styles.socialButtonText, styles.facebookText]}>Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Đã có tài khoản? */}
            <View style={styles.loginRedirect}>
              <Text style={styles.loginText}>Đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}> Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>

            {/* Ưu điểm khi đăng ký */}
            <View style={styles.benefits}>
              <Text style={styles.benefitsTitle}>Tại sao nên đăng ký?</Text>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.benefitText}>Lưu lịch sử và cài đặt cá nhân</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.benefitText}>Đồng bộ trên nhiều thiết bị</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.benefitText}>Nhận ưu đãi và thông báo mới nhất</Text>
              </View>
            </View>

          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bằng việc đăng ký, bạn xác nhận đã đủ 16 tuổi trở lên
            </Text>
            <Text style={[styles.footerText, { marginTop: 5 }]}>
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
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 30,
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
    fontSize: 24,
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
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
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
    marginRight: 12,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
    marginTop: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#007AFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  registerButton: {
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
  registerButtonText: {
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
  loginRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  benefits: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
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