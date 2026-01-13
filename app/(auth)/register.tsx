import { auth, db } from "@/configs/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform, // Thêm Platform để nhận diện Web/Mobile
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Hàm hiện thông báo cho cả Web và Mobile
  const showAlert = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  const handleRegister = async () => {
    // --- PHẦN RÀNG BUỘC DỮ LIỆU THÊM MỚI ---
    if (!fullName) {
      showAlert("Lỗi", "Vui lòng nhập Họ và tên");
      return;
    }
    if (!email || !email.includes('@')) {
      showAlert("Lỗi", "Email không hợp lệ");
      return;
    }
    if (password.length < 6) {
      showAlert("Lỗi", "Mật khẩu phải từ 6 ký tự trở lên");
      return;
    }
    if (password !== confirmPassword) {
      showAlert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }
    // --- KẾT THÚC PHẦN THÊM MỚI ---

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: fullName,
        email: email,
        membership: "FREE",
        watchTime: "0h",
        favoriteMovies: [],
        purchasedMovies: [],
        photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
        createdAt: new Date().toISOString(),
      });

      showAlert("Thành công", "Tài khoản đã được tạo!");
      router.replace('/(tabs)');

    } catch (error: any) {
      console.error(error);
      let msg = "Không thể đăng ký tài khoản.";
      if (error.code === 'auth/email-already-in-use') msg = "Email này đã được sử dụng!";
      showAlert("Thất bại", msg);
    } finally {
      setLoading(false);
    }
  };

  // GIỮ NGUYÊN TOÀN BỘ PHẦN GIAO DIỆN CỦA BẠN
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
           <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Tạo tài khoản mới</Text>
          <Text style={styles.subtitle}>Cùng tham gia cộng đồng yêu điện ảnh lớn nhất Việt Nam</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Họ và Tên</Text>
          <TextInput style={styles.input} placeholder="Nguyễn Văn A" placeholderTextColor="#666" value={fullName} onChangeText={setFullName} />

          <Text style={[styles.label, { marginTop: 15 }]}>Email</Text>
          <TextInput style={styles.input} placeholder="vi-du@gmail.com" placeholderTextColor="#666" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          <Text style={[styles.label, { marginTop: 15 }]}>Mật khẩu</Text>
          <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#666" value={password} onChangeText={setPassword} secureTextEntry />

          <Text style={[styles.label, { marginTop: 15 }]}>Xác nhận mật khẩu</Text>
          <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#666" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerButtonText}>ĐĂNG KÝ NGAY</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// GIỮ NGUYÊN TOÀN BỘ STYLES CỦA BẠN
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  scrollContent: { paddingHorizontal: 30, paddingVertical: 40 },
  backIcon: { marginBottom: 20 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 15, color: '#888', marginTop: 8 },
  inputContainer: { marginBottom: 30 },
  label: { color: '#ccc', fontSize: 13, marginBottom: 8 },
  input: { backgroundColor: '#1a1a2a', borderRadius: 15, padding: 15, color: '#fff', borderWidth: 1, borderColor: '#2a2a3a' },
  registerButton: { backgroundColor: '#e21221', borderRadius: 15, paddingVertical: 18, alignItems: 'center' },
  registerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText: { color: '#888' },
  loginLink: { color: '#e21221', fontWeight: 'bold' },
});