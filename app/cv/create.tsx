import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';

const CV_TYPES = ['Professional CV', 'Student CV', 'Academic CV', 'Resume'];

export default function CreateCvScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState('Professional CV');
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const data = await api.getTemplates();
        setTemplates(data || []);
        if (data && data.length > 0) {
          setSelectedTemplateId(data[0].id);
        }
      } catch (err) {
        console.log('Failed to fetch templates:', err);
      }
    }
    loadTemplates();
  }, []);

  async function handleCreate() {
    if (!title) {
      Alert.alert('Required', 'Please enter a title for your CV.');
      return;
    }
    if (!selectedTemplateId) {
      Alert.alert('Required', 'Please select an initial template.');
      return;
    }

    setLoading(true);
    try {
      const newCv = await api.createCv({
        title,
        cvType: selectedType,
        templateId: selectedTemplateId,
      });

      router.replace(`/cv/${newCv.id}/personal` as any);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create CV');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Start New CV</Text>
      <Text style={styles.sub}>Choose a title and document type to begin.</Text>

      <Text style={styles.label}>CV / Document Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Senior Software Engineer CV"
        placeholderTextColor="#94a3b8"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>What type of CV are you creating?</Text>
      <View style={styles.typeGrid}>
        {CV_TYPES.map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.typeBadge, selectedType === type && styles.typeBadgeActive]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[styles.typeText, selectedType === type && styles.typeTextActive]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Initial Template</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
        {templates.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.templateCard, selectedTemplateId === t.id && styles.templateCardActive]}
            onPress={() => setSelectedTemplateId(t.id)}
          >
            <Text style={styles.templateName}>{t.name}</Text>
            <Text style={styles.templateBadge}>{t.isPremium ? 'PREMIUM' : 'FREE'}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.btnPrimary} onPress={handleCreate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnPrimaryText}>Continue to Personal Info</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  sub: { fontSize: 14, color: '#64748b', marginTop: 4, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 14, fontSize: 15, color: '#0f172a' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeBadge: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  typeBadgeActive: { backgroundColor: '#0284c7', borderColor: '#0284c7' },
  typeText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  typeTextActive: { color: '#ffffff', fontWeight: 'bold' },
  templateCard: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 10, padding: 16, width: 140, marginRight: 10, alignItems: 'center' },
  templateCardActive: { borderColor: '#0284c7', backgroundColor: '#f0f9ff' },
  templateName: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  templateBadge: { fontSize: 10, color: '#64748b', marginTop: 6, fontWeight: 'bold' },
  btnPrimary: { backgroundColor: '#0284c7', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  btnPrimaryText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
});
