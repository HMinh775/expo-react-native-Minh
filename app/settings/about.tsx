// app/settings/about.tsx
import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      {/* Cấu hình Header cho trang con */}
      <Stack.Screen options={{ title: 'Giới thiệu ứng dụng', headerBackTitle: 'Trở về' }} />
      
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Ứng dụng của Minh</Text>
      <Text style={{ marginTop: 10 }}>Phiên bản 1.1.3</Text>
      <Text>Được xây dựng bằng Expo & React Native.</Text>
    </View>
  );
}