<<<<<<< HEAD
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
=======
import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator // Thêm vòng xoay loading
  ,

  Alert,
  KeyboardAvoidingView,
  Platform,
>>>>>>> 7bd92f365153ec1161411497496a958028054476
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
<<<<<<< HEAD
  View,
} from 'react-native';
// Import từ config bạn đã tạo
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../configs/firebaseConfig";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    // 1. Kiểm tra dữ liệu đầu vào
    if (!fullName || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      // 2. Tạo tài khoản trên Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Cập nhật tên hiển thị trong Profile của Auth
      await updateProfile(user, { displayName: fullName });

      // 4. LƯU DỮ LIỆU VÀO FIRESTORE (Database)
      // Tạo một bản ghi trong bộ sưu tập "users" với ID là UID của user
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: fullName,
        email: email,
        createdAt: new Date().toISOString(),
        membership: "Free", // Mặc định khi mới đăng ký
      });

      Alert.alert("Thành công", "Tài khoản của bạn đã được tạo!", [
        { text: "Đến trang chủ", onPress: () => router.replace('/(tabs)') }
      ]);

    } catch (error: any) {
      console.error(error);
      let errorMessage = "Không thể đăng ký tài khoản.";
      if (error.code === 'auth/email-already-in-use') errorMessage = "Email này đã được sử dụng!";
      if (error.code === 'auth/invalid-email') errorMessage = "Email không hợp lệ!";
      
      Alert.alert("Đăng ký thất bại", errorMessage);
    } finally {
      setLoading(false);
=======
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
>>>>>>> 7bd92f365153ec1161411497496a958028054476
    }
  };

  return (
    <SafeAreaView style={styles.container}>
<<<<<<< HEAD
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subtitle}>Đăng ký để xem hàng ngàn bộ phim hấp dẫn</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Họ và Tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Nguyễn Văn A"
            placeholderTextColor="#666"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Ít nhất 6 ký tự"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Xác nhận mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#666"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Đăng Ký</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
=======
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
>>>>>>> 7bd92f365153ec1161411497496a958028054476
    </SafeAreaView>
  );
}

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a2a',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a3a',
  },
  registerButton: {
    backgroundColor: '#e21221',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    color: '#888',
  },
  loginLink: {
    color: '#e21221',
    fontWeight: 'bold',
  },
=======
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
>>>>>>> 7bd92f365153ec1161411497496a958028054476
});