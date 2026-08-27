import React from 'react';
import { MapPin, Tv, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TheatreCard = ({ theatre }) => {
  if (!theatre) return null;

  return (
    <div className="card card-clickable" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#0A192F', marginBottom: '0.25rem' }}>
            {theatre.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.85rem' }}>
            <MapPin size={14} color="#0284C7" />
            <span>{theatre.location}, {theatre.city}</span>
          </div>
        </div>
        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
          {theatre.status}
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem', flex: 1 }}>
        {theatre.address}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.85rem',
        borderTop: '1px solid #E2E8F0',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0284C7', fontSize: '0.8125rem', fontWeight: '600' }}>
          <Tv size={15} /> {theatre.screenCount || 2} Screens (IMAX & Dolby)
        </div>
        <Link to={`/shows?theatreId=${theatre.id}`} className="btn btn-outline-primary btn-sm">
          View Shows <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default TheatreCard;
