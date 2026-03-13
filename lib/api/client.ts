import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("hrms_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("hrms_token");
      Cookies.remove("hrms_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardApi = {
  getStats: () => apiClient.get("/dashboard/stats"),
  getChartData: () => apiClient.get("/dashboard/charts"),
  getRecentEmployees: () => apiClient.get("/dashboard/recent-employees"),
};

// Employees API
export const employeesApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get("/employees", { params }),
  getById: (id: string) => apiClient.get(`/employees/${id}`),
  create: (data: Record<string, unknown>) => apiClient.post("/employees", data),
  update: (id: string, data: Record<string, unknown>) =>
    apiClient.put(`/employees/${id}`, data),
  delete: (id: string) => apiClient.delete(`/employees/${id}`),
};

// CSV Upload API
export const uploadApi = {
  uploadCSV: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    
    return apiClient.post("/upload/csv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },
  getUploadHistory: () => apiClient.get("/upload/history"),
};

// Audit Logs API
export const auditApi = {
  getLogs: (params?: { page?: number; limit?: number; action?: string }) =>
    apiClient.get("/audit/logs", { params }),
  getLogById: (id: string) => apiClient.get(`/audit/logs/${id}`),
};
