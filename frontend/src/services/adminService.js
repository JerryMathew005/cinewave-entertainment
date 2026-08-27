import api from './api';

export const adminService = {
  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },

  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  updateUserRole: async (userId, role) => {
    const res = await api.put(`/admin/users/${userId}/role`, null, { params: { role } });
    return res.data;
  },

  getRoutingRules: async () => {
    const res = await api.get('/admin/routing');
    return res.data;
  },

  updateRoutingRule: async (id, ruleData) => {
    const res = await api.put(`/admin/routing/${id}`, ruleData);
    return res.data;
  },

  getSlaSettings: async () => {
    const res = await api.get('/admin/sla');
    return res.data;
  },
};

export default adminService;
