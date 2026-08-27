import React from 'react';
import Seat from './Seat';

const SeatGrid = ({ seats, selectedSeats, onToggleSeat }) => {
  // Group seats by rowName (A, B, C, D, E, F)
  const rows = {};
  seats.forEach((seat) => {
    const row = seat.rowName || seat.seatNumber.charAt(0);
    if (!rows[row]) {
      rows[row] = [];
    }
    rows[row].push(seat);
  });

  const sortedRowKeys = Object.keys(rows).sort();

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Cinema Screen Visual Curve with Glow */}
      <div className="screen-visual-container">
        <div className="cinema-screen-curve" />
        <span className="screen-text">All Eyes This Way • Cinema Screen</span>
      </div>

      {/* Seating Grid */}
      <div className="seat-grid-container">
        {sortedRowKeys.map((rowKey) => {
          const rowSeats = rows[rowKey].sort((a, b) => {
            const numA = parseInt(a.seatNumber.replace(/\D/g, ''), 10);
            const numB = parseInt(b.seatNumber.replace(/\D/g, ''), 10);
            return numA - numB;
          });

          return (
            <div key={rowKey} className="seat-row">
              <span className="row-label">{rowKey}</span>

              {rowSeats.map((seat, index) => {
                const isSelected = selectedSeats.some((s) => s.id === seat.id);
                // Add an aisle gap in the middle (e.g. after index 4 in a 10-seat row)
                const isAisle = index === 4;

                return (
                  <React.Fragment key={seat.id}>
                    <Seat
                      seat={seat}
                      isSelected={isSelected}
                      onToggle={onToggleSeat}
                    />
                    {isAisle && <div style={{ width: '16px' }} />}
                  </React.Fragment>
                );
              })}

              <span className="row-label">{rowKey}</span>
            </div>
          );
        })}
      </div>

      {/* Seat Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-swatch" style={{ backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1' }} />
          <span>Regular (₹250)</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ backgroundColor: '#E0F2FE', border: '1px solid #38BDF8' }} />
          <span>Premium (₹380)</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ backgroundColor: '#EEF2FF', border: '1px solid #818CF8' }} />
          <span>Recliner (₹550)</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ backgroundColor: '#0284C7' }} />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ backgroundColor: '#CBD5E1' }} />
          <span>Booked / Unavailable</span>
        </div>
      </div>

    </div>
  );
};

export default SeatGrid;
