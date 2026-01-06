import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

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
});