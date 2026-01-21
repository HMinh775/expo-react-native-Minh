import { auth } from "@/configs/firebaseConfig";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert("Đăng nhập thất bại", "Email hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* BACKGROUND GRADIENT DECORATION */}
      <View style={styles.bgGradient} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          
          {/* HEADER SECTION */}
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <View style={styles.logoOuter}>
                <View style={styles.logoInner}>
                  <MaterialCommunityIcons name="movie-roll" size={32} color="#fff" />
                </View>
              </View>
            </View>
            
            <Text style={styles.appName}>
              MOVIE<Text style={styles.appNameAccent}>HUB</Text>
            </Text>
            <Text style={styles.tagline}>Trải nghiệm điện ảnh đỉnh cao</Text>
          </View>

          {/* MAIN FORM */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Đăng nhập</Text>
              <Text style={styles.formSubtitle}>Chào mừng bạn quay trở lại!</Text>
            </View>

            {/* EMAIL INPUT */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>
              <View style={[
                styles.inputContainer, 
                focused === 'email' && styles.inputFocused
              ]}>
                <View style={styles.iconBox}>
                  <Ionicons 
                    name="mail" 
                    size={20} 
                    color={focused === 'email' ? '#00E5FF' : '#888'} 
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  placeholderTextColor="#555"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* PASSWORD INPUT */}
            <View style={styles.inputWrapper}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Mật khẩu</Text>
                <TouchableOpacity 
                  onPress={() => router.push('/(auth)/forgot-password')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.forgotLink}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>
              <View style={[
                styles.inputContainer, 
                focused === 'password' && styles.inputFocused
              ]}>
                <View style={styles.iconBox}>
                  <Ionicons 
                    name="lock-closed" 
                    size={20} 
                    color={focused === 'password' ? '#00E5FF' : '#888'} 
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#555"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#888" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.buttonDisabled]} 
              onPress={handleLogin} 
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Đăng nhập</Text>
                  <Ionicons name="arrow-forward-circle" size={22} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {/* DIVIDER */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* SOCIAL LOGIN */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Ionicons name="logo-google" size={22} color="#fff" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Ionicons name="logo-facebook" size={22} color="#fff" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* GUEST LOGIN */}
            <TouchableOpacity 
              style={styles.guestButton}
              onPress={() => router.replace('/(tabs)')}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle-outline" size={20} color="#00E5FF" />
              <Text style={styles.guestText}>Tiếp tục với vai trò khách</Text>
            </TouchableOpacity>

          </View>

          {/* REGISTER SECTION */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Bạn chưa có tài khoản?</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/register')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  
  // ===== BACKGROUND DECORATION =====
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: '#0A0E1A',
    opacity: 0.9,
  },
  bgCircle1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#e21221',
    opacity: 0.08,
  },
  bgCircle2: {
    position: 'absolute',
    top: 100,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#00E5FF',
    opacity: 0.06,
  },

  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // ===== HEADER =====
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  logoOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(226, 18, 33, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e21221',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e21221',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 8,
  },
  appNameAccent: {
    color: '#e21221',
  },
  tagline: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  // ===== FORM CONTAINER =====
  formContainer: {
    backgroundColor: '#12151F',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  formHeader: {
    marginBottom: 28,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  formSubtitle: {
    fontSize: 15,
    color: '#999',
    fontWeight: '400',
  },

  // ===== INPUT STYLES =====
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#bbb',
    marginBottom: 12,
    marginLeft: 2,
    letterSpacing: 0.2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  forgotLink: {
    fontSize: 14,
    color: '#00E5FF',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1E2E',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#252938',
    height: 52,
    paddingHorizontal: 4,
  },
  inputFocused: {
    borderColor: '#00E5FF',
    backgroundColor: '#1E2333',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    height: '100%',
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      }
    })
  } as any,
  eyeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== BUTTONS =====
  loginButton: {
    backgroundColor: '#e21221',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#e21221',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // ===== DIVIDER =====
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#252938',
  },
  dividerText: {
    color: '#777',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 16,
    letterSpacing: 0.3,
  },

  // ===== SOCIAL BUTTONS =====
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1A1E2E',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#252938',
  },
  socialText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ===== GUEST BUTTON =====
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
  },
  guestText: {
    color: '#00E5FF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // ===== FOOTER =====
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 32,
  },
  footerText: {
    color: '#999',
    fontSize: 15,
    fontWeight: '400',
  },
  registerLink: {
    color: '#00E5FF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});