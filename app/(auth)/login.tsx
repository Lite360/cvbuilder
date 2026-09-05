import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { saveAuthToken } from '../../services/storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login({ email, password });
      await saveAuthToken(res.token);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.logoTitle}>CV Builder</Text>
        <Text style={styles.subtitle}>Create & export professional CVs in minutes</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Sign In</Text>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="user@example.com"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.btnPrimaryText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.switchBox}>
          <Text style={styles.switchText}>Don't have an account? <Text style={styles.highlight}>Create Account</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/admin/index' as any)} style={{ marginTop: 25, alignment: 'center' }}>
          <Text style={{ textAlign: 'center', color: '#64748b', fontSize: 13, textDecorationLine: 'underline' }}>
            Switch to Admin Portal
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', padding: 20 },
  headerBox: { alignItems: 'center', marginBottom: 30 },
  logoTitle: { fontSize: 32, fontWeight: 'bold', color: '#38bdf8', letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 5, textAlign: 'center' },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 15, color: '#0f172a', marginBottom: 16 },
  btnPrimary: { backgroundColor: '#0284c7', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  btnPrimaryText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  switchBox: { marginTop: 18, alignItems: 'center' },
  switchText: { fontSize: 14, color: '#64748b' },
  highlight: { color: '#0284c7', fontWeight: 'bold' },
});
