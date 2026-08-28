import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Film, Calendar, Clock, MapPin, Printer, CheckCircle } from 'lucide-react';
import { getOfficialPoster, getFallbackPoster } from '../utils/movieAssets';

const Ticket = ({ booking }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const qrPayload = JSON.stringify({
    ref: booking.bookingReference,
    movie: booking.show?.movieTitle,
    date: booking.show?.showDate,
    time: booking.show?.startTime,
    seats: booking.seats?.map((s) => s.seatNumber).join(','),
  });

  const posterSrc = getOfficialPoster({
    title: booking.show?.movieTitle,
    posterUrl: booking.show?.moviePoster
  });

  return (
    <div>
      <div className="digital-ticket">
        {/* Ticket Header */}
        <div className="ticket-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
              padding: '0.4rem',
              borderRadius: '8px'
            }}>
              <Film size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>CineWave Entertainment</div>
              <div style={{ fontSize: '0.7rem', color: '#38BDF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Official E-Ticket</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-success" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              <CheckCircle size={12} /> {booking.status}
            </span>
            <div style={{ fontSize: '0.75rem', color: '#BAE6FD', marginTop: '4px' }}>
              Ref: <strong>{booking.bookingReference}</strong>
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="ticket-body">
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Movie Poster */}
            <div style={{ width: '90px', height: '125px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#0A192F', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
              <img
                src={posterSrc}
                alt={booking.show?.movieTitle}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackPoster(booking.show?.movieTitle);
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Movie Details */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.4rem', color: '#0A192F', marginBottom: '0.35rem', lineHeight: '1.2' }}>
                {booking.show?.movieTitle}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                  {booking.show?.showType || 'STANDARD'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center' }}>
                  {booking.show?.movieDuration || 150} mins
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569', fontSize: '0.85rem' }}>
                <MapPin size={14} color="#0284C7" />
                <span>{booking.show?.theatreName}, {booking.show?.theatreCity}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#0284C7', fontWeight: '600', marginTop: '2px' }}>
                Auditorium: {booking.show?.screenName}
              </div>
            </div>
          </div>

          {/* Key Timings & Seats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            backgroundColor: '#F8FAFC',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            marginBottom: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Date</span>
              <strong style={{ fontSize: '0.95rem', color: '#0A192F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} color="#0284C7" /> {booking.show?.showDate}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Time</span>
              <strong style={{ fontSize: '0.95rem', color: '#0A192F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} color="#0284C7" /> {booking.show?.startTime ? booking.show.startTime.substring(0, 5) : '18:00'}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Seats ({booking.seats?.length || 0})</span>
              <strong style={{ fontSize: '0.95rem', color: '#0284C7' }}>
                {booking.seats?.map((s) => s.seatNumber).join(', ')}
              </strong>
            </div>
          </div>

          {/* Tear notch divider */}
          <div className="ticket-divider">
            <div className="ticket-notch-left" />
            <div className="ticket-dashed-line" />
            <div className="ticket-notch-right" />
          </div>

          {/* QR Code & Barcode Section */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', paddingTop: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Total Paid</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0A192F' }}>
                ₹{Number(booking.totalAmount || 0).toFixed(2)}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '600' }}>
                Payment Status: {booking.paymentStatus || 'PAID'}
              </span>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                Guest: {booking.user?.name}
              </div>
            </div>

            {/* QR Code */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'inline-block' }}>
                <QRCodeSVG value={qrPayload} size={90} />
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '4px', letterSpacing: '0.05em' }}>
                SCAN AT ENTRY GATE
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Print / Download Button */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button onClick={handlePrint} className="btn btn-secondary">
          <Printer size={16} /> Print E-Ticket
        </button>
      </div>
    </div>
  );
};

export default Ticket;
