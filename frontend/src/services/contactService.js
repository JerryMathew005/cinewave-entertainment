import api from './api';

const contactService = {
  submitContact: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  getAllMessages: async () => {
    const response = await api.get('/admin/messages');
    return response.data;
  },

  markReadStatus: async (id, isRead) => {
    const response = await api.put(`/admin/messages/${id}/read?isRead=${isRead}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/admin/messages/unread-count');
    return response.data.unreadCount;
  }
};

export default contactService;
