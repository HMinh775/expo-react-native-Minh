import { IconSymbol } from '@/components/ui/IconSymbol'; // Hoặc icon bạn dùng
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#000' }}>
      <Tabs.Screen
        name="index" // Tương ứng với index.tsx (Home)
        options={{ title: 'Home', tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} /> }}
      />
      <Tabs.Screen
        name="search" // Tương ứng với search.tsx
        options={{ title: 'Search', tabBarIcon: ({ color }) => <IconSymbol name="magnifyingglass" color={color} /> }}
      />
      <Tabs.Screen
        name="bookings" // Tương ứng với bookings.tsx
        options={{ title: 'My Bookings', tabBarIcon: ({ color }) => <IconSymbol name="ticket.fill" color={color} /> }}
      />
      <Tabs.Screen
        name="profile" // Tương ứng với profile.tsx
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <IconSymbol name="person.fill" color={color} /> }}
      />
    </Tabs>
  );
}