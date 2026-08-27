import api from './api';

export const movieService = {
  getAllMovies: async (params = {}) => {
    const res = await api.get('/movies', { params });
    return res.data;
  },

  getNowShowing: async () => {
    const res = await api.get('/movies/now-showing');
    return res.data;
  },

  getComingSoon: async () => {
    const res = await api.get('/movies/coming-soon');
    return res.data;
  },

  getMovieById: async (id) => {
    const res = await api.get(`/movies/${id}`);
    return res.data;
  },

  createMovie: async (movieData) => {
    const res = await api.post('/movies', movieData);
    return res.data;
  },

  updateMovie: async (id, movieData) => {
    const res = await api.put(`/movies/${id}`, movieData);
    return res.data;
  },

  deleteMovie: async (id) => {
    await api.delete(`/movies/${id}`);
  },
};

export default movieService;
