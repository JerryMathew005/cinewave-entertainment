import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Globe, Tv, Film } from 'lucide-react';

const MovieCard = ({ movie }) => {
  if (!movie) return null;

  const isSeries = movie.isSeries ||
    (movie.genre && movie.genre.toLowerCase().includes('series')) ||
    (movie.title && movie.title.toLowerCase().includes('chosen'));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NOW_SHOWING':
        return <span className="badge badge-primary">Now Showing</span>;
      case 'COMING_SOON':
        return <span className="badge badge-warning">Coming Soon</span>;
      case 'ARCHIVED':
        return <span className="badge" style={{ backgroundColor: '#E2E8F0', color: '#475569' }}>Archived</span>;
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  return (
    <div className="card card-clickable" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Poster with overlays */}
      <div style={{ position: 'relative', width: '100%', height: '320px', backgroundColor: '#0A192F', overflow: 'hidden' }}>
        <img
          src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          className="movie-poster-img"
        />

        {/* Rating Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(10, 25, 47, 0.85)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#F59E0B',
          fontSize: '0.8125rem',
          fontWeight: '700'
        }}>
          <Star size={14} fill="#F59E0B" />
          <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.5'}</span>
        </div>

        {/* Badges on Top Left */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {getStatusBadge(movie.status)}
          {isSeries && (
            <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Tv size={12} /> TV / Web Series
            </span>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.3' }}>
          {movie.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748B', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> {movie.duration}m
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={13} /> {movie.language}
          </span>
        </div>

        <p style={{
          fontSize: '0.85rem',
          color: '#475569',
          marginBottom: '1.25rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          flex: 1
        }}>
          {movie.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: 'auto' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: isSeries ? '#7E22CE' : '#0284C7',
            backgroundColor: isSeries ? '#F3E8FF' : '#E0F2FE',
            padding: '3px 8px',
            borderRadius: '4px'
          }}>
            {movie.genre}
          </span>
          <Link to={`/movies/${movie.id}`} className="btn btn-primary btn-sm">
            {movie.status === 'NOW_SHOWING' ? (isSeries ? 'View Episodes & Shows' : 'Book Tickets') : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
