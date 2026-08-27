import api from './api';

export const theatreService = {
  getAllTheatres: async (city) => {
    const res = await api.get('/theatres', { params: { city } });
    return res.data;
  },

  getTheatreById: async (id) => {
    const res = await api.get(`/theatres/${id}`);
    return res.data;
  },

  getScreensByTheatreId: async (theatreId) => {
    const res = await api.get(`/theatres/${theatreId}/screens`);
    return res.data;
  },

  createTheatre: async (data) => {
    const res = await api.post('/theatres', data);
    return res.data;
  },

  updateTheatre: async (id, data) => {
    const res = await api.put(`/theatres/${id}`, data);
    return res.data;
  },

  deleteTheatre: async (id) => {
    await api.delete(`/theatres/${id}`);
  },

  createScreen: async (data) => {
    const res = await api.post('/screens', data);
    return res.data;
  },

  deleteScreen: async (id) => {
    await api.delete(`/screens/${id}`);
  },
};

export default theatreService;
