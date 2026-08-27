import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Ticket as TicketIcon, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import bookingService from '../services/bookingService';
import Ticket from '../components/Ticket';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const BookingConfirmation = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const confettiFired = useRef(false);

  const fetchBooking = async () => {
    try {
      const data = await bookingService.getBookingById(id);
      setBooking(data);

      if ((data.status === 'CONFIRMED' || data.status === 'COMPLETED') && !confettiFired.current) {
        confettiFired.current = true;
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284C7', '#38BDF8', '#0EA5E9', '#10B981']
        });
      }
    } catch (err) {
      console.error('Failed to load booking', err);
      setError('Could not retrieve booking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleExplicitConfirm = async () => {
    setConfirming(true);
    setError(null);
    try {
      // US-004: Explicit customer confirmation
      const confirmed = await bookingService.confirmBooking(id);
      setBooking(confirmed);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#0284C7', '#38BDF8', '#10B981', '#F59E0B']
      });
    } catch (err) {
      console.error('Confirmation failed', err);
      setError('Failed to confirm booking: ' + (err.response?.data?.message || ''));
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <LoadingSpinner text="Retrieving booking confirmation..." />;
  if (error && !booking) return <div className="container" style={{ padding: '3rem' }}><ErrorMessage message={error} /></div>;

  const isConfirmed = booking?.status === 'CONFIRMED' || booking?.status === 'COMPLETED';

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '780px' }}>
      
      {/* Top Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: isConfirmed ? '#ECFDF5' : '#EFF6FF',
          color: isConfirmed ? '#10B981' : '#0284C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: isConfirmed ? '0 0 20px rgba(16, 185, 129, 0.3)' : '0 0 20px rgba(2, 132, 199, 0.3)'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h1 style={{ fontSize: '2.25rem', color: '#0A192F', marginBottom: '0.5rem' }}>
          {isConfirmed ? 'Booking Confirmed!' : 'Booking Request Submitted!'}
        </h1>

        <p style={{ color: '#64748B', fontSize: '1rem' }}>
          Reference Number: <strong style={{ color: '#0284C7' }}>{booking?.bookingReference}</strong>
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* US-004: Explicit Confirmation Step if PENDING */}
      {!isConfirmed && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem', borderLeft: '4px solid #0284C7', backgroundColor: '#F0F9FF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#0A192F', marginBottom: '0.25rem' }}>
                Confirm Your Booking Request
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>
                Please confirm to finalize your seats and generate your official E-Ticket.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExplicitConfirm}
              disabled={confirming}
              className="btn btn-primary btn-lg"
            >
              {confirming ? 'Confirming...' : 'Confirm & Generate Ticket'}
            </button>
          </div>
        </div>
      )}

      {/* Official Digital Ticket Component */}
      <Ticket booking={booking} />

      {/* Bottom Nav Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem' }}>
        <Link to="/my-bookings" className="btn btn-secondary">
          <TicketIcon size={16} /> View All My Bookings
        </Link>
        <Link to="/movies" className="btn btn-primary">
          Explore More Movies <ArrowRight size={16} />
        </Link>
      </div>

    </div>
  );
};

export default BookingConfirmation;
