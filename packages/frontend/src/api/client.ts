import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
apiClient.interceptors.request.use((config) => {
  // Use admin token for admin API calls, customer token for others
  const adminAuth = JSON.parse(localStorage.getItem('admin-auth-storage') || '{}');
  const customerAuth = JSON.parse(localStorage.getItem('auth-storage') || '{}');

  const isAdminRequest = config.url?.includes('/admin');
  const token = isAdminRequest
    ? adminAuth?.state?.token
    : customerAuth?.state?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

export default apiClient;
