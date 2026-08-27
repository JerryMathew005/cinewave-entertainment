import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, AlertTriangle, ArrowRight } from 'lucide-react';

const BookingCard = ({ booking, onCancel }) => {
  if (!booking) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return <span className="badge badge-success">{status}</span>;
      case 'PENDING':
      case 'UNDER_REVIEW':
      case 'CUSTOMER_CONFIRMATION':
        return <span className="badge badge-warning">{status}</span>;
      case 'CANCELLED':
      case 'REJECTED':
        return <span className="badge badge-danger">{status}</span>;
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  const getSlaBadge = (slaStatus) => {
    switch (slaStatus) {
      case 'SLA_BREACHED':
        return (
          <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
            <AlertTriangle size={10} /> SLA Breached
          </span>
        );
      case 'SLA_WARNING':
        return (
          <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
            <AlertTriangle size={10} /> SLA Warning
          </span>
        );
      case 'COMPLETED_WITHIN_SLA':
        return <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Within SLA</span>;
      default:
        return null;
    }
  };

  const seatNames = booking.seats && booking.seats.length > 0
    ? booking.seats.map((s) => s.seatNumber).join(', ')
    : 'Seats Reserved';

  const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Ticket size={16} color="#0284C7" />
            <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#0A192F', letterSpacing: '0.04em' }}>
              {booking.bookingReference}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Booked on {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {getSlaBadge(booking.slaStatus)}
          {getStatusBadge(booking.status)}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
        {/* Movie Poster */}
        <div style={{ width: '65px', height: '90px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#0A192F', flexShrink: 0 }}>
          <img
            src={booking.show?.moviePoster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
            alt={booking.show?.movieTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <h4 style={{ fontSize: '1.1rem', color: '#0A192F', marginBottom: '0.25rem' }}>
            {booking.show?.movieTitle}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#64748B', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> {booking.show?.showDate}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} /> {booking.show?.startTime ? booking.show.startTime.substring(0, 5) : ''}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} /> {booking.show?.theatreName} ({booking.show?.screenName})
            </span>
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            <strong style={{ color: '#334155' }}>Seats:</strong>{' '}
            <span style={{ color: '#0284C7', fontWeight: '600' }}>{seatNames}</span>
          </div>
        </div>

        {/* Price and Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', marginLeft: 'auto' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Total Paid</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0A192F' }}>
              ₹{Number(booking.totalAmount || 0).toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {canCancel && onCancel && (
              <button
                onClick={() => onCancel(booking.id)}
                className="btn btn-secondary btn-sm"
                style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
              >
                Cancel
              </button>
            )}
            <Link to={`/booking-details/${booking.id}`} className="btn btn-primary btn-sm">
              View Ticket <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
