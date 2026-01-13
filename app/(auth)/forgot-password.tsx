// File: app/(auth)/forgot-password.tsx
import { auth } from "@/configs/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from "firebase/auth";
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sent, setSent] = useState(false);

  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      Alert.alert("Thành công", "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.");
    } catch (error: any) {
      Alert.alert("Lỗi", "Email không tồn tại hoặc lỗi hệ thống");
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
              <Ionicons name="lock-open-outline" size={42} color="#fff" />
            </View>
            <Text style={styles.brandText}>MOVIE<Text style={{color: '#e21221'}}>HUB</Text></Text>
            <Text style={styles.title}>Quên mật khẩu?</Text>
            <Text style={styles.subtitle}>Nhập email để nhận link đặt lại mật khẩu</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Email của bạn</Text>
            <View style={[styles.inputBox, focused && styles.inputBoxFocused]}>
              <Ionicons name="mail-outline" size={20} color={focused ? '#e21221' : '#555'} />
              <TextInput
                style={styles.textInput}
                placeholder="minh.admin@test.com"
                placeholderTextColor="#333"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity 
              style={styles.loginBtn} 
              onPress={handleResetPassword} 
              disabled={loading || sent}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : sent ? (
                <Text style={styles.loginBtnText}>ĐÃ GỬI EMAIL</Text>
              ) : (
                <Text style={styles.loginBtnText}>GỬI LINK</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backRow} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back-outline" size={20} color="#e21221" />
              <Text style={styles.backText}>Quay lại đăng nhập</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A10' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 35, justifyContent: 'center', paddingVertical: 50 },
  
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { width: 75, height: 75, backgroundColor: '#e21221', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 10 },
  brandText: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#fff', fontSize: 18, marginTop: 8, fontWeight: '600' },
  subtitle: { color: '#ccc', fontSize: 14, marginTop: 5, textAlign: 'center', lineHeight: 20 },

  form: { width: '100%' },
  inputLabel: { color: '#444', fontSize: 12, marginBottom: 10, fontWeight: 'bold', textTransform: 'uppercase' },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12131B',
    height: 60,
    borderRadius: 18,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#1A1B25',
  },
  inputBoxFocused: {
    borderColor: '#e21221',
    backgroundColor: '#151621',
  },
  textInput: {
    flex: 1,
    height: '100%',
    marginLeft: 15,
    color: '#fff', 
    fontSize: 16,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        boxShadow: 'none',
      }
    })
  } as any,

  loginBtn: { 
    backgroundColor: '#e21221', 
    height: 60, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 35, 
    shadowColor: '#e21221', 
    shadowOpacity: 0.4, 
    shadowRadius: 15, 
    shadowOffset: {width:0, height:8} 
  },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1 },

  backRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 25,
    gap: 8
  },
  backText: { color: '#e21221', fontSize: 16, fontWeight: '600' }
});
