import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle2,
  Lock,
  X,
  Calendar,
  Clock,
  MapPin,
  Ticket
} from 'lucide-react';

const PaymentModal = ({
  isOpen,
  onClose,
  show,
  selectedSeats,
  breakdown,
  onConfirmPayment,
  loading
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState('Jerry Customer');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [upiId, setUpiId] = useState('customer@cinewave');

  if (!isOpen) return null;

  const totalAmount = breakdown?.totalAmount || 0;
  const seatNumbers = selectedSeats.map((s) => s.seatNumber).join(', ');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmPayment({
      method: paymentMethod,
      details: paymentMethod === 'card' ? { cardNumber, cardHolder } : { upiId }
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 25, 47, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #E2E8F0',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#0A192F',
            color: '#FFFFFF',
            padding: '1.25rem 1.5rem',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <ShieldCheck size={20} color="#38BDF8" />
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#FFFFFF' }}>
                  CineWave Secure Checkout
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    color: '#38BDF8',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}
                >
                  DEMO / TEST PAYMENT FLOW
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>No real cards or money required</span>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px'
              }}
              aria-label="Close payment modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Order Snapshot Card */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem',
              border: '1px solid #E2E8F0'
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: '#0A192F', fontWeight: '700' }}>
              {show?.movieTitle}
            </h4>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', fontSize: '0.8125rem', color: '#64748B', marginBottom: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="#0284C7" /> {show?.theatreName} ({show?.screenName})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} color="#0284C7" /> {show?.showDate}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} color="#0284C7" /> {show?.startTime?.substring(0, 5)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '0.5rem' }}>
              <div style={{ fontSize: '0.8125rem', color: '#475569' }}>
                <Ticket size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: '#0284C7' }} />
                Seats: <strong style={{ color: '#0A192F' }}>{seatNumbers}</strong> ({selectedSeats.length} Ticket{selectedSeats.length > 1 ? 's' : ''})
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Total: </span>
                <strong style={{ fontSize: '1.25rem', color: '#0284C7' }}>₹{Number(totalAmount).toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
              Select Payment Method (Simulated):
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                { id: 'netbanking', label: 'NetBanking', icon: Building2 },
                { id: 'wallet', label: 'Wallet', icon: Wallet }
              ].map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      padding: '0.625rem 0.5rem',
                      borderRadius: '8px',
                      border: active ? '2px solid #0284C7' : '1px solid #CBD5E1',
                      backgroundColor: active ? '#F0F9FF' : '#FFFFFF',
                      color: active ? '#0284C7' : '#475569',
                      fontWeight: active ? '700' : '500',
                      fontSize: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={18} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Method Fields */}
          {paymentMethod === 'card' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Pre-filled Test Card</span>
                <span style={{ fontSize: '0.7rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <CheckCircle2 size={12} /> Auto-Verified
                </span>
              </div>

              <div style={{ marginBottom: '0.65rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '2px' }}>Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem', fontFamily: 'monospace' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '2px' }}>Name on Card</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '2px' }}>Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem', fontFamily: 'monospace' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '2px' }}>CVV</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem', fontFamily: 'monospace' }}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '2px' }}>Virtual Payment Address (UPI ID)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
                  required
                />
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> Instant simulated UPI mandate approved
              </p>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8125rem', color: '#475569' }}>
                Simulated NetBanking via <strong>CineWave Partner Bank (Pre-approved Test Mode)</strong>
              </p>
              <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> Instant test settlement ready
              </span>
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>CineWave Wallet Balance:</span>
                <strong style={{ fontSize: '1rem', color: '#10B981' }}>₹5,000.00</strong>
              </div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#64748B' }}>
                Sufficient balance available for this transaction.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ flex: 2, padding: '0.75rem 1rem', fontSize: '0.95rem' }}
            >
              {loading ? (
                'Processing Test Payment...'
              ) : (
                <>
                  <Lock size={15} /> Pay ₹{Number(totalAmount).toFixed(2)} & Confirm
                </>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '1rem', fontSize: '0.7rem', color: '#64748B' }}>
            <ShieldCheck size={13} color="#10B981" /> 256-Bit Simulated SSL • Safe & Instant Confirmation
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
