import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f0f1a',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#e21221',
        tabBarInactiveTintColor: '#444',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Trang chủ', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} /> }} />
      <Tabs.Screen name="schedule" options={{ title: 'Lịch chiếu', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "calendar" : "calendar-outline"} size={24} color={color} /> }} />
      <Tabs.Screen name="tickets" options={{ title: 'Vé của tôi', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "ticket" : "ticket-outline"} size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Tài khoản', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} /> }} />
    </Tabs>
  );
}