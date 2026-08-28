import React, { useState, useEffect } from 'react';
import { Cloud, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const ColdStartBanner = () => {
  const [visible, setVisible] = useState(false);
  const [secondsWaiting, setSecondsWaiting] = useState(0);

  useEffect(() => {
    let timer = null;
    let counter = null;
    let isMounted = true;

    // Trigger banner if first health check takes longer than 2 seconds
    timer = setTimeout(() => {
      if (isMounted) {
        setVisible(true);
        counter = setInterval(() => {
          setSecondsWaiting((prev) => prev + 1);
        }, 1000);
      }
    }, 2500);

    api.get('/health')
      .then(() => {
        if (isMounted) {
          setVisible(false);
          clearTimeout(timer);
          if (counter) clearInterval(counter);
        }
      })
      .catch(() => {
        // Keep waiting or let retry proceed
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (counter) clearInterval(counter);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="cold-start-toast" role="status" aria-live="polite">
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: '#38BDF8'
      }}>
        <Loader2 size={20} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <strong style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>Connecting to Cloud Backend</strong>
          <span style={{ fontSize: '0.7rem', color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>
            {secondsWaiting}s
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '2px 0 0', lineHeight: '1.4' }}>
          Free-tier cloud servers awaken in ~45 seconds on initial access. Thank you for your patience!
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          color: '#64748B',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px'
        }}
        title="Dismiss notice"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ColdStartBanner;
