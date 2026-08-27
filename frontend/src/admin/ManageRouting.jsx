import React, { useState, useEffect } from 'react';
import { Shuffle, Edit2, CheckCircle, Shield } from 'lucide-react';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const ManageRouting = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await adminService.getRoutingRules();
      setRules(data || []);
    } catch (err) {
      console.error('Failed to load routing rules', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleOpenEdit = (rule) => {
    setCurrentRule(rule);
    setTeamName(rule.teamName);
    setActive(rule.active);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentRule) return;

    setSaving(true);
    try {
      await adminService.updateRoutingRule(currentRule.id, {
        teamName,
        active
      });
      setModalOpen(false);
      fetchRules();
    } catch (err) {
      alert('Failed to update routing rule: ' + (err.response?.data?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#0A192F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shuffle size={28} color="#0284C7" />
          Show-Type Auto-Routing (US-010)
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
          Assign incoming cinema booking requests directly to specialized operational team queues based on show format.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading routing rules..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Show Format</th>
                <th>Target Assigned Team</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
                      {r.showType}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#0A192F' }}>{r.teamName}</strong>
                  </td>
                  <td>
                    <span className={`badge ${r.active ? 'badge-success' : 'badge-danger'}`}>
                      {r.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleOpenEdit(r)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 10px' }}
                    >
                      <Edit2 size={13} /> Edit Route
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Route Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Edit Routing for ${currentRule?.showType}`}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Show Type / Format</label>
            <input
              type="text"
              disabled
              value={currentRule?.showType || ''}
              className="form-input"
              style={{ backgroundColor: '#F1F5F9' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Support / Operations Team</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. IMAX Special Operations Team"
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="activeRoute"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <label htmlFor="activeRoute" style={{ fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>
              Rule is active and auto-routing
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Updating...' : 'Save Routing Rule'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManageRouting;
