import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default function ScheduleScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lịch chiếu phim</Text>
      <Text style={styles.subtitle}>Chọn rạp và thời gian xem phim</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  subtitle: { color: '#888', fontSize: 14, marginTop: 5 }
});