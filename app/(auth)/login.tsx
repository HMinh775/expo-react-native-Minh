import { auth } from "@/configs/firebaseConfig";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert("Lỗi", "Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <MaterialCommunityIcons name="movie-roll" size={42} color="#fff" />
            </View>
            <Text style={styles.brandText}>MOVIE<Text style={{color: '#e21221'}}>HUB</Text></Text>
            <Text style={styles.title}>Chào mừng trở lại!</Text>
          </View>

          <View style={styles.form}>
            {/* EMAIL INPUT */}
            <Text style={styles.inputLabel}>Email của bạn</Text>
            <View style={[styles.inputBox, focused === 'email' && styles.inputBoxFocused]}>
              <Ionicons name="mail-outline" size={20} color={focused === 'email' ? '#e21221' : '#555'} />
              <TextInput
                style={styles.textInput}
                placeholder="minh.admin@test.com"
                placeholderTextColor="#333"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                autoCapitalize="none"
              />
            </View>

            {/* PASSWORD INPUT */}
           <View style={styles.passHeader}>
  <Text style={styles.inputLabel}>Mật khẩu</Text>
  <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
    <Text style={styles.forgotPass}>Quên mật khẩu?</Text>
  </TouchableOpacity>
</View>
            <View style={[styles.inputBox, focused === 'password' && styles.inputBoxFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={focused === 'password' ? '#e21221' : '#555'} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#333"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#555" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>ĐĂNG NHẬP</Text>}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} /><Text style={styles.dividerText}>Hoặc</Text><View style={styles.line} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-google" size={22} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-facebook" size={22} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} onPress={() => router.replace('/(tabs)')}><Ionicons name="person-outline" size={22} color="#fff" /></TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.registerRow} onPress={() => router.push('/(auth)/register')}>
            <Text style={{color: '#666'}}>Chưa có tài khoản? <Text style={styles.registerLink}>Đăng ký ngay</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A10' }, // Nút đen sâu
  scrollContent: { flexGrow: 1, paddingHorizontal: 35, justifyContent: 'center', paddingVertical: 50 },
  
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { width: 75, height: 75, backgroundColor: '#e21221', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 10 },
  brandText: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#fff', fontSize: 16, marginTop: 8, opacity: 0.6 },

  form: { width: '100%' },
  passHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  inputLabel: { color: '#444', fontSize: 12, marginBottom: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  forgotPass: { color: '#e21221', fontSize: 12 },

  // --- STYLE KHUNG NHẬP LIỆU ĐÃ FIX ---
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12131B', // Màu xám cực tối
    height: 60,
    borderRadius: 18,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#1A1B25', // Viền tối mờ
  },
  inputBoxFocused: {
    borderColor: '#e21221', // Rực đỏ khi chọn
    backgroundColor: '#151621',
  },
  textInput: {
    flex: 1,
    height: '100%',
    marginLeft: 15,
    color: '#fff', 
    fontSize: 16,
    // FIX QUAN TRỌNG: Loại bỏ mọi nền trắng của trình duyệt
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        outlineStyle: 'none', // Bỏ viền xanh Chrome
        boxShadow: 'none',
      }
    })
  } as any,

  loginBtn: { backgroundColor: '#e21221', height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 35, shadowColor: '#e21221', shadowOpacity: 0.4, shadowRadius: 15, shadowOffset: {width:0, height:8} },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1 },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 35 },
  line: { flex: 1, height: 1, backgroundColor: '#1A1B25' },
  dividerText: { color: '#333', fontSize: 12, marginHorizontal: 15, fontWeight: 'bold' },

  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  socialBtn: { width: 60, height: 60, backgroundColor: '#12131B', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#1A1B25' },

  registerRow: { alignItems: 'center', marginTop: 50 },
  registerLink: { color: '#e21221', fontWeight: 'bold' }
});