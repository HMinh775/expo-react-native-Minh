import { Ionicons } from '@expo/vector-icons'; // Hoặc bộ icon bạn thích
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileOptionProps {
  iconName: keyof typeof Ionicons.glyphMap; // Tên icon
  title: string;
  route?: Href; // Đường dẫn khi bấm vào (optional)
  onPress?: () => void; // Hàm xử lý riêng (vd: Đăng xuất)
  color?: string; // Màu của icon (mặc định là đen hoặc xám)
}

export default function ProfileOption({ iconName, title, route, onPress, color = '#333' }: ProfileOptionProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (route) {
      router.push(route);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.left}>
        {/* Icon bên trái */}
        <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={22} color={color} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {/* Mũi tên bên phải */}
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 35, // Cố định chiều rộng để text thẳng hàng
    alignItems: 'center', // Canh giữa icon
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
});