import api from './api';

export const seatService = {
  getSeatsForShow: async (showId) => {
    const res = await api.get(`/shows/${showId}/seats`);
    return res.data;
  },

  getSeatsByScreenId: async (screenId) => {
    const res = await api.get(`/screens/${screenId}/seats`);
    return res.data;
  },

  createSeat: async (data) => {
    const res = await api.post('/seats', data);
    return res.data;
  },

  updateSeat: async (id, data) => {
    const res = await api.put(`/seats/${id}`, data);
    return res.data;
  },
};

export default seatService;
