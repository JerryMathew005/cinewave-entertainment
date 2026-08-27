import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight } from 'lucide-react';

const ShowCard = ({ show }) => {
  if (!show) return null;

  const formatBadgeClass = (type) => {
    switch (type) {
      case 'IMAX': return 'badge-danger';
      case 'PREMIUM': return 'badge-warning';
      case 'THREE_D': return 'badge-info';
      default: return 'badge-primary';
    }
  };

  const getFormatLabel = (type) => {
    if (type === 'THREE_D') return '3D RealD';
    return type || 'REGULAR';
  };

  return (
    <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0284C7' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        
        {/* Left: Timing & Format */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            backgroundColor: '#F0F9FF',
            border: '1px solid #BAE6FD',
            borderRadius: '10px',
            padding: '0.625rem 1rem',
            textAlign: 'center',
            minWidth: '95px'
          }}>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0369A1' }}>
              {show.startTime ? show.startTime.substring(0, 5) : '18:00'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              <Clock size={10} /> to {show.endTime ? show.endTime.substring(0, 5) : '21:00'}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className={`badge ${formatBadgeClass(show.showType)}`}>
                {getFormatLabel(show.showType)}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                {show.screenName}
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              {show.theatreName} • {show.theatreCity}
            </p>
          </div>
        </div>

        {/* Right: Price, Availability, CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0A192F' }}>
              ₹{Number(show.basePrice || 250).toFixed(0)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: show.availableSeats < 10 ? '#EF4444' : '#10B981', fontWeight: '600' }}>
              <Users size={12} /> {show.availableSeats !== undefined ? `${show.availableSeats} seats left` : 'Available'}
            </div>
          </div>

          <Link to={`/seat-selection/${show.id}`} className="btn btn-primary btn-sm" style={{ padding: '0.625rem 1.25rem' }}>
            Select Seats <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ShowCard;
