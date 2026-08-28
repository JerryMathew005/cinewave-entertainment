import axios from 'axios';

// Resolve API base URL: environment variable, or auto-fallback to deployed Render backend in production
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://cinewave-entertainment.onrender.com/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token and check offline state
api.interceptors.request.use(
  (config) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const offlineError = new Error('No internet connection. Please check your network and try again.');
      offlineError.isNetworkError = true;
      offlineError.code = 'ERR_NETWORK';
      offlineError.response = {
        status: 0,
        data: { message: 'No internet connection. Please check your network and try again.' }
      };
      return Promise.reject(offlineError);
    }
    const token = localStorage.getItem('cinewave_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401 responses and network interruptions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error' ||
      (typeof navigator !== 'undefined' && !navigator.onLine);

    if (isNetworkError) {
      error.isNetworkError = true;
      const friendlyMsg = 'No internet connection. Please check your network and try again.';
      error.userMessage = friendlyMsg;
      if (!error.response) {
        error.response = {
          status: 0,
          data: { message: friendlyMsg }
        };
      } else if (!error.response.data || !error.response.data.message) {
        error.response.data = { ...error.response.data, message: friendlyMsg };
      }
    } else if (error.response && error.response.status === 401) {
      // Clear token only when truly unauthorized (401), never on network drops
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('cinewave_token');
        localStorage.removeItem('cinewave_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
