import api from './api';

export const notificationService = {
  getMyNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },

  getUnreadCount: async () => {
    const res = await api.get('/notifications/unread-count');
    return res.data.unreadCount;
  },

  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    await api.put('/notifications/read-all');
  },
};

export default notificationService;
