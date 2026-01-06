import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="movie/[id]" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }}
        />
      </Stack>
    </>
  );
}