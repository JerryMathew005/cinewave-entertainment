import React, { useState, useEffect } from 'react';
import { Film, Plus, Edit2, Trash2, Star, Clock } from 'lucide-react';
import movieService from '../services/movieService';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Sci-Fi',
    language: 'English',
    duration: 120,
    releaseDate: '2026-05-01',
    posterUrl: '',
    trailerUrl: '',
    rating: 8.5,
    status: 'NOW_SHOWING'
  });
  const [saving, setSaving] = useState(false);

  // Delete dialog state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const data = await movieService.getAllMovies();
      setMovies(data || []);
    } catch (err) {
      console.error('Failed to load movies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: '',
      description: '',
      genre: 'Action',
      language: 'English',
      duration: 135,
      releaseDate: new Date().toISOString().split('T')[0],
      posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      trailerUrl: 'https://www.youtube.com',
      rating: 8.0,
      status: 'NOW_SHOWING'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setIsEditing(true);
    setCurrentId(movie.id);
    setFormData({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      language: movie.language,
      duration: movie.duration,
      releaseDate: movie.releaseDate,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl || '',
      rating: movie.rating || 8.0,
      status: movie.status
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await movieService.updateMovie(currentId, formData);
      } else {
        await movieService.createMovie(formData);
      }
      setModalOpen(false);
      fetchMovies();
    } catch (err) {
      alert('Failed to save movie: ' + (err.response?.data?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!targetDeleteId) return;
    try {
      await movieService.deleteMovie(targetDeleteId);
      setDeleteModalOpen(false);
      fetchMovies();
    } catch (err) {
      alert('Failed to delete movie: ' + (err.response?.data?.message || ''));
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', color: '#0A192F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Film size={28} color="#0284C7" />
            Manage Movies
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
            Add, update, or remove movies from the CineWave cinema network.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add New Movie
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching movies..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title & Genre</th>
                <th>Language</th>
                <th>Duration</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m.id}>
                  <td style={{ width: '50px' }}>
                    <div style={{ width: '40px', height: '55px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#0A192F' }}>
                      <img src={m.posterUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong>{m.title}</strong>
                      {(m.isSeries || m.genre?.toLowerCase().includes('series') || m.title?.toLowerCase().includes('chosen')) && (
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                          Series
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{m.genre}</div>
                  </td>
                  <td>{m.language}</td>
                  <td>{m.duration} mins</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontWeight: '700' }}>
                      <Star size={13} fill="#F59E0B" /> {m.rating ? Number(m.rating).toFixed(1) : '8.0'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${m.status === 'NOW_SHOWING' ? 'badge-primary' : m.status === 'COMING_SOON' ? 'badge-warning' : 'badge'}`}
                          style={m.status === 'ARCHIVED' ? { backgroundColor: '#E2E8F0', color: '#475569' } : {}}>
                      {m.status === 'NOW_SHOWING' ? 'Now Showing' : m.status === 'COMING_SOON' ? 'Coming Soon' : 'Archived'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                        title="Edit Movie"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => { setTargetDeleteId(m.id); setDeleteModalOpen(true); }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', color: '#EF4444' }}
                        title="Delete Movie"
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

      {/* Add / Edit Movie Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Movie Details' : 'Add New Movie'}
        maxWidth="600px"
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Movie Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Genre</label>
              <input
                type="text"
                required
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Language</label>
              <input
                type="text"
                required
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Duration (mins)</label>
              <input
                type="number"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Release Date</label>
              <input
                type="date"
                required
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-select"
              >
                <option value="NOW_SHOWING">Now Showing</option>
                <option value="COMING_SOON">Coming Soon</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Poster Image URL</label>
            <input
              type="url"
              required
              value={formData.posterUrl}
              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Synopsis / Description</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : isEditing ? 'Update Movie' : 'Create Movie'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Movie"
        message="Are you sure you want to permanently delete this movie? All associated showtimes will also be impacted."
        isDanger={true}
      />

    </div>
  );
};

export default ManageMovies;
