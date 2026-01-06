import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function TicketsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vé của tôi</Text>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bạn chưa có vé nào. Hãy đặt vé ngay!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 16 }
});