import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Film, MapPin, Sparkles } from 'lucide-react';
import showService from '../services/showService';
import movieService from '../services/movieService';
import theatreService from '../services/theatreService';
import ShowCard from '../components/ShowCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Shows = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedMovieId, setSelectedMovieId] = useState(searchParams.get('movieId') || '');
  const [selectedTheatreId, setSelectedTheatreId] = useState(searchParams.get('theatreId') || '');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Generate next 5 dates for easy date pills
  const datePills = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString(undefined, { weekday: 'short' }),
      dateNum: d.getDate(),
      month: d.toLocaleDateString(undefined, { month: 'short' })
    };
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [movieList, theatreList] = await Promise.all([
          movieService.getNowShowing(),
          theatreService.getAllTheatres()
        ]);
        setMovies(movieList || []);
        setTheatres(theatreList || []);
      } catch (err) {
        console.error('Failed to load filter metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  const fetchShows = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { showDate: selectedDate };
      if (selectedMovieId) params.movieId = selectedMovieId;
      if (selectedTheatreId) params.theatreId = selectedTheatreId;

      const data = await showService.getAllShows(params);
      setShows(data || []);
    } catch (err) {
      console.error('Failed to fetch shows', err);
      setError(err.response?.data?.message || 'No internet connection. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, [selectedMovieId, selectedTheatreId, selectedDate]);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Showtimes & Schedules</h1>
        <p style={{ color: '#64748B', fontSize: '1rem' }}>
          Select a date, movie, or cinema to book real-time seats.
        </p>
      </div>

      {/* Date Selector Pills */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
        {datePills.map((pill) => (
          <button
            key={pill.iso}
            type="button"
            onClick={() => setSelectedDate(pill.iso)}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: selectedDate === pill.iso ? '#0284C7' : '#E2E8F0',
              backgroundColor: selectedDate === pill.iso ? '#0284C7' : '#FFFFFF',
              color: selectedDate === pill.iso ? '#FFFFFF' : '#0F172A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              minWidth: '95px',
              boxShadow: selectedDate === pill.iso ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600', opacity: 0.85 }}>{pill.dayName}</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{pill.dateNum}</span>
            <span style={{ fontSize: '0.7rem' }}>{pill.month}</span>
          </button>
        ))}
      </div>

      {/* Filter Row: Movie & Theatre select */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', backgroundColor: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Film size={14} color="#0284C7" /> Filter by Movie
          </label>
          <select
            className="form-select"
            value={selectedMovieId}
            onChange={(e) => setSelectedMovieId(e.target.value)}
          >
            <option value="">All Now Showing Movies</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} color="#0284C7" /> Filter by Theatre
          </label>
          <select
            className="form-select"
            value={selectedTheatreId}
            onChange={(e) => setSelectedTheatreId(e.target.value)}
          >
            <option value="">All Theatres & Cities</option>
            {theatres.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Shows List */}
      {loading ? (
        <LoadingSpinner text="Fetching show schedules..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchShows} />
      ) : shows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: '1.1rem', color: '#64748B', margin: 0 }}>
            No shows found for the selected date and filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shows;
