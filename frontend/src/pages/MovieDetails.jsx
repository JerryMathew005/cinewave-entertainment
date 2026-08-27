import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Globe, Calendar, Heart, MessageSquare, Play, Film, ArrowLeft } from 'lucide-react';
import movieService from '../services/movieService';
import showService from '../services/showService';
import wishlistService from '../services/wishlistService';
import reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import ShowCard from '../components/ShowCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const MovieDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);

  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const [movieData, showsData, reviewsData] = await Promise.all([
          movieService.getMovieById(id),
          showService.getShowsByMovie(id),
          reviewService.getMovieReviews(id)
        ]);

        setMovie(movieData);
        setShows(showsData || []);
        setReviews(reviewsData || []);

        if (isAuthenticated) {
          try {
            const isFav = await wishlistService.checkWishlist(id);
            setInWishlist(isFav);
          } catch {
            // Ignore
          }
        }
      } catch (err) {
        console.error('Failed to fetch movie details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, isAuthenticated]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to save movies to your wishlist');
      return;
    }
    try {
      if (inWishlist) {
        await wishlistService.removeFromWishlist(id);
        setInWishlist(false);
      } else {
        await wishlistService.addToWishlist(id);
        setInWishlist(true);
      }
    } catch (err) {
      console.error('Wishlist toggle failed', err);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in to submit a review');
      return;
    }

    setSubmittingReview(true);
    try {
      const newReview = await reviewService.addReview(id, { rating, comment });
      setReviews([newReview, ...reviews]);
      setReviewModalOpen(false);
      setComment('');
      // Refresh movie rating
      const updatedMovie = await movieService.getMovieById(id);
      setMovie(updatedMovie);
    } catch (err) {
      alert('Failed to submit review. ' + (err.response?.data?.message || ''));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading movie details..." />;
  if (!movie) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Movie not found.</div>;

  return (
    <div>
      {/* Movie Hero Banner with Blur Backdrop */}
      <div style={{
        position: 'relative',
        backgroundColor: '#0A192F',
        color: '#FFFFFF',
        padding: '3rem 0',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        overflow: 'hidden'
      }}>
        {/* Ambient Glow Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Link to="/movies" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#38BDF8', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: '600' }}>
            <ArrowLeft size={16} /> Back to Movies
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
            
            {/* Poster Card */}
            <div style={{ maxWidth: '300px', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                style={{ width: '100%', height: '420px', objectFit: 'cover' }}
              />
            </div>

            {/* Details Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">{movie.genre}</span>
                <span className="badge badge-success">{movie.status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}</span>
              </div>

              <h1 style={{ fontSize: '2.75rem', color: '#FFFFFF', marginBottom: '0.75rem', lineHeight: '1.15' }}>
                {movie.title}
              </h1>

              {/* Meta items */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', color: '#CBD5E1', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F59E0B', fontWeight: '700' }}>
                  <Star size={18} fill="#F59E0B" /> {movie.rating ? Number(movie.rating).toFixed(1) : '8.5'} / 10
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} /> {movie.duration} mins
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={16} /> {movie.language}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} /> {movie.releaseDate}
                </span>
              </div>

              <p style={{ color: '#E2E8F0', fontSize: '1rem', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '750px' }}>
                {movie.description}
              </p>

              {/* Actions: Wishlist and Trailer */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                {movie.trailerUrl && (
                  <a
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <Play size={16} /> Watch Trailer
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="btn btn-secondary"
                  style={{
                    backgroundColor: inWishlist ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                    borderColor: inWishlist ? '#EF4444' : 'rgba(255, 255, 255, 0.2)',
                    color: inWishlist ? '#EF4444' : '#FFFFFF'
                  }}
                >
                  <Heart size={16} fill={inWishlist ? '#EF4444' : 'none'} />
                  {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Available Showtimes Section */}
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>
            Available Showtimes
          </h2>
          <p style={{ color: '#64748B' }}>
            Select your preferred cinema and showtime to choose seats.
          </p>
        </div>

        {shows.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#64748B', margin: 0 }}>No showtimes currently scheduled for this movie.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}

        {/* Customer Reviews Section */}
        <div style={{ marginTop: '4.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>Customer Reviews</h2>
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>What viewers are saying about {movie.title}</p>
            </div>
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <MessageSquare size={14} /> Write a Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748B' }}>
              No reviews yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {reviews.map((r) => (
                <div key={r.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#0A192F', fontSize: '0.925rem' }}>{r.userName || 'Movie Fan'}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B', fontSize: '0.85rem' }}>
                      <Star size={14} fill="#F59E0B" /> {r.rating}/5
                    </div>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 0.5rem 0' }}>
                    {r.comment}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Review Modal */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title={`Review ${movie.title}`}>
        <form onSubmit={handleAddReview}>
          <div className="form-group">
            <label className="form-label">Your Rating (1 to 5 Stars)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: star <= rating ? '#F59E0B' : '#CBD5E1',
                    padding: '4px'
                  }}
                >
                  <Star size={28} fill={star <= rating ? '#F59E0B' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Review Comments</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked about the visuals, sound, plot, or performance..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={() => setReviewModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submittingReview} className="btn btn-primary">
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default MovieDetails;
