import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Clock, Film, MapPin } from 'lucide-react';
import showService from '../services/showService';
import movieService from '../services/movieService';
import theatreService from '../services/theatreService';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [selectedTheatreId, setSelectedTheatreId] = useState('');
  const [formData, setFormData] = useState({
    movieId: '',
    screenId: '',
    showType: 'REGULAR',
    showDate: new Date().toISOString().split('T')[0],
    startTime: '18:00',
    endTime: '21:00',
    basePrice: 250,
    status: 'SCHEDULED'
  });
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  const fetchShowsAndMetadata = async () => {
    setLoading(true);
    try {
      const [showsData, moviesData, theatresData] = await Promise.all([
        showService.getAllShows(),
        movieService.getNowShowing(),
        theatreService.getAllTheatres()
      ]);
      setShows(showsData || []);
      setMovies(moviesData || []);
      setTheatres(theatresData || []);
    } catch (err) {
      console.error('Failed to load shows metadata', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowsAndMetadata();
  }, []);

  // When theatre changes in modal, load its screens
  useEffect(() => {
    if (selectedTheatreId) {
      theatreService.getScreensByTheatreId(selectedTheatreId).then((res) => {
        setScreens(res || []);
        if (res && res.length > 0) {
          setFormData((prev) => ({ ...prev, screenId: res[0].id }));
        }
      });
    } else {
      setScreens([]);
    }
  }, [selectedTheatreId]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    const initialMovieId = movies.length > 0 ? movies[0].id : '';
    const initialTheatreId = theatres.length > 0 ? theatres[0].id : '';
    setSelectedTheatreId(initialTheatreId);

    setFormData({
      movieId: initialMovieId,
      screenId: '',
      showType: 'REGULAR',
      showDate: new Date().toISOString().split('T')[0],
      startTime: '18:00',
      endTime: '21:00',
      basePrice: 250,
      status: 'SCHEDULED'
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await showService.updateShow(currentId, formData);
      } else {
        await showService.createShow(formData);
      }
      setModalOpen(false);
      fetchShowsAndMetadata();
    } catch (err) {
      alert('Failed to save show: ' + (err.response?.data?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!targetDeleteId) return;
    try {
      await showService.deleteShow(targetDeleteId);
      setDeleteModalOpen(false);
      fetchShowsAndMetadata();
    } catch (err) {
      alert('Failed to delete show: ' + (err.response?.data?.message || ''));
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', color: '#0A192F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={28} color="#0284C7" />
            Manage Showtimes & Pricing
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
            Schedule movie slots, assign screen formats, and set base ticket prices.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Schedule New Show
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching scheduled shows..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Theatre & Screen</th>
                <th>Format</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Base Price</th>
                <th>Available Seats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.movieTitle}</strong></td>
                  <td>{s.theatreName} ({s.screenName})</td>
                  <td>
                    <span className="badge badge-primary">
                      {s.showType}
                    </span>
                  </td>
                  <td>{s.showDate}</td>
                  <td>
                    <span style={{ fontWeight: '600', color: '#0284C7' }}>
                      {s.startTime ? s.startTime.substring(0, 5) : ''} - {s.endTime ? s.endTime.substring(0, 5) : ''}
                    </span>
                  </td>
                  <td><strong>₹{s.basePrice}</strong></td>
                  <td>
                    <span style={{ color: (s.availableSeats || 0) < 10 ? '#EF4444' : '#10B981', fontWeight: '600' }}>
                      {s.availableSeats !== undefined ? s.availableSeats : 60} / {s.totalSeats || 60}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => { setTargetDeleteId(s.id); setDeleteModalOpen(true); }}
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

      {/* Schedule Show Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Cinema Showtime"
        maxWidth="600px"
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Movie</label>
            <select
              required
              value={formData.movieId}
              onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
              className="form-select"
            >
              {movies.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Theatre</label>
              <select
                required
                value={selectedTheatreId}
                onChange={(e) => setSelectedTheatreId(e.target.value)}
                className="form-select"
              >
                {theatres.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Screen Auditorium</label>
              <select
                required
                value={formData.screenId}
                onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                className="form-select"
              >
                {screens.map((sc) => (
                  <option key={sc.id} value={sc.id}>{sc.screenName} ({sc.screenType})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Show Format</label>
              <select
                value={formData.showType}
                onChange={(e) => setFormData({ ...formData, showType: e.target.value })}
                className="form-select"
              >
                <option value="REGULAR">REGULAR</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="IMAX">IMAX</option>
                <option value="THREE_D">3D RealD</option>
                <option value="SPECIAL_EVENT">SPECIAL_EVENT</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Show Date</label>
              <input
                type="date"
                required
                value={formData.showDate}
                onChange={(e) => setFormData({ ...formData, showDate: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Base Price (₹)</label>
              <input
                type="number"
                required
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Scheduling...' : 'Schedule Showtime'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Cancel Show"
        message="Are you sure you want to cancel this showtime? All associated customer seats will be removed."
        isDanger={true}
      />

    </div>
  );
};

export default ManageShows;
