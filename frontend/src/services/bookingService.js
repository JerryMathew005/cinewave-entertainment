import api from './api';

export const bookingService = {
  calculateCost: async (showId, seatIds, couponCode = '') => {
    const res = await api.post('/bookings/calculate-cost', {
      showId,
      seatIds,
      couponCode,
    });
    return res.data;
  },

  createBooking: async (showId, seatIds, couponCode = '') => {
    const res = await api.post('/bookings', {
      showId,
      seatIds,
      couponCode,
    });
    return res.data;
  },

  confirmBooking: async (bookingId) => {
    const res = await api.put(`/bookings/${bookingId}/confirm`);
    return res.data;
  },

  cancelBooking: async (bookingId) => {
    const res = await api.put(`/bookings/${bookingId}/cancel`);
    return res.data;
  },

  processBooking: async (bookingId, action, comment, staffName) => {
    const res = await api.put(`/bookings/${bookingId}/process`, {
      action,
      comment,
      staffName,
    });
    return res.data;
  },

  getMyBookings: async () => {
    const res = await api.get('/bookings/my');
    return res.data;
  },

  getBookingById: async (id) => {
    const res = await api.get(`/bookings/${id}`);
    return res.data;
  },

  getBookingByRef: async (reference) => {
    const res = await api.get(`/bookings/ref/${reference}`);
    return res.data;
  },

  getAdminBookings: async (filters = {}) => {
    const res = await api.get('/admin/bookings', { params: filters });
    return res.data;
  },
};

export default bookingService;
