import axios from 'axios';

// Create a base axios instance
const api = axios.create({
  baseURL: 'https://api.fitpeak.local/v1', // Placeholder base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (data) => api.post('/register', data),
};

export const userAPI = {
  getDashboard: () => api.get('/dashboard'),
};

export const trainerAPI = {
  getUsers: () => api.get('/trainer/users'),
  assignPlan: (data) => api.post('/trainer/assign-plan', data),
};

// Interceptor for attaching auth token (placeholder)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitpeak-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
