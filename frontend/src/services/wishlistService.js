import api from './api';

export const wishlistService = {
  getMyWishlist: async () => {
    const res = await api.get('/wishlist');
    return res.data;
  },

  checkWishlist: async (movieId) => {
    const res = await api.get(`/wishlist/check/${movieId}`);
    return res.data.inWishlist;
  },

  addToWishlist: async (movieId) => {
    const res = await api.post(`/wishlist/${movieId}`);
    return res.data;
  },

  removeFromWishlist: async (movieId) => {
    await api.delete(`/wishlist/${movieId}`);
  },
};

export default wishlistService;
