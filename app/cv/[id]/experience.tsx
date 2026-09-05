import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';

export default function ExperienceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);

  async function loadData() {
    try {
      const res = await api.getCvById(id!);
      setExperiences(res.experience || []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load work experiences');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function handleAddExperience() {
    if (!company || !jobTitle) {
      Alert.alert('Required', 'Please fill in Company and Job Title.');
      return;
    }

    setAdding(true);
    try {
      await api.addExperience(id!, {
        company,
        jobTitle,
        startDate,
        endDate,
        description,
      });

      setCompany('');
      setJobTitle('');
      setStartDate('');
      setEndDate('');
      setDescription('');
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not add experience');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(expId: string) {
    try {
      await api.deleteExperience(id!, expId);
      setExperiences((prev: any[]) => prev.filter((e: any) => e.id !== expId));
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not delete entry');
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Work Experience</Text>

      {experiences.map(exp => (
        <View key={exp.id} style={styles.expCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.jobTitle}>{exp.jobTitle} — {exp.company}</Text>
            <TouchableOpacity onPress={() => handleDelete(exp.id)}>
              <Text style={styles.btnDelete}>Remove</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.dates}>{exp.startDate || ''} – {exp.isCurrent ? 'Present' : (exp.endDate || '')}</Text>
          {exp.description ? <Text style={styles.desc}>{exp.description}</Text> : null}
        </View>
      ))}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>+ Add Experience Entry</Text>

        <Text style={styles.label}>Company Name</Text>
        <TextInput style={styles.input} value={company} onChangeText={setCompany} placeholder="Google / Microsoft" />

        <Text style={styles.label}>Job Title</Text>
        <TextInput style={styles.input} value={jobTitle} onChangeText={setJobTitle} placeholder="Senior Developer" />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} placeholder="Jan 2021" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>End Date</Text>
            <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="Present" />
          </View>
        </View>

        <Text style={styles.label}>Key Accomplishments / Responsibilities</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Developed high-throughput APIs and managed cross-functional teams..."
        />

        <TouchableOpacity style={styles.btnAdd} onPress={handleAddExperience} disabled={adding}>
          {adding ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnAddText}>Add Experience</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnNext} onPress={() => router.push(`/cv/${id}/education` as any)}>
        <Text style={styles.btnNextText}>Next: Education History ➔</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  expCard: { backgroundColor: '#ffffff', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  btnDelete: { color: '#ef4444', fontWeight: 'bold', fontSize: 12 },
  dates: { fontSize: 12, color: '#64748b', marginTop: 2 },
  desc: { fontSize: 13, color: '#334155', marginTop: 6 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, marginTop: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: '#0284c7', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 14, color: '#0f172a' },
  btnAdd: { backgroundColor: '#0284c7', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  btnAddText: { color: '#ffffff', fontWeight: 'bold' },
  btnNext: { backgroundColor: '#0f172a', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  btnNextText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
