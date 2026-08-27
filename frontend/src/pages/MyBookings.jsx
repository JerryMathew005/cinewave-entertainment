import React, { useState, useEffect } from 'react';
import { Ticket, Filter } from 'lucide-react';
import bookingService from '../services/bookingService';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationDialog from '../components/ConfirmationDialog';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Cancellation dialog state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [targetBookingId, setTargetBookingId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenCancel = (id) => {
    setTargetBookingId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!targetBookingId) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(targetBookingId);
      setCancelModalOpen(false);
      fetchBookings();
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || ''));
    } finally {
      setCancelling(false);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'CONFIRMED') return b.status === 'CONFIRMED' || b.status === 'COMPLETED';
    if (filterStatus === 'PENDING') return b.status === 'PENDING' || b.status === 'UNDER_REVIEW';
    if (filterStatus === 'CANCELLED') return b.status === 'CANCELLED' || b.status === 'REJECTED';
    return true;
  });

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '880px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ticket size={28} color="#0284C7" />
            My Bookings
          </h1>
          <p style={{ color: '#64748B' }}>
            View your ticket history, download passes, and track case statuses.
          </p>
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: filterStatus === status ? '#0284C7' : '#E2E8F0',
                backgroundColor: filterStatus === status ? '#0284C7' : '#FFFFFF',
                color: filterStatus === status ? '#FFFFFF' : '#475569',
                fontSize: '0.8125rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving your bookings..." />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
          <Ticket size={40} color="#CBD5E1" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#0A192F', marginBottom: '0.5rem' }}>No Bookings Found</h3>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
            {filterStatus === 'ALL'
              ? 'You have not booked any tickets yet.'
              : `No ${filterStatus.toLowerCase()} bookings found.`}
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancel={handleOpenCancel}
            />
          ))}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Movie Booking"
        message="Are you sure you want to cancel this booking? Your reserved seats will be immediately released back to other cinema guests."
        confirmText="Yes, Cancel Booking"
        isDanger={true}
        loading={cancelling}
      />
    </div>
  );
};

export default MyBookings;
