import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitpeak_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fitpeak_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: async (credentials) => {
    const { data } = await api.post('/api/auth/login', credentials);
    return data;
  },
  register: async (userData) => {
    const { data } = await api.post('/api/auth/register', userData);
    return data;
  },
  me: async () => {
    const { data } = await api.get('/api/auth/me');
    return data;
  },
};

// ── Workouts ──────────────────────────────────────────────────────────────────
export const workoutsAPI = {
  getAll: async (params) => {
    const { data } = await api.get('/api/workouts', { params });
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/api/workouts', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/api/workouts/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/api/workouts/${id}`);
    return data;
  },
};

// ── Exercises ─────────────────────────────────────────────────────────────────
export const exercisesAPI = {
  getAll: async (params) => {
    const { data } = await api.get('/api/exercises', { params });
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/api/exercises', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/api/exercises/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/api/exercises/${id}`);
    return data;
  },
};

// ── Diet ──────────────────────────────────────────────────────────────────────
export const dietAPI = {
  getAll: async (params) => {
    const { data } = await api.get('/api/diet', { params });
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/api/diet', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/api/diet/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/api/diet/${id}`);
    return data;
  },
};

// ── Progress ──────────────────────────────────────────────────────────────────
export const progressAPI = {
  getAll: async (params) => {
    const { data } = await api.get('/api/progress', { params });
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/api/progress', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/api/progress/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/api/progress/${id}`);
    return data;
  },
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: async () => {
    const { data } = await api.get('/api/dashboard/stats');
    return data;
  },
};

export default api;
