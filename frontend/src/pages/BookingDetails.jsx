import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Shield, AlertTriangle, Users, History, CheckCircle2 } from 'lucide-react';
import bookingService from '../services/bookingService';
import Ticket from '../components/Ticket';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await bookingService.getBookingById(id);
        setBooking(data);
      } catch (err) {
        console.error('Failed to load booking details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner text="Retrieving booking details & audit trail..." />;
  if (!booking) return <div className="container" style={{ padding: '3rem' }}>Booking not found.</div>;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '880px' }}>
      
      {/* Back Link */}
      <Link to="/my-bookings" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284C7', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to My Bookings
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0A192F', margin: 0 }}>
            Booking {booking.bookingReference}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px' }}>
            Case Lifecycle, SLA Status, and Audit History (US-006 & US-009)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
            {booking.show?.showType}
          </span>
          <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
            {booking.status}
          </span>
        </div>
      </div>

      {/* SLA & Routing Case Info Box */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', borderLeft: '4px solid #0284C7', backgroundColor: '#F8FAFC' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Assigned Team (US-010)</span>
            <strong style={{ fontSize: '0.95rem', color: '#0A192F', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} color="#0284C7" /> {booking.assignedTeam || 'General Booking Team'}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>SLA Processing Status (US-009)</span>
            <strong style={{
              fontSize: '0.95rem',
              color: booking.slaStatus === 'SLA_BREACHED' ? '#EF4444' : '#10B981',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {booking.slaStatus === 'SLA_BREACHED' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
              {booking.slaStatus}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>SLA Deadline</span>
            <strong style={{ fontSize: '0.95rem', color: '#0A192F', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} color="#0284C7" />
              {booking.slaDeadline ? new Date(booking.slaDeadline).toLocaleTimeString() : '30 mins'}
            </strong>
          </div>
        </div>
      </div>

      {/* Digital Ticket Presentation */}
      <Ticket booking={booking} />

      {/* Pega Audit Trail History (US-006) */}
      <div style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#0A192F', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={20} color="#0284C7" />
          Case History & Audit Trail
        </h2>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Transition</th>
                <th>Actor</th>
                <th>Role</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {booking.auditLogs && booking.auditLogs.length > 0 ? (
                booking.auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#64748B' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#334155' }}>
                      {log.previousStatus ? `${log.previousStatus} → ` : ''}
                      <strong>{log.newStatus}</strong>
                    </td>
                    <td style={{ fontSize: '0.85rem', fontWeight: '600' }}>{log.actorName}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B' }}>
                        {log.actorRole}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>{log.comment}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#94A3B8' }}>
                    No audit records logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default BookingDetails;
