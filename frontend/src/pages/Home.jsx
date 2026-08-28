import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Sparkles, Shield, Ticket, Star, ArrowRight, Play } from 'lucide-react';
import movieService from '../services/movieService';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getOfficialPoster, getOfficialBanner, DEFAULT_MOVIE_BANNER } from '../utils/movieAssets';

const Home = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [showingRes, comingRes] = await Promise.all([
        movieService.getNowShowing(),
        movieService.getComingSoon()
      ]);
      setNowShowing(showingRes || []);
      setComingSoon(comingRes || []);
    } catch (err) {
      console.error('Failed to load movies on home page', err);
      setError(err.response?.data?.message || 'No internet connection. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const heroMovie = nowShowing[0] || {
    title: 'Interstellar: The IMAX Experience',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival. Witness Christopher Nolan masterpiece on giant IMAX screens with laser projection.',
    rating: 8.7,
    duration: 169,
    genre: 'Sci-Fi / Adventure',
    posterUrl: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg'
  };

  return (
    <div>
      {/* Hero Banner with Cinema Blue Ambient Lighting */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #0A192F 0%, #0F2744 60%, #061325 100%)',
        color: '#FFFFFF',
        padding: '5rem 0 6rem',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)'
      }}>
        {/* Glow Spheres */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-100px',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            
            {/* Left Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(2, 132, 199, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8125rem',
                fontWeight: '600',
                color: '#38BDF8',
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={14} /> Next-Generation Movie Ticketing
              </div>

              <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.15', color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Cinema Reimagined in <span style={{ background: 'linear-gradient(90deg, #38BDF8 0%, #0EA5E9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ultra Blue</span>
              </h1>

              <p style={{ fontSize: '1.1rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '2rem' }}>
                Book prime seats instantly across premium theatres. Experience real-time seat locks, automated team routing, and guaranteed SLA processing.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <Link to="/movies" className="btn btn-primary btn-lg" style={{ boxShadow: '0 0 25px rgba(14, 165, 233, 0.5)' }}>
                  <Ticket size={18} /> Book Tickets Now
                </Link>
                <Link to="/shows" className="btn btn-secondary btn-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                  View Showtimes <ArrowRight size={18} />
                </Link>
              </div>

              {/* Stats highlights */}
              <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#38BDF8' }}>4+</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Luxury Theatres</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#38BDF8' }}>360+</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Premium Seats</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#38BDF8' }}>30 Min</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Guaranteed SLA</div>
                </div>
              </div>
            </div>

            {/* Right Featured Movie Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '420px',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(14, 165, 233, 0.3)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                backgroundColor: '#0F2744'
              }}>
                <div style={{ height: '360px', position: 'relative', backgroundColor: '#0A192F' }}>
                  <img
                    src={getOfficialBanner(heroMovie) || getOfficialPoster(heroMovie)}
                    alt={heroMovie.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_MOVIE_BANNER;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(10, 25, 47, 0) 30%, rgba(10, 25, 47, 0.95) 100%)'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(2, 132, 199, 0.9)',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    Featured Release
                  </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#38BDF8', fontWeight: '600' }}>{heroMovie.genre}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontSize: '0.85rem', fontWeight: '700' }}>
                      <Star size={14} fill="#F59E0B" /> {heroMovie.rating || 8.5}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>
                    {heroMovie.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1.25rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {heroMovie.description}
                  </p>
                  <Link to={heroMovie.id ? `/movies/${heroMovie.id}` : '/movies'} className="btn btn-primary" style={{ width: '100%' }}>
                    View Showtimes
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ color: '#0284C7', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Currently in Theatres
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>
                Now Showing
              </h2>
            </div>
            <Link to="/movies" style={{ color: '#0284C7', fontWeight: '600', fontSize: '0.925rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              See All Movies <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching movies..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchData} />
          ) : nowShowing.length === 0 ? (
            <p style={{ color: '#64748B' }}>No movies currently showing.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.75rem'
            }}>
              {nowShowing.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value Pillars / System Guarantees */}
      <section style={{ backgroundColor: '#F0F9FF', padding: '4rem 0', borderTop: '1px solid #BAE6FD', borderBottom: '1px solid #BAE6FD' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
              Why Choose CineWave?
            </h2>
            <p style={{ color: '#475569' }}>
              Built for speed, fairness, and cinema enthusiasts with enterprise-grade booking management.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#0284C7' }}>
                <Shield size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Double-Bookings</h3>
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                Serializable database transactions guarantee duplicate seat protection even under high peak concurrency.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#0284C7' }}>
                <Ticket size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Instant QR E-Tickets</h3>
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                Receive immediate digital verification with contactless QR pass, case lifecycle tracking, and instant print.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#0284C7' }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Auto-Routed Support</h3>
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                IMAX, 3D, and Premium shows are automatically routed to dedicated specialist operations teams with 30-minute SLAs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      {comingSoon.length > 0 && (
        <section style={{ padding: '4rem 0' }}>
          <div className="container">
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ color: '#0284C7', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Upcoming Hits
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>
                Coming Soon to Theatres
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.75rem'
            }}>
              {comingSoon.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
