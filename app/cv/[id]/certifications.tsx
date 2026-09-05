import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';

export default function CertificationsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [issuingOrganization, setIssuingOrganization] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [adding, setAdding] = useState(false);

  async function loadData() {
    try {
      const res = await api.getCvById(id!);
      setCertifications(res.certifications || []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load certifications');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function handleAddCert() {
    if (!name) {
      Alert.alert('Required', 'Please enter certification name.');
      return;
    }

    setAdding(true);
    try {
      await api.addCertification(id!, {
        name,
        issuingOrganization,
        issueDate,
        credentialId,
      });

      setName('');
      setIssuingOrganization('');
      setIssueDate('');
      setCredentialId('');
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not add certification');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(certId: string) {
    try {
      await api.deleteCertification(id!, certId);
      setCertifications((prev: any[]) => prev.filter((c: any) => c.id !== certId));
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not delete certification');
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Certifications & Licenses</Text>

      {certifications.map(c => (
        <View key={c.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{c.name}</Text>
            <TouchableOpacity onPress={() => handleDelete(c.id)}>
              <Text style={styles.btnDelete}>Remove</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sub}>{c.issuingOrganization || ''} {c.issueDate ? `(${c.issueDate})` : ''}</Text>
        </View>
      ))}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>+ Add Certification Entry</Text>

        <Text style={styles.label}>Certification Title</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="AWS Certified Solutions Architect" />

        <Text style={styles.label}>Issuing Organization</Text>
        <TextInput style={styles.input} value={issuingOrganization} onChangeText={setIssuingOrganization} placeholder="Amazon Web Services" />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Issue Date</Text>
            <TextInput style={styles.input} value={issueDate} onChangeText={setIssueDate} placeholder="2023" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Credential ID</Text>
            <TextInput style={styles.input} value={credentialId} onChangeText={setCredentialId} placeholder="AWS-12345" />
          </View>
        </View>

        <TouchableOpacity style={styles.btnAdd} onPress={handleAddCert} disabled={adding}>
          {adding ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnAddText}>Add Certification</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnNext} onPress={() => router.push(`/cv/${id}/preview` as any)}>
        <Text style={styles.btnNextText}>Finish & Live A4 Preview ➔</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  btnDelete: { color: '#ef4444', fontWeight: 'bold', fontSize: 12 },
  sub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, marginTop: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: '#0284c7', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 14, color: '#0f172a' },
  btnAdd: { backgroundColor: '#0284c7', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  btnAddText: { color: '#ffffff', fontWeight: 'bold' },
  btnNext: { backgroundColor: '#0f766e', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  btnNextText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
