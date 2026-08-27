import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import showService from '../services/showService';
import seatService from '../services/seatService';
import bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';
import BookingSummary from '../components/BookingSummary';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [proceedLoading, setProceedLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShowAndSeats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [showData, seatsData] = await Promise.all([
        showService.getShowById(showId),
        seatService.getSeatsForShow(showId)
      ]);
      setShow(showData);
      setSeats(seatsData || []);
    } catch (err) {
      console.error('Failed to load show seats', err);
      setError('Failed to load show and seat availability. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [showId]);

  useEffect(() => {
    fetchShowAndSeats();
  }, [fetchShowAndSeats]);

  // Recalculate cost whenever selected seats or coupon changes
  const updateCost = useCallback(async (currentSelected, currentCoupon) => {
    if (!currentSelected || currentSelected.length === 0) {
      setBreakdown(null);
      return;
    }

    try {
      const seatIds = currentSelected.map((s) => s.id);
      const data = await bookingService.calculateCost(showId, seatIds, currentCoupon);
      setBreakdown(data);
    } catch (err) {
      console.error('Cost calculation failed', err);
    }
  }, [showId]);

  const handleToggleSeat = (seat) => {
    let updated;
    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

    if (isAlreadySelected) {
      updated = selectedSeats.filter((s) => s.id !== seat.id);
    } else {
      if (selectedSeats.length >= 10) {
        alert('You can select a maximum of 10 seats per booking.');
        return;
      }
      updated = [...selectedSeats, seat];
    }

    setSelectedSeats(updated);
    updateCost(updated, couponCode);
  };

  const handleApplyCoupon = async (code) => {
    if (!selectedSeats.length) {
      alert('Please select seats before applying a coupon');
      return;
    }
    setCouponLoading(true);
    setCouponCode(code);
    try {
      await updateCost(selectedSeats, code);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleProceedBooking = async () => {
    if (!isAuthenticated) {
      // Save current selection and redirect to login
      navigate('/login', { state: { from: `/seat-selection/${showId}` } });
      return;
    }

    if (!selectedSeats.length) {
      alert('Please select at least one seat');
      return;
    }

    setProceedLoading(true);
    setError(null);

    try {
      const seatIds = selectedSeats.map((s) => s.id);
      // US-001: Submit Ticket Request
      const response = await bookingService.createBooking(showId, seatIds, couponCode);
      // Redirect to confirmation page
      navigate(`/booking-confirmation/${response.id}`);
    } catch (err) {
      console.error('Booking submission failed', err);
      const msg = err.response?.data?.message || 'Failed to submit booking request. Please check seat availability.';
      setError(msg);
      // Refresh seat layout to show updated booked seats
      fetchShowAndSeats();
    } finally {
      setProceedLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading auditorium seats..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      
      {/* Top Breadcrumb & Movie Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
        <div>
          <Link to={`/movies/${show?.movieId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284C7', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Movie
          </Link>
          <h1 style={{ fontSize: '1.85rem', color: '#0A192F', margin: '0 0 0.25rem 0' }}>
            {show?.movieTitle}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#64748B', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="#0284C7" /> {show?.theatreName} ({show?.screenName})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} color="#0284C7" /> {show?.showDate}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} color="#0284C7" /> {show?.startTime?.substring(0, 5)}
            </span>
          </div>
        </div>

        <button
          onClick={fetchShowAndSeats}
          className="btn btn-secondary btn-sm"
          title="Refresh seat availability"
        >
          <RefreshCw size={14} /> Refresh Seats
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchShowAndSeats} />}

      {/* Main Seating & Summary Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
        
        {/* Left: Seat Grid */}
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <SeatGrid
            seats={seats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
          />
        </div>

        {/* Right: Booking Cost Breakdown & Proceed */}
        <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
          <BookingSummary
            breakdown={breakdown}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            onApplyCoupon={handleApplyCoupon}
            couponLoading={couponLoading}
            onProceed={handleProceedBooking}
            proceedLoading={proceedLoading}
            disabled={selectedSeats.length === 0}
          />
        </div>

      </div>

    </div>
  );
};

export default SeatSelection;
