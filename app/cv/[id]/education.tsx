import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';

export default function EducationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [educations, setEducations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adding, setAdding] = useState(false);

  async function loadData() {
    try {
      const res = await api.getCvById(id!);
      setEducations(res.education || []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load education history');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function handleAddEducation() {
    if (!institution || !degree) {
      Alert.alert('Required', 'Please fill in Institution and Degree.');
      return;
    }

    setAdding(true);
    try {
      await api.addEducation(id!, {
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
      });

      setInstitution('');
      setDegree('');
      setFieldOfStudy('');
      setStartDate('');
      setEndDate('');
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not add education entry');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(eduId: string) {
    try {
      await api.deleteEducation(id!, eduId);
      setEducations((prev: any[]) => prev.filter((e: any) => e.id !== eduId));
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not delete entry');
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Education History</Text>

      {educations.map(edu => (
        <View key={edu.id} style={styles.eduCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.degree}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
            <TouchableOpacity onPress={() => handleDelete(edu.id)}>
              <Text style={styles.btnDelete}>Remove</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.institution}>{edu.institution}</Text>
          <Text style={styles.dates}>{edu.startDate || ''} – {edu.endDate || ''}</Text>
        </View>
      ))}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>+ Add Education Entry</Text>

        <Text style={styles.label}>Institution / University</Text>
        <TextInput style={styles.input} value={institution} onChangeText={setInstitution} placeholder="University of Lagos" />

        <Text style={styles.label}>Degree Obtained</Text>
        <TextInput style={styles.input} value={degree} onChangeText={setDegree} placeholder="Bachelor of Science (B.Sc)" />

        <Text style={styles.label}>Field of Study</Text>
        <TextInput style={styles.input} value={fieldOfStudy} onChangeText={setFieldOfStudy} placeholder="Computer Science" />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} placeholder="2018" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>End Date</Text>
            <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="2022" />
          </View>
        </View>

        <TouchableOpacity style={styles.btnAdd} onPress={handleAddEducation} disabled={adding}>
          {adding ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnAddText}>Add Education</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnNext} onPress={() => router.push(`/cv/${id}/skills` as any)}>
        <Text style={styles.btnNextText}>Next: Skills & Expertise ➔</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  eduCard: { backgroundColor: '#ffffff', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  degree: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  btnDelete: { color: '#ef4444', fontWeight: 'bold', fontSize: 12 },
  institution: { fontSize: 13, color: '#334155', marginTop: 2 },
  dates: { fontSize: 12, color: '#64748b', marginTop: 2 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, marginTop: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: '#0284c7', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 14, color: '#0f172a' },
  btnAdd: { backgroundColor: '#0284c7', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  btnAddText: { color: '#ffffff', fontWeight: 'bold' },
  btnNext: { backgroundColor: '#0f172a', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  btnNextText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
