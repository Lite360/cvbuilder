import { getAuthToken, getAdminToken } from './storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function request<T = any>(endpoint: string, options: RequestInit = {}, isAdmin: boolean = false): Promise<T> {
  const token = isAdmin ? await getAdminToken() : await getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'API request failed');
  }

  return data.data;
}

export const api = {
  // Auth
  register: (body: any) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  // Templates
  getTemplates: () => request('/api/templates', { method: 'GET' }),

  // CVs
  getCvs: () => request('/api/cvs', { method: 'GET' }),
  createCv: (body: any) => request('/api/cvs', { method: 'POST', body: JSON.stringify(body) }),
  getCvById: (id: string) => request(`/api/cvs/${id}`, { method: 'GET' }),
  updateCv: (id: string, body: any) => request(`/api/cvs/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteCv: (id: string) => request(`/api/cvs/${id}`, { method: 'DELETE' }),

  // Sections
  updateProfile: (cvId: string, body: any) => request(`/api/cvs/${cvId}/profile`, { method: 'PUT', body: JSON.stringify(body) }),
  addEducation: (cvId: string, body: any) => request(`/api/cvs/${cvId}/education`, { method: 'POST', body: JSON.stringify(body) }),
  deleteEducation: (cvId: string, eduId: string) => request(`/api/cvs/${cvId}/education`, { method: 'DELETE', body: JSON.stringify({ eduId }) }),
  addExperience: (cvId: string, body: any) => request(`/api/cvs/${cvId}/experience`, { method: 'POST', body: JSON.stringify(body) }),
  deleteExperience: (cvId: string, expId: string) => request(`/api/cvs/${cvId}/experience`, { method: 'DELETE', body: JSON.stringify({ expId }) }),
  addSkill: (cvId: string, body: any) => request(`/api/cvs/${cvId}/skills`, { method: 'POST', body: JSON.stringify(body) }),
  deleteSkill: (cvId: string, skillId: string) => request(`/api/cvs/${cvId}/skills`, { method: 'DELETE', body: JSON.stringify({ skillId }) }),
  addProject: (cvId: string, body: any) => request(`/api/cvs/${cvId}/projects`, { method: 'POST', body: JSON.stringify(body) }),
  deleteProject: (cvId: string, projectId: string) => request(`/api/cvs/${cvId}/projects`, { method: 'DELETE', body: JSON.stringify({ projectId }) }),
  addCertification: (cvId: string, body: any) => request(`/api/cvs/${cvId}/certifications`, { method: 'POST', body: JSON.stringify(body) }),
  deleteCertification: (cvId: string, certId: string) => request(`/api/cvs/${cvId}/certifications`, { method: 'DELETE', body: JSON.stringify({ certId }) }),

  // PDF Export
  generatePdf: (cvId: string) => request('/api/pdf/generate', { method: 'POST', body: JSON.stringify({ cvId }) }),

  // Payments
  initializePayment: (templateId: string) => request('/api/payments/create', { method: 'POST', body: JSON.stringify({ templateId }) }),

  // AI
  enhanceContent: (body: any) => request('/api/ai/enhance', { method: 'POST', body: JSON.stringify(body) }),

  // Admin
  adminLogin: (body: any) => request('/api/admin/login', { method: 'POST', body: JSON.stringify(body) }, true),
  adminDashboard: () => request('/api/admin/dashboard', { method: 'GET' }, true),
  adminGetUsers: () => request('/api/admin/users', { method: 'GET' }, true),
  adminToggleUser: (body: any) => request('/api/admin/users', { method: 'PATCH', body: JSON.stringify(body) }, true),
};
