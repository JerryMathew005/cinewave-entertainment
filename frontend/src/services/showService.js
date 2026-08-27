import api from './api';

export const showService = {
  getAllShows: async (params = {}) => {
    const res = await api.get('/shows', { params });
    return res.data;
  },

  getShowsByMovie: async (movieId) => {
    const res = await api.get(`/shows/movie/${movieId}`);
    return res.data;
  },

  getShowsByTheatre: async (theatreId) => {
    const res = await api.get(`/shows/theatre/${theatreId}`);
    return res.data;
  },

  getShowById: async (id) => {
    const res = await api.get(`/shows/${id}`);
    return res.data;
  },

  createShow: async (data) => {
    const res = await api.post('/shows', data);
    return res.data;
  },

  updateShow: async (id, data) => {
    const res = await api.put(`/shows/${id}`, data);
    return res.data;
  },

  deleteShow: async (id) => {
    await api.delete(`/shows/${id}`);
  },
};

export default showService;
