import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { api } from '../../services/api';

export default function TemplatesScreen() {
  const [templateList, setTemplateList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTemplates() {
    try {
      const data = await api.getTemplates();
      setTemplateList(data || []);
    } catch (err: any) {
      console.log('Failed to fetch templates:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  async function handlePurchase(template: any) {
    if (!template.isPremium) {
      Alert.alert('Free Template', 'This template is free for all users!');
      return;
    }

    try {
      const res = await api.initializePayment(template.id);
      Alert.alert(
        'Unlock Premium Template',
        `Pay ₦${parseFloat(template.price).toLocaleString()} via Paystack/Korapay.\nReference: ${res.reference}`,
        [{ text: 'Proceed to Checkout', onPress: () => {} }, { text: 'Cancel', style: 'cancel' }]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not initiate purchase');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Professional Templates</Text>
      <Text style={styles.headerSubtitle}>Enter your data once, render across any design without retyping!</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={templateList}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.previewImageUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80' }} style={styles.previewImage} />

              <View style={styles.cardBody}>
                <View style={styles.titleRow}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.isPremium ? (
                    <View style={styles.badgePremium}>
                      <Text style={styles.badgePremiumText}>PREMIUM • ₦{parseFloat(item.price).toLocaleString()}</Text>
                    </View>
                  ) : (
                    <View style={styles.badgeFree}>
                      <Text style={styles.badgeFreeText}>FREE</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.description}>{item.description}</Text>

                {item.isPremium && (
                  <TouchableOpacity style={styles.btnUnlock} onPress={() => handlePurchase(item)}>
                    <Text style={styles.btnUnlockText}>Unlock Template (₦{parseFloat(item.price).toLocaleString()})</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  headerSubtitle: { fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', marginBottom: 18, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  previewImage: { width: '100%', height: 180, backgroundColor: '#cbd5e1' },
  cardBody: { padding: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  badgeFree: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeFreeText: { color: '#166534', fontWeight: 'bold', fontSize: 11 },
  badgePremium: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgePremiumText: { color: '#92400e', fontWeight: 'bold', fontSize: 11 },
  description: { fontSize: 13, color: '#475569', marginTop: 8, lineHeight: 18 },
  btnUnlock: { backgroundColor: '#0f766e', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 14 },
  btnUnlockText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});
