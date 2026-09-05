import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { removeAuthToken } from '../../services/storage';

export default function ProfileScreen() {
  const router = useRouter();

  async function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await removeAuthToken();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account Overview</Text>
        <Text style={styles.infoText}>Manage your active session and preferences.</Text>

        <TouchableOpacity style={styles.btnDanger} onPress={handleLogout}>
          <Text style={styles.btnDangerText}>Sign Out of App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  infoText: { fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 20 },
  btnDanger: { backgroundColor: '#ef4444', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  btnDangerText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
