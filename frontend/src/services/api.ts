import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hrms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authService = {
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const employeeService = {
  getAll: (params: any) => api.get('/employees', { params }),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
  getTrash: () => api.get('/employees/trash'),
  restore: (id: string) => api.post(`/employees/${id}/restore`),
};

export const dashboardService = {
  getStats: () => api.get('/stats'),
  getAuditLogs: () => api.get('/audit-logs'),
};

export const uploadService = {
  bulkUpload: (formData: FormData) => api.post('/upload/bulk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  bulkUploadJson: (payload: { employees: any[], fileName: string }) => api.post('/upload/json', payload),
  getLogs: () => api.get('/upload/logs'),
  downloadTemplate: () => api.get('/upload/template', { responseType: 'blob' }),
};

export const adminService = {
  getProfile: () => api.get('/admin/me'),
  updateProfile: (data: any) => api.put('/admin/me', data),
};
