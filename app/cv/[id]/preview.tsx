import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { api } from '../../../services/api';
import { renderCVTemplate } from '../../../templates';

export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [cvDetails, setCvDetails] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  async function loadData() {
    try {
      const [cvRes, tList] = await Promise.all([
        api.getCvById(id!),
        api.getTemplates(),
      ]);

      setCvDetails(cvRes);
      setTemplates(tList || []);

      const activeTemplate = tList.find((t: any) => t.id === cvRes.cv.templateId) || tList[0];
      setSelectedTemplate(activeTemplate);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load preview');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function handleSwitchTemplate(t: any) {
    setSelectedTemplate(t);
    try {
      await api.updateCv(id!, { templateId: t.id });
    } catch (err) {
      console.log('Failed to save template selection:', err);
    }
  }

  async function handleExportPdf() {
    setExporting(true);
    try {
      const pdfRes = await api.generatePdf(id!);

      if (pdfRes?.pdfUrl) {
        const fileUri = `${FileSystem.documentDirectory}cv_${id}.html`;
        await FileSystem.writeAsStringAsync(fileUri, pdfRes.htmlContent || '', { encoding: FileSystem.EncodingType.UTF8 });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/html',
            dialogTitle: 'Export your CV',
            UTI: 'public.html',
          });
        } else {
          Alert.alert('PDF Generated', `Document URL: ${pdfRes.pdfUrl}`);
        }
      }
    } catch (err: any) {
      Alert.alert('Export Error', err.message || 'Could not export PDF document');
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />;

  const cvDataModel = cvDetails ? {
    profile: cvDetails.profile || {},
    education: (cvDetails.education || []).map((e: any) => ({ ...e, id: e.id })),
    experience: (cvDetails.experience || []).map((e: any) => ({ ...e, id: e.id, bulletPoints: e.bulletPoints || [] })),
    skills: (cvDetails.skills || []).map((s: any) => ({ ...s, id: s.id })),
    projects: (cvDetails.projects || []).map((p: any) => ({ ...p, id: p.id })),
    certifications: (cvDetails.certifications || []).map((c: any) => ({ ...c, id: c.id })),
  } : null;

  const htmlContent = cvDataModel && selectedTemplate ? renderCVTemplate(selectedTemplate.slug, cvDataModel) : '<h1>Loading CV...</h1>';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Live A4 Preview</Text>
      <Text style={styles.subtitle}>Switch templates instantly without re-entering data.</Text>

      {/* Template Selector Bar */}
      <Text style={styles.sectionLabel}>Select Template:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {templates.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tChip, selectedTemplate?.id === t.id && styles.tChipActive]}
            onPress={() => handleSwitchTemplate(t)}
          >
            <Text style={[styles.tChipText, selectedTemplate?.id === t.id && styles.tChipTextActive]}>{t.name}</Text>
            {t.isPremium ? <Text style={styles.premiumTag}>PREMIUM</Text> : null}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Document HTML Preview */}
      <View style={styles.previewBox}>
        <View style={styles.previewContent}>
          <Text style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', marginBottom: 10, textAlign: 'center' }}>
            A4 Document Renderer (Template: {selectedTemplate?.name})
          </Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' }}>
            {cvDataModel?.profile?.fullName || 'Your Name'}
          </Text>
          <Text style={{ fontSize: 14, color: '#0284c7', textAlign: 'center', marginBottom: 12 }}>
            {cvDataModel?.profile?.professionalTitle || 'Professional Title'}
          </Text>
          <Text style={{ fontSize: 12, color: '#334155', textAlign: 'center', marginBottom: 16 }}>
            {cvDataModel?.profile?.email || ''} | {cvDataModel?.profile?.phone || ''} | {cvDataModel?.profile?.location || ''}
          </Text>

          <View style={{ borderTopWidth: 1, borderTopColor: '#cbd5e1', paddingTop: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 }}>Professional Summary</Text>
            <Text style={{ fontSize: 12, color: '#475569', lineHeight: 18 }}>
              {cvDataModel?.profile?.professionalSummary || 'No summary provided.'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.btnExport} onPress={handleExportPdf} disabled={exporting}>
        {exporting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnExportText}>📄 Generate & Share A4 PDF</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 14 },
  sectionLabel: { fontSize: 13, fontWeight: 'bold', color: '#334155', marginBottom: 8 },
  tChip: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  tChipActive: { backgroundColor: '#0284c7', borderColor: '#0284c7' },
  tChipText: { fontSize: 12, color: '#334155', fontWeight: '500' },
  tChipTextActive: { color: '#ffffff', fontWeight: 'bold' },
  premiumTag: { fontSize: 9, backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 'bold', paddingHorizontal: 4, borderRadius: 3 },
  previewBox: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#cbd5e1', elevation: 3, marginBottom: 20 },
  previewContent: { minHeight: 300 },
  btnExport: { backgroundColor: '#0284c7', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginBottom: 40 },
  btnExportText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
});
