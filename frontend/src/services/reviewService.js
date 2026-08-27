import api from './api';

export const reviewService = {
  getMovieReviews: async (movieId) => {
    const res = await api.get(`/movies/${movieId}/reviews`);
    return res.data;
  },

  addReview: async (movieId, reviewData) => {
    const res = await api.post(`/movies/${movieId}/reviews`, reviewData);
    return res.data;
  },
};

export default reviewService;
