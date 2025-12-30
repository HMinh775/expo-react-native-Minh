import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator // Thêm vòng xoay loading
  ,

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

// --- IMPORT FIREBASE ---
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../configs/firebaseConfig';

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Quản lý trạng thái đang đăng ký
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true); // Để mặc định true cho nhanh hoặc mở comment checkbox bên dưới

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập họ và tên'); return false; }
    if (!formData.email.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập email'); return false; }
    if (!/\S+@\S+\.\S+/.test(formData.email)) { Alert.alert('Lỗi', 'Email không hợp lệ'); return false; }
    if (formData.password.length < 6) { Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự'); return false; }
    if (formData.password !== formData.confirmPassword) { Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp'); return false; }
    return true;
  };

  // --- HÀM XỬ LÝ ĐĂNG KÝ CHÍNH ---
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true); // Bắt đầu hiện loading
    try {
      // 1. Tạo tài khoản trên Firebase Auth (Email/Password)
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Lưu thông tin bổ sung (Tên, SĐT) vào Firestore
      // Chúng ta lưu vào collection "users", lấy ID là UID của Firebase Auth
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date().toISOString(),
      });

      setLoading(false);
      Alert.alert('Thành công', 'Tài khoản của bạn đã được tạo!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') } // Chuyển vào trang chủ
      ]);

    } catch (error: any) {
      setLoading(false);
      console.log(error.code);
      // Xử lý các lỗi phổ biến từ Firebase
      let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email này đã được sử dụng bởi tài khoản khác.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Địa chỉ email không hợp lệ.';
      }
      Alert.alert('Lỗi đăng ký', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Đăng ký</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="person-add" size={70} color="#007AFF" />
              </View>
              <Text style={styles.appName}>MyApp</Text>
            </View>
            <Text style={styles.title}>Tạo tài khoản mới</Text>
          </View>

          <View style={styles.form}>
            {/* Input Họ Tên */}
            <View style={styles.inputGroup}>
              <FontAwesome name="user" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Họ và tên đầy đủ"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />
            </View>

            {/* Input Email */}
            <View style={styles.inputGroup}>
              <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ email"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                autoCapitalize="none"
              />
            </View>

            {/* Input SĐT */}
            <View style={styles.inputGroup}>
              <Feather name="phone" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                keyboardType="phone-pad"
              />
            </View>

            {/* Input Mật khẩu */}
            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Xác nhận mật khẩu */}
            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu"
                secureTextEntry={!showConfirmPassword}
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Nút Đăng ký với Loading */}
            <TouchableOpacity 
              style={[styles.registerButton, loading && { backgroundColor: '#ccc' }]}
              onPress={handleRegister}
              disabled={loading} // Vô hiệu hóa khi đang xử lý
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.registerButtonText}>Đăng ký ngay</Text>
                  <Ionicons name="arrow-forward-circle" size={22} color="#fff" style={{ marginLeft: 10 }} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.loginRedirect}>
              <Text style={styles.loginText}>Đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}> Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Giữ nguyên các styles cũ của bạn dưới đây...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingBottom: 30 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    headerRightPlaceholder: { width: 40 },
    logoSection: { alignItems: 'center', paddingTop: 30, paddingHorizontal: 20 },
    logoContainer: { alignItems: 'center', marginBottom: 20 },
    logo: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f0f8ff', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: '#e6f2ff' },
    appName: { fontSize: 24, fontWeight: 'bold', color: '#007AFF', letterSpacing: 1 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 },
    form: { paddingHorizontal: 25, marginTop: 20 },
    inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e9ecef', paddingHorizontal: 15, height: 56 },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
    registerButton: { backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 25, marginTop: 10 },
    registerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    loginRedirect: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
    loginText: { color: '#666', fontSize: 14 },
    loginLink: { color: '#007AFF', fontSize: 14, fontWeight: 'bold' },
});