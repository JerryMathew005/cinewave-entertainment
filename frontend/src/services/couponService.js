import api from './api';

export const couponService = {
  validateCoupon: async (code, bookingAmount) => {
    const res = await api.post('/coupons/validate', { code, bookingAmount });
    return res.data;
  },

  getAllCoupons: async () => {
    const res = await api.get('/admin/coupons');
    return res.data;
  },

  createCoupon: async (data) => {
    const res = await api.post('/admin/coupons', data);
    return res.data;
  },

  updateCoupon: async (id, data) => {
    const res = await api.put(`/admin/coupons/${id}`, data);
    return res.data;
  },

  deleteCoupon: async (id) => {
    await api.delete(`/admin/coupons/${id}`);
  },
};

export default couponService;
