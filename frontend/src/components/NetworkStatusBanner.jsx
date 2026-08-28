import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const NetworkStatusBanner = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowRestoredNotice(true);
        const timer = setTimeout(() => {
          setShowRestoredNotice(false);
          setWasOffline(false);
        }, 4000);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowRestoredNotice(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  const handleManualRetry = async () => {
    setRetrying(true);
    try {
      // Test connectivity against backend health check or navigator
      if (navigator.onLine) {
        await api.get('/health').catch(() => {});
        setIsOnline(true);
        setShowRestoredNotice(true);
        setTimeout(() => {
          setShowRestoredNotice(false);
          setWasOffline(false);
        }, 4000);
      }
    } finally {
      setRetrying(false);
    }
  };

  if (isOnline && !showRestoredNotice) {
    return null;
  }

  // Restored notice (Connection back online)
  if (showRestoredNotice) {
    return (
      <aside
        className="network-status-banner network-online"
        role="status"
        aria-live="polite"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: '#065F46',
          color: '#ECFDF5',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.35)',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: '0.875rem',
          fontWeight: '600',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <CheckCircle2 size={18} color="#34D399" />
        <span>Internet connection restored! You are back online.</span>
      </aside>
    );
  }

  // Offline notice (Connection interrupted)
  return (
    <aside
      className="network-status-banner network-offline"
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#991B1B',
        color: '#FFFFFF',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)',
        padding: '0.65rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.875rem',
        fontWeight: '600',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <WifiOff size={18} color="#FCA5A5" style={{ animation: 'pulse 1.5s infinite' }} />
        <span>No internet connection. Please check your network and try again.</span>
      </div>

      <button
        type="button"
        onClick={handleManualRetry}
        disabled={retrying}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '6px',
          color: '#FFFFFF',
          padding: '4px 12px',
          fontSize: '0.775rem',
          fontWeight: '700',
          cursor: retrying ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <RefreshCw size={13} className={retrying ? 'spinner' : ''} />
        {retrying ? 'Checking...' : 'Retry Connection'}
      </button>
    </aside>
  );
};

export default NetworkStatusBanner;
