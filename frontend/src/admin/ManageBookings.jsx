import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Filter, CheckCircle, XCircle, AlertTriangle, Eye, Clock } from 'lucide-react';
import bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const ManageBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [status, setStatus] = useState('');
  const [team, setTeam] = useState('');
  const [slaStatus, setSlaStatus] = useState('');

  // Process Modal state
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [targetBooking, setTargetBooking] = useState(null);
  const [action, setAction] = useState('CONFIRM');
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};
      if (status) filters.status = status;
      if (team) filters.team = team;
      if (slaStatus) filters.slaStatus = slaStatus;

      const data = await bookingService.getAdminBookings(filters);
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to load admin bookings', err);
    } finally {
      setLoading(false);
    }
  }, [status, team, slaStatus]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleOpenProcess = (booking) => {
    setTargetBooking(booking);
    setAction('CONFIRM');
    setComment('');
    setProcessModalOpen(true);
  };

  const handleProcessSubmit = async (e) => {
    e.preventDefault();
    if (!targetBooking) return;

    setProcessing(true);
    try {
      // US-007: Process Ticket Booking
      await bookingService.processBooking(
        targetBooking.id,
        action,
        comment,
        user?.name || 'Staff'
      );
      setProcessModalOpen(false);
      fetchBookings();
    } catch (err) {
      alert('Failed to process booking: ' + (err.response?.data?.message || ''));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#0A192F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Ticket size={28} color="#0284C7" />
          Booking Queue & Processing (US-006 & US-007)
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
          Review booking requests, audit trails, SLA statuses, and approve or reject ticket requests.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: '#FFFFFF',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        marginBottom: '1.5rem'
      }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter by Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending (Requires Review)</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="form-label" style={{ fontSize: '0.75rem' }}>Assigned Team (US-010)</label>
          <select value={team} onChange={(e) => setTeam(e.target.value)} className="form-select">
            <option value="">All Support Teams</option>
            <option value="General Booking Team">General Booking Team</option>
            <option value="Premium Booking Team">Premium Booking Team</option>
            <option value="IMAX Booking Team">IMAX Booking Team</option>
            <option value="3D Booking Team">3D Booking Team</option>
            <option value="Special Events Team">Special Events Team</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <label className="form-label" style={{ fontSize: '0.75rem' }}>SLA Compliance (US-009)</label>
          <select value={slaStatus} onChange={(e) => setSlaStatus(e.target.value)} className="form-select">
            <option value="">All SLA States</option>
            <option value="WITHIN_SLA">Within SLA (On Track)</option>
            <option value="SLA_WARNING">SLA Warning (Expiring Soon)</option>
            <option value="SLA_BREACHED">SLA Breached (Priority Escalation)</option>
            <option value="COMPLETED_WITHIN_SLA">Completed Within SLA</option>
            <option value="COMPLETED_AFTER_SLA">Completed After SLA</option>
          </select>
        </div>

        {(status || team || slaStatus) && (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="button"
              onClick={() => { setStatus(''); setTeam(''); setSlaStatus(''); }}
              className="btn btn-secondary btn-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Bookings Queue Table */}
      {loading ? (
        <LoadingSpinner text="Fetching booking records..." />
      ) : bookings.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
          <p style={{ color: '#64748B', fontSize: '1rem', margin: 0 }}>No bookings match the selected filters.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Movie & Screen</th>
                <th>Customer</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Assigned Team</th>
                <th>SLA Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong style={{ color: '#0284C7' }}>{b.bookingReference}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0A192F' }}>{b.show?.movieTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {b.show?.theatreName} ({b.show?.screenName})
                    </div>
                  </td>
                  <td>
                    <div>{b.user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{b.user?.email}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', color: '#334155' }}>
                      {b.seats?.map((s) => s.seatNumber).join(', ') || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <strong>₹{Number(b.totalAmount || 0).toFixed(2)}</strong>
                  </td>
                  <td>
                    <span className={`badge ${
                      b.status === 'CONFIRMED' ? 'badge-success' :
                      b.status === 'PENDING' ? 'badge-warning' :
                      b.status === 'CANCELLED' || b.status === 'REJECTED' ? 'badge-danger' : 'badge-primary'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                    {b.assignedTeam || 'General'}
                  </td>
                  <td>
                    <span className={`badge ${
                      b.slaStatus === 'SLA_BREACHED' ? 'badge-danger' :
                      b.slaStatus === 'SLA_WARNING' ? 'badge-warning' :
                      b.slaStatus === 'COMPLETED_WITHIN_SLA' ? 'badge-success' : 'badge-primary'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {b.slaStatus === 'SLA_BREACHED' && <AlertTriangle size={10} />}
                      {b.slaStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenProcess(b)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                      >
                        Process
                      </button>
                      <Link
                        to={`/booking-details/${b.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                        title="View Case History & Audit Trail"
                      >
                        <Eye size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* US-007: Staff Processing Modal */}
      <Modal
        isOpen={processModalOpen}
        onClose={() => setProcessModalOpen(false)}
        title={`Process Booking: ${targetBooking?.bookingReference}`}
      >
        <form onSubmit={handleProcessSubmit}>
          <div style={{ marginBottom: '1rem', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem' }}><strong>Movie:</strong> {targetBooking?.show?.movieTitle}</div>
            <div style={{ fontSize: '0.85rem' }}><strong>Seats:</strong> {targetBooking?.seats?.map((s) => s.seatNumber).join(', ')}</div>
            <div style={{ fontSize: '0.85rem' }}><strong>Current Status:</strong> {targetBooking?.status}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Processing Action (US-007)</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="form-select"
            >
              <option value="CONFIRM">Approve & Confirm Booking</option>
              <option value="REJECT">Reject Booking Request</option>
              <option value="COMPLETE">Mark Booking as Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Staff Processing Notes / Comments</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Verified guest seats, manual override, or payment confirmation..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setProcessModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className={`btn ${action === 'REJECT' ? 'btn-danger' : 'btn-primary'}`}
            >
              {processing ? 'Processing...' : `Submit ${action}`}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManageBookings;
