import api from './api';

const aiService = {
  sendMessage: async (message, context = '') => {
    const response = await api.post('/ai/chat', { message, context });
    return response.data;
  }
};

export default aiService;
