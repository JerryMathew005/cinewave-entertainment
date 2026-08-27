import React, { useState, useEffect } from 'react';
import { Building, Plus, Edit2, Trash2, MapPin, Tv } from 'lucide-react';
import theatreService from '../services/theatreService';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';

const ManageTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theatre Modal
  const [theatreModalOpen, setTheatreModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    city: 'New York',
    state: 'NY',
    status: 'ACTIVE'
  });
  const [saving, setSaving] = useState(false);

  // Screen Modal
  const [screenModalOpen, setScreenModalOpen] = useState(false);
  const [screenTheatreId, setScreenTheatreId] = useState(null);
  const [screenData, setScreenData] = useState({
    screenName: '',
    screenType: 'IMAX',
    totalSeats: 60
  });

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  const fetchTheatres = async () => {
    setLoading(true);
    try {
      const data = await theatreService.getAllTheatres();
      setTheatres(data || []);
    } catch (err) {
      console.error('Failed to load theatres', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      location: '',
      address: '',
      city: 'New York',
      state: 'NY',
      status: 'ACTIVE'
    });
    setTheatreModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setIsEditing(true);
    setCurrentId(t.id);
    setFormData({
      name: t.name,
      location: t.location,
      address: t.address,
      city: t.city,
      state: t.state,
      status: t.status
    });
    setTheatreModalOpen(true);
  };

  const handleSaveTheatre = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await theatreService.updateTheatre(currentId, formData);
      } else {
        await theatreService.createTheatre(formData);
      }
      setTheatreModalOpen(false);
      fetchTheatres();
    } catch (err) {
      alert('Failed to save theatre: ' + (err.response?.data?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTheatre = async () => {
    if (!targetDeleteId) return;
    try {
      await theatreService.deleteTheatre(targetDeleteId);
      setDeleteModalOpen(false);
      fetchTheatres();
    } catch (err) {
      alert('Failed to delete theatre: ' + (err.response?.data?.message || ''));
    }
  };

  const handleOpenAddScreen = (theatreId) => {
    setScreenTheatreId(theatreId);
    setScreenData({ screenName: 'Screen 3', screenType: 'IMAX', totalSeats: 60 });
    setScreenModalOpen(true);
  };

  const handleSaveScreen = async (e) => {
    e.preventDefault();
    try {
      await theatreService.createScreen({
        ...screenData,
        theatreId: screenTheatreId
      });
      setScreenModalOpen(false);
      fetchTheatres();
    } catch (err) {
      alert('Failed to create screen: ' + (err.response?.data?.message || ''));
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', color: '#0A192F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={28} color="#0284C7" />
            Manage Theatres & Screens
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
            Configure theatre properties, locations, and auditoriums.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add New Theatre
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching theatres..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Cinema Name</th>
                <th>Location</th>
                <th>City & State</th>
                <th>Screens</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {theatres.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong></td>
                  <td>{t.location}</td>
                  <td>{t.city}, {t.state}</td>
                  <td>
                    <span className="badge badge-primary">
                      {t.screenCount || 2} Screens
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenAddScreen(t.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        <Tv size={12} /> Add Screen
                      </button>
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => { setTargetDeleteId(t.id); setDeleteModalOpen(true); }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', color: '#EF4444' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Theatre Modal */}
      <Modal
        isOpen={theatreModalOpen}
        onClose={() => setTheatreModalOpen(false)}
        title={isEditing ? 'Edit Theatre' : 'Add New Cinema Theatre'}
      >
        <form onSubmit={handleSaveTheatre}>
          <div className="form-group">
            <label className="form-label">Cinema Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location / Neighborhood</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Street Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setTheatreModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : isEditing ? 'Update Theatre' : 'Create Theatre'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Screen Modal */}
      <Modal
        isOpen={screenModalOpen}
        onClose={() => setScreenModalOpen(false)}
        title="Add Auditorium Screen"
      >
        <form onSubmit={handleSaveScreen}>
          <div className="form-group">
            <label className="form-label">Screen Name</label>
            <input
              type="text"
              required
              value={screenData.screenName}
              onChange={(e) => setScreenData({ ...screenData, screenName: e.target.value })}
              placeholder="e.g. Screen 3 - IMAX Laser"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Screen Type / Sound</label>
            <select
              value={screenData.screenType}
              onChange={(e) => setScreenData({ ...screenData, screenType: e.target.value })}
              className="form-select"
            >
              <option value="IMAX">IMAX 70mm Laser</option>
              <option value="DOLBY_ATMOS">Dolby Atmos Surround</option>
              <option value="THREE_D">3D RealD</option>
              <option value="STANDARD">Standard 4K Digital</option>
              <option value="VIP_LOUNGE">VIP Luxury Recliner Lounge</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Total Seats</label>
            <input
              type="number"
              value={screenData.totalSeats}
              onChange={(e) => setScreenData({ ...screenData, totalSeats: Number(e.target.value) })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={() => setScreenModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Screen
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteTheatre}
        title="Delete Theatre"
        message="Are you sure you want to remove this theatre and all its associated screens?"
        isDanger={true}
      />

    </div>
  );
};

export default ManageTheatres;
