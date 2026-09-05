import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';

export default function MyCvsScreen() {
  const router = useRouter();
  const [cvList, setCvList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCvs() {
    try {
      const data = await api.getCvs();
      setCvList(data || []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load CVs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCvs();
  }, []);

  async function handleDelete(cvId: string, title: string) {
    Alert.alert(
      'Delete CV',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteCv(cvId);
              setCvList((prev: any[]) => prev.filter((c: any) => c.id !== cvId));
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Could not delete CV');
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={cvList}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No Saved Resumes</Text>
              <Text style={styles.emptySub}>Create your first structured CV to manage it here.</Text>
            </View>
          }
          renderItem={({ item }: { item: any }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id, item.title)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.meta}>{item.cvType} • Template: {item.templateName || 'Classic'}</Text>
              <Text style={styles.date}>Last modified: {new Date(item.updatedAt).toLocaleDateString()}</Text>

              <View style={styles.sectionBadges}>
                <TouchableOpacity style={styles.badge} onPress={() => router.push(`/cv/${item.id}/personal` as any)}>
                  <Text style={styles.badgeText}>Personal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.badge} onPress={() => router.push(`/cv/${item.id}/experience` as any)}>
                  <Text style={styles.badgeText}>Experience</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.badge} onPress={() => router.push(`/cv/${item.id}/education` as any)}>
                  <Text style={styles.badgeText}>Education</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.badge} onPress={() => router.push(`/cv/${item.id}/skills` as any)}>
                  <Text style={styles.badgeText}>Skills</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.btnPreview} onPress={() => router.push(`/cv/${item.id}/preview` as any)}>
                <Text style={styles.btnPreviewText}>Live Preview & Export PDF</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  emptyCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 30, alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#334155' },
  emptySub: { fontSize: 13, color: '#64748b', marginTop: 6, textAlign: 'center' },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  deleteText: { color: '#ef4444', fontWeight: '600', fontSize: 13 },
  meta: { fontSize: 13, color: '#475569', marginTop: 4 },
  date: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  sectionBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 14 },
  badge: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  badgeText: { fontSize: 12, color: '#0284c7', fontWeight: '600' },
  btnPreview: { backgroundColor: '#0284c7', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  btnPreviewText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});
