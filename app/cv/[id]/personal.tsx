import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';

export default function PersonalInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [professionalSummary, setProfessionalSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getCvById(id!);
        const p = res.profile || {};
        setFullName(p.fullName || '');
        setProfessionalTitle(p.professionalTitle || '');
        setEmail(p.email || '');
        setPhone(p.phone || '');
        setLocation(p.location || '');
        setLinkedinUrl(p.linkedinUrl || '');
        setWebsiteUrl(p.websiteUrl || '');
        setProfessionalSummary(p.professionalSummary || '');
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to load personal profile');
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.updateProfile(id!, {
        fullName,
        professionalTitle,
        email,
        phone,
        location,
        linkedinUrl,
        websiteUrl,
        professionalSummary,
      });
      Alert.alert('Saved', 'Personal profile updated!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  }

  async function handleAiEnhance() {
    if (!professionalSummary) {
      Alert.alert('AI Writing', 'Enter a rough summary first, and AI will professionalize it.');
      return;
    }

    setEnhancing(true);
    try {
      const res = await api.enhanceContent({
        type: 'summary',
        text: professionalSummary,
        jobTitle: professionalTitle,
      });
      setProfessionalSummary(res.enhanced);
    } catch (err: any) {
      Alert.alert('AI Error', err.message || 'Could not enhance summary');
    } finally {
      setEnhancing(false);
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Personal Information</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="John Doe" />

      <Text style={styles.label}>Professional Title</Text>
      <TextInput style={styles.input} value={professionalTitle} onChangeText={setProfessionalTitle} placeholder="Senior Frontend Engineer" />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
      </View>

      <Text style={styles.label}>Location / City, Country</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Lagos, Nigeria" />

      <Text style={styles.label}>LinkedIn Profile URL</Text>
      <TextInput style={styles.input} value={linkedinUrl} onChangeText={setLinkedinUrl} placeholder="https://linkedin.com/in/username" />

      <View style={styles.summaryHeader}>
        <Text style={styles.label}>Professional Summary</Text>
        <TouchableOpacity style={styles.btnAi} onPress={handleAiEnhance} disabled={enhancing}>
          {enhancing ? <ActivityIndicator size="small" color="#7c3aed" /> : <Text style={styles.btnAiText}>✨ AI Enhance</Text>}
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={professionalSummary}
        onChangeText={setProfessionalSummary}
        multiline
        placeholder="Brief summary of your professional expertise and key achievements..."
      />

      <TouchableOpacity style={styles.btnSave} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSaveText}>Save Profile</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnNext} onPress={() => router.push(`/cv/${id}/experience` as any)}>
        <Text style={styles.btnNextText}>Next: Work Experience ➔</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 14, color: '#0f172a' },
  row: { flexDirection: 'row', gap: 12 },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  btnAi: { backgroundColor: '#f3e8ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  btnAiText: { color: '#7c3aed', fontWeight: 'bold', fontSize: 12 },
  btnSave: { backgroundColor: '#0284c7', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  btnSaveText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  btnNext: { backgroundColor: '#0f172a', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 12, marginBottom: 40 },
  btnNextText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
