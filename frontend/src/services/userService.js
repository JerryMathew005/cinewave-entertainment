import api from './api';

const userService = {
  getMyProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch {
      // Graceful fallback to /auth/me if needed
      const fallback = await api.get('/auth/me');
      return fallback.data;
    }
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    // Update local cache if present
    const existing = localStorage.getItem('cinewave_user');
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        const updated = { ...parsed, ...response.data };
        localStorage.setItem('cinewave_user', JSON.stringify(updated));
      } catch {
        // Ignore JSON error
      }
    }
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put('/users/me/password', data);
    return response.data;
  }
};

export default userService;
