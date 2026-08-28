import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import wishlistService from '../services/wishlistService';
import LoadingSpinner from '../components/LoadingSpinner';
import { getOfficialPoster, getFallbackPoster } from '../utils/movieAssets';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await wishlistService.getMyWishlist();
      setWishlist(data || []);
    } catch (err) {
      console.error('Failed to load wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (movieId) => {
    try {
      await wishlistService.removeFromWishlist(movieId);
      setWishlist(wishlist.filter((w) => w.movie.id !== movieId));
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '880px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={28} color="#EF4444" fill="#EF4444" />
          My Movie Wishlist
        </h1>
        <p style={{ color: '#64748B' }}>
          Keep track of movies you want to watch and book tickets when showtimes release.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading saved movies..." />
      ) : wishlist.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
          <Heart size={40} color="#CBD5E1" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#0A192F', marginBottom: '0.5rem' }}>Your Wishlist is Empty</h3>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Explore our movie catalog and tap the heart icon to save titles.
          </p>
          <Link to="/movies" className="btn btn-primary btn-sm">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {wishlist.map((item) => (
            <div key={item.id} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ width: '70px', height: '95px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#0A192F', flexShrink: 0 }}>
                <img
                  src={getOfficialPoster(item.movie)}
                  alt={item.movie?.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getFallbackPoster(item.movie?.title);
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#0A192F', marginBottom: '0.25rem' }}>
                  {item.movie?.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', color: '#64748B', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                  <span>{item.movie?.genre}</span>
                  <span>•</span>
                  <span>{item.movie?.duration} mins</span>
                  <span>•</span>
                  <span>{item.movie?.language}</span>
                </div>
                <span className={`badge ${item.movie?.status === 'NOW_SHOWING' ? 'badge-primary' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                  {item.movie?.status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
                <button
                  type="button"
                  onClick={() => handleRemove(item.movie?.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#EF4444' }}
                  title="Remove from wishlist"
                >
                  <Trash2 size={15} />
                </button>
                <Link to={`/movies/${item.movie?.id}`} className="btn btn-primary btn-sm">
                  View Movie <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
