import api from './api';

export const authService = {
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.data && res.data.token) {
      localStorage.setItem('cinewave_token', res.data.token);
      localStorage.setItem('cinewave_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data && res.data.token) {
      localStorage.setItem('cinewave_token', res.data.token);
      localStorage.setItem('cinewave_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('cinewave_token');
    localStorage.removeItem('cinewave_user');
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  getStoredUser: () => {
    try {
      const stored = localStorage.getItem('cinewave_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken: () => localStorage.getItem('cinewave_token'),
};

export default authService;
