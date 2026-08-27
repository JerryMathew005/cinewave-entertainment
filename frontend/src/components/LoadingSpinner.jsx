import React from 'react';

const LoadingSpinner = ({ size = 36, text = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      gap: '1rem'
    }}>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: '3px solid #E0F2FE',
          borderTop: '3px solid #0284C7',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      {text && <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '500' }}>{text}</span>}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
