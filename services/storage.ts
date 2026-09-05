import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'user_auth_token';
const ADMIN_TOKEN_KEY = 'admin_auth_token';

export async function saveAuthToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    try { localStorage.setItem(TOKEN_KEY, token); } catch {}
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeAuthToken(): Promise<void> {
  if (Platform.OS === 'web') {
    try { localStorage.removeItem(TOKEN_KEY); } catch {}
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function saveAdminToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    try { localStorage.setItem(ADMIN_TOKEN_KEY, token); } catch {}
  } else {
    await SecureStore.setItemAsync(ADMIN_TOKEN_KEY, token);
  }
}

export async function getAdminToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    try { return localStorage.getItem(ADMIN_TOKEN_KEY); } catch { return null; }
  }
  return await SecureStore.getItemAsync(ADMIN_TOKEN_KEY);
}

export async function removeAdminToken(): Promise<void> {
  if (Platform.OS === 'web') {
    try { localStorage.removeItem(ADMIN_TOKEN_KEY); } catch {}
  } else {
    await SecureStore.deleteItemAsync(ADMIN_TOKEN_KEY);
  }
}
