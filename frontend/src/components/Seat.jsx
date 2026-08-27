import React from 'react';

const Seat = ({ seat, isSelected, onToggle }) => {
  const isBooked = seat.isBooked;

  const handleClick = () => {
    if (!isBooked) {
      onToggle(seat);
    }
  };

  const getSeatClass = () => {
    if (isBooked) return 'seat-btn booked';
    if (isSelected) return 'seat-btn selected';
    return 'seat-btn available';
  };

  const getTypeStyle = () => {
    if (isBooked || isSelected) return {};

    switch (seat.seatType) {
      case 'RECLINER':
        return { backgroundColor: '#EEF2FF', borderColor: '#818CF8', color: '#4338CA' };
      case 'PREMIUM':
        return { backgroundColor: '#E0F2FE', borderColor: '#38BDF8', color: '#0369A1' };
      default:
        return { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1', color: '#334155' };
    }
  };

  return (
    <button
      type="button"
      className={getSeatClass()}
      style={getTypeStyle()}
      onClick={handleClick}
      disabled={isBooked}
      title={`${seat.seatNumber} • ${seat.seatType} • ₹${seat.price || 250}${isBooked ? ' (Already Booked)' : ''}`}
    >
      {seat.seatNumber.substring(1)}
    </button>
  );
};

export default Seat;
