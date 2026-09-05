import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';

export default function DashboardScreen() {
  const router = useRouter();
  const [cvList, setCvList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadCvs() {
    try {
      const data = await api.getCvs();
      setCvList(data || []);
    } catch (err) {
      console.log('Failed to load CVs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCvs();
  }, []);

  function getGreeting() {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning ☀️';
    if (hours < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadCvs(); }} />}
    >
      <View style={styles.bannerBox}>
        <Text style={styles.greetingText}>{getGreeting()}</Text>
        <Text style={styles.bannerSubtitle}>Ready to generate your next professional resume?</Text>

        <TouchableOpacity style={styles.btnCreate} onPress={() => router.push('/cv/create')}>
          <Text style={styles.btnCreateText}>+ Create New CV</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Resumes & CVs ({cvList.length})</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />
      ) : cvList.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No CVs Created Yet</Text>
          <Text style={styles.emptySub}>Tap below to start building your first structured CV!</Text>
          <TouchableOpacity style={styles.btnEmpty} onPress={() => router.push('/cv/create')}>
            <Text style={styles.btnEmptyText}>Start Building</Text>
          </TouchableOpacity>
        </View>
      ) : (
        cvList.map(item => (
          <View key={item.id} style={styles.cvCard}>
            <View style={styles.cvInfo}>
              <Text style={styles.cvTitle}>{item.title}</Text>
              <Text style={styles.cvMeta}>{item.cvType || 'Professional CV'} • Template: {item.templateName || 'Classic'}</Text>
              <Text style={styles.cvDate}>Updated {new Date(item.updatedAt).toLocaleDateString()}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.btnActionSec} onPress={() => router.push(`/cv/${item.id}/personal` as any)}>
                <Text style={styles.btnActionSecText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnActionPri} onPress={() => router.push(`/cv/${item.id}/preview` as any)}>
                <Text style={styles.btnActionPriText}>Preview PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  bannerBox: { backgroundColor: '#0f172a', borderRadius: 16, padding: 24, marginBottom: 24 },
  greetingText: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  bannerSubtitle: { fontSize: 14, color: '#94a3b8', marginTop: 6, marginBottom: 20 },
  btnCreate: { backgroundColor: '#0284c7', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  btnCreateText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  emptyCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#334155' },
  emptySub: { fontSize: 13, color: '#64748b', marginTop: 6, textAlign: 'center', marginBottom: 18 },
  btnEmpty: { backgroundColor: '#0284c7', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  btnEmptyText: { color: '#ffffff', fontWeight: '600' },
  cvCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  cvInfo: { marginBottom: 14 },
  cvTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
  cvMeta: { fontSize: 13, color: '#64748b', marginTop: 4 },
  cvDate: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 10 },
  btnActionSec: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  btnActionSecText: { color: '#334155', fontWeight: '600' },
  btnActionPri: { flex: 1, backgroundColor: '#0284c7', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  btnActionPriText: { color: '#ffffff', fontWeight: '600' },
});
