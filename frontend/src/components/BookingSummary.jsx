import React, { useState } from 'react';
import { Tag, CheckCircle, AlertCircle, ShieldCheck, Ticket } from 'lucide-react';

const BookingSummary = ({
  breakdown,
  couponCode,
  setCouponCode,
  onApplyCoupon,
  couponLoading,
  onProceed,
  proceedLoading,
  disabled
}) => {
  const [localCoupon, setLocalCoupon] = useState(couponCode || '');

  const handleApply = (e) => {
    e.preventDefault();
    if (localCoupon.trim()) {
      onApplyCoupon(localCoupon.trim());
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
        <Ticket size={18} color="#0284C7" />
        Booking Summary
      </h3>

      {/* Selected Seats Summary */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          <span style={{ color: '#64748B' }}>Selected Seats:</span>
          <strong style={{ color: '#0A192F' }}>
            {breakdown?.seatCount || 0} Seat{(breakdown?.seatCount || 0) > 1 ? 's' : ''}
          </strong>
        </div>

        {breakdown?.selectedSeats && breakdown.selectedSeats.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
            {breakdown.selectedSeats.map((seat) => (
              <span key={seat.id} style={{
                backgroundColor: '#E0F2FE',
                color: '#0369A1',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                {seat.seatNumber} ({seat.seatType})
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Coupon Box */}
      <div style={{ marginBottom: '1.25rem' }}>
        <form onSubmit={handleApply} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Promo Code (e.g. CINEWAVE20)"
              value={localCoupon}
              onChange={(e) => setLocalCoupon(e.target.value.toUpperCase())}
              className="form-input"
              style={{ textTransform: 'uppercase', paddingLeft: '2rem', fontSize: '0.8125rem' }}
            />
            <Tag size={13} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94A3B8' }} />
          </div>
          <button
            type="submit"
            className="btn btn-secondary btn-sm"
            disabled={couponLoading || !localCoupon.trim()}
          >
            {couponLoading ? '...' : 'Apply'}
          </button>
        </form>

        {breakdown?.couponMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            marginTop: '0.5rem',
            color: breakdown.couponApplied ? '#10B981' : '#EF4444'
          }}>
            {breakdown.couponApplied ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            <span>{breakdown.couponMessage}</span>
          </div>
        )}
      </div>

      {/* Price Line Items */}
      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
          <span>Ticket Subtotal:</span>
          <span>₹{Number(breakdown?.subtotal || 0).toFixed(2)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
          <span>Convenience Fee (10%):</span>
          <span>₹{Number(breakdown?.serviceFee || 0).toFixed(2)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
          <span>Integrated Tax (18% GST):</span>
          <span>₹{Number(breakdown?.tax || 0).toFixed(2)}</span>
        </div>

        {Number(breakdown?.discount || 0) > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: '600' }}>
            <span>Coupon Discount:</span>
            <span>-₹{Number(breakdown.discount).toFixed(2)}</span>
          </div>
        )}

        <div style={{
          borderTop: '2px solid #0A192F',
          paddingTop: '0.75rem',
          marginTop: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1rem', fontWeight: '700', color: '#0A192F' }}>Total Payable:</span>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0284C7' }}>
            ₹{Number(breakdown?.totalAmount || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onProceed}
        disabled={disabled || proceedLoading || !breakdown?.seatCount}
        className="btn btn-primary btn-lg"
        style={{ width: '100%', marginTop: '1.5rem' }}
      >
        {proceedLoading ? 'Processing Payment...' : 'Proceed to Payment'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1rem', color: '#64748B', fontSize: '0.75rem' }}>
        <ShieldCheck size={14} color="#10B981" /> 100% Safe & Secure Transaction
      </div>
    </div>
  );
};

export default BookingSummary;
