import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import theatreService from '../services/theatreService';
import TheatreCard from '../components/TheatreCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Theatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);

  const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];

  useEffect(() => {
    const fetchTheatres = async () => {
      setLoading(true);
      try {
        const data = await theatreService.getAllTheatres(city);
        setTheatres(data || []);
      } catch (err) {
        console.error('Failed to load theatres', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTheatres();
  }, [city]);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Our Cinema Locations</h1>
        <p style={{ color: '#64748B', fontSize: '1rem' }}>
          Discover cutting-edge IMAX, Dolby Atmos, and Laser auditoriums near you.
        </p>
      </div>

      {/* City Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284C7', fontWeight: '600', fontSize: '0.85rem', marginRight: '0.5rem' }}>
          <MapPin size={16} /> Select City:
        </div>
        <button
          type="button"
          onClick={() => setCity('')}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            border: '1px solid',
            borderColor: city === '' ? '#0284C7' : '#CBD5E1',
            backgroundColor: city === '' ? '#0284C7' : '#FFFFFF',
            color: city === '' ? '#FFFFFF' : '#475569',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          All Cities
        </button>
        {cities.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCity(c)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: city === c ? '#0284C7' : '#CBD5E1',
              backgroundColor: city === c ? '#0284C7' : '#FFFFFF',
              color: city === c ? '#FFFFFF' : '#475569',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading cinema theatres..." />
      ) : theatres.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '16px' }}>
          <p style={{ color: '#64748B' }}>No theatres found for this city.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {theatres.map((t) => (
            <TheatreCard key={t.id} theatre={t} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Theatres;
