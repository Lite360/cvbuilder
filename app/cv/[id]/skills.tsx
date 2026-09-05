import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [skillName, setSkillName] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState('Intermediate');
  const [adding, setAdding] = useState(false);

  async function loadData() {
    try {
      const res = await api.getCvById(id!);
      setSkills(res.skills || []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function handleAddSkill() {
    if (!skillName) {
      Alert.alert('Required', 'Please enter a skill name.');
      return;
    }

    setAdding(true);
    try {
      await api.addSkill(id!, {
        skillName,
        proficiencyLevel,
      });

      setSkillName('');
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not add skill');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(skillId: string) {
    try {
      await api.deleteSkill(id!, skillId);
      setSkills((prev: any[]) => prev.filter((s: any) => s.id !== skillId));
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not delete skill');
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Skills & Competencies</Text>

      <View style={styles.skillsGrid}>
        {skills.map(s => (
          <View key={s.id} style={styles.skillBadge}>
            <Text style={styles.skillText}>{s.skillName} <Text style={{ fontSize: 11, color: '#0284c7' }}>({s.proficiencyLevel})</Text></Text>
            <TouchableOpacity onPress={() => handleDelete(s.id)}>
              <Text style={styles.btnRemove}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>+ Add Skill</Text>

        <Text style={styles.label}>Skill Name</Text>
        <TextInput style={styles.input} value={skillName} onChangeText={setSkillName} placeholder="TypeScript / React Native / Project Management" />

        <Text style={styles.label}>Proficiency Level</Text>
        <View style={styles.levelRow}>
          {PROFICIENCY_LEVELS.map(level => (
            <TouchableOpacity
              key={level}
              style={[styles.levelBtn, proficiencyLevel === level && styles.levelBtnActive]}
              onPress={() => setProficiencyLevel(level)}
            >
              <Text style={[styles.levelText, proficiencyLevel === level && styles.levelTextActive]}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btnAdd} onPress={handleAddSkill} disabled={adding}>
          {adding ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnAddText}>Add Skill</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnNext} onPress={() => router.push(`/cv/${id}/projects` as any)}>
        <Text style={styles.btnNextText}>Next: Key Projects ➔</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  skillBadge: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  skillText: { fontSize: 13, fontWeight: '600', color: '#0f172a' },
  btnRemove: { color: '#ef4444', fontWeight: 'bold', fontSize: 14 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, marginTop: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: '#0284c7', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 14, color: '#0f172a' },
  levelRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  levelBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#cbd5e1' },
  levelBtnActive: { backgroundColor: '#0284c7', borderColor: '#0284c7' },
  levelText: { fontSize: 12, color: '#475569' },
  levelTextActive: { color: '#ffffff', fontWeight: 'bold' },
  btnAdd: { backgroundColor: '#0284c7', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  btnAddText: { color: '#ffffff', fontWeight: 'bold' },
  btnNext: { backgroundColor: '#0f172a', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  btnNextText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
