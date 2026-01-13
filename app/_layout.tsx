import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { auth } from '../configs/firebaseConfig';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!navigationState?.key) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const inAuthGroup = segments[0] === '(auth)';

      if (initializing) setInitializing(false);

      // Chờ 1 nhịp để Router sẵn sàng
      setTimeout(() => {
        if (!user && !inAuthGroup) {
          router.replace('/login');
        } else if (user && inAuthGroup) {
          router.replace('/(tabs)');
        }
      }, 1);
    });

    return unsubscribe;
  }, [segments, navigationState?.key, initializing]);

  if (initializing || !navigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' }}>
        <ActivityIndicator size="large" color="#e21221" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="movie/booking" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="payment/success" />
      </Stack>
    </>
  );
}