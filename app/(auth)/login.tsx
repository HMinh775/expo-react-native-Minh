import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from "../../configs/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // Kiểm tra đầu vào cơ bản
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Đăng nhập thành công:", user.email);
      
      // Chuyển hướng sang trang chính (tabs) sau khi đăng nhập thành công
      router.replace('/(tabs)'); 
    } catch (error: any) {
      console.error(error);
      let errorMessage = "Sai tài khoản hoặc mật khẩu!";
      if (error.code === 'auth/user-not-found') errorMessage = "Tài khoản không tồn tại!";
      if (error.code === 'auth/wrong-password') errorMessage = "Mật khẩu không chính xác!";
      
      Alert.alert("Đăng nhập thất bại", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Chào mừng trở lại!</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục trải nghiệm điện ảnh</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={[styles.label, { marginTop: 20 }]}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Đăng Nhập</Text>
          )}
        </TouchableOpacity>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a', // Màu nền tối đồng bộ với Profile
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
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
    fontWeight: '500',
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
  loginButton: {
    backgroundColor: '#e21221', // Màu đỏ thương hiệu của bạn
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#e21221',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
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
    fontSize: 14,
  },
  registerLink: {
    color: '#e21221',
    fontSize: 14,
    fontWeight: 'bold',
  },
});