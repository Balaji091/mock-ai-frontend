import axios from 'axios';

// Create Axios client. Uses VITE_API_URL in production, falls back to relative '/api' proxy locally.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if stored
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('mockai-auth-store');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Failed to parse auth token from localStorage', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Redirect or logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Received 401 Unauthorized, logging user out...');
      localStorage.removeItem('mockai-auth-store');
      // Force reload or redirect to login page if window is available
      if (typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
