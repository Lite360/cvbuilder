import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';

export default function ProjectsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [projectName, setProjectName] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);

  async function loadData() {
    try {
      const res = await api.getCvById(id!);
      setProjects(res.projects || []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function handleAddProject() {
    if (!projectName) {
      Alert.alert('Required', 'Please enter a project name.');
      return;
    }

    setAdding(true);
    try {
      await api.addProject(id!, {
        projectName,
        technologies,
        projectUrl,
        description,
      });

      setProjectName('');
      setTechnologies('');
      setProjectUrl('');
      setDescription('');
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not add project');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(projectId: string) {
    try {
      await api.deleteProject(id!, projectId);
      setProjects((prev: any[]) => prev.filter((p: any) => p.id !== projectId));
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not delete project');
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Projects Highlight</Text>

      {projects.map(p => (
        <View key={p.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{p.projectName}</Text>
            <TouchableOpacity onPress={() => handleDelete(p.id)}>
              <Text style={styles.btnDelete}>Remove</Text>
            </TouchableOpacity>
          </View>
          {p.technologies ? <Text style={styles.tech}>Tech: {p.technologies}</Text> : null}
          {p.description ? <Text style={styles.desc}>{p.description}</Text> : null}
        </View>
      ))}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>+ Add Project Entry</Text>

        <Text style={styles.label}>Project Title</Text>
        <TextInput style={styles.input} value={projectName} onChangeText={setProjectName} placeholder="E-Commerce Mobile App" />

        <Text style={styles.label}>Technologies Used</Text>
        <TextInput style={styles.input} value={technologies} onChangeText={setTechnologies} placeholder="React Native, Node.js, PostgreSQL" />

        <Text style={styles.label}>Project Link / URL</Text>
        <TextInput style={styles.input} value={projectUrl} onChangeText={setProjectUrl} placeholder="https://github.com/user/project" />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Brief summary of project scope and key results..."
        />

        <TouchableOpacity style={styles.btnAdd} onPress={handleAddProject} disabled={adding}>
          {adding ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnAddText}>Add Project</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnNext} onPress={() => router.push(`/cv/${id}/certifications` as any)}>
        <Text style={styles.btnNextText}>Next: Certifications ➔</Text>
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
  tech: { fontSize: 12, color: '#0284c7', marginTop: 2, fontWeight: '600' },
  desc: { fontSize: 13, color: '#334155', marginTop: 4 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, marginTop: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: '#0284c7', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 14, color: '#0f172a' },
  btnAdd: { backgroundColor: '#0284c7', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  btnAddText: { color: '#ffffff', fontWeight: 'bold' },
  btnNext: { backgroundColor: '#0f172a', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  btnNextText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
