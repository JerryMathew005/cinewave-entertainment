import React from 'react';
import { Bell, CheckCircle, AlertTriangle, XCircle, Info, Check } from 'lucide-react';

const Notification = ({ notification, onMarkRead }) => {
  if (!notification) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
        return <CheckCircle size={18} color="#10B981" />;
      case 'BOOKING_CANCELLED':
      case 'BOOKING_REJECTED':
        return <XCircle size={18} color="#EF4444" />;
      case 'SLA_ALERT':
        return <AlertTriangle size={18} color="#F59E0B" />;
      default:
        return <Info size={18} color="#0284C7" />;
    }
  };

  return (
    <div
      style={{
        backgroundColor: notification.isRead ? '#FFFFFF' : '#F0F9FF',
        border: '1px solid',
        borderColor: notification.isRead ? '#E2E8F0' : '#BAE6FD',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        transition: 'all 0.2s'
      }}
    >
      <div style={{
        backgroundColor: notification.isRead ? '#F1F5F9' : '#E0F2FE',
        padding: '0.5rem',
        borderRadius: '8px',
        flexShrink: 0
      }}>
        {getIcon(notification.notificationType)}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#0A192F', margin: 0 }}>
            {notification.title}
          </h4>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            {new Date(notification.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.25rem 0 0.5rem 0', lineHeight: '1.4' }}>
          {notification.message}
        </p>

        {!notification.isRead && onMarkRead && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              color: '#0284C7',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              padding: 0
            }}
          >
            <Check size={13} /> Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;
