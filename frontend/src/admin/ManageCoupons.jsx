import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import couponService from '../services/couponService';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Coupon Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minimumAmount: 400,
    maximumDiscount: 200,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '2026-12-31',
    usageLimit: 100,
    status: 'ACTIVE'
  });
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponService.getAllCoupons();
      setCoupons(data || []);
    } catch (err) {
      console.error('Failed to load coupons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await couponService.createCoupon(formData);
      setModalOpen(false);
      fetchCoupons();
    } catch (err) {
      alert('Failed to create coupon: ' + (err.response?.data?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await couponService.deleteCoupon(id);
      fetchCoupons();
    } catch (err) {
      alert('Failed to delete coupon');
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', color: '#0A192F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={28} color="#0284C7" />
            Manage Discount Coupons
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
            Configure promotional discount codes and maximum savings caps.
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Create Promo Code
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching active coupons..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Min Booking</th>
                <th>Max Discount</th>
                <th>Expiry Date</th>
                <th>Redemptions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong style={{ color: '#0284C7', letterSpacing: '0.04em' }}>{c.code}</strong>
                  </td>
                  <td>
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                  </td>
                  <td>₹{c.minimumAmount || 0}</td>
                  <td>₹{c.maximumDiscount || 'No Limit'}</td>
                  <td>{c.expiryDate}</td>
                  <td>
                    <span style={{ fontWeight: '600' }}>
                      {c.usedCount || 0} / {c.usageLimit || '∞'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${c.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', color: '#EF4444' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Coupon Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Promo Coupon">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Coupon Code</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. MOVIEBUFF30"
              className="form-input"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="form-select"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed Flat (₹)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Discount Value</label>
              <input
                type="number"
                required
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Minimum Booking Subtotal (₹)</label>
              <input
                type="number"
                value={formData.minimumAmount}
                onChange={(e) => setFormData({ ...formData, minimumAmount: Number(e.target.value) })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Maximum Discount Cap (₹)</label>
              <input
                type="number"
                value={formData.maximumDiscount}
                onChange={(e) => setFormData({ ...formData, maximumDiscount: Number(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManageCoupons;
