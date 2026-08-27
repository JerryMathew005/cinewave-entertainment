import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Ticket, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '640px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.75rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#0284C7',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: '800',
            boxShadow: '0 0 20px rgba(2, 132, 199, 0.4)'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <h1 style={{ fontSize: '1.75rem', color: '#0A192F', margin: 0 }}>
              {user.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span className="badge badge-primary">
                {user.role}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Account ID: #{user.id}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Info Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <Mail size={18} color="#0284C7" />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Email Address</span>
              <strong style={{ fontSize: '0.95rem', color: '#0A192F' }}>{user.email}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <Phone size={18} color="#0284C7" />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Phone Number</span>
              <strong style={{ fontSize: '0.95rem', color: '#0A192F' }}>{user.phone || 'Not provided'}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <Shield size={18} color="#0284C7" />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Access Privileges</span>
              <strong style={{ fontSize: '0.95rem', color: '#0A192F' }}>
                {user.role === 'ADMIN' ? 'Full System Administration' : user.role === 'STAFF' ? 'Ticket Processing & Operations' : 'Standard Customer Booking'}
              </strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Link to="/my-bookings" className="btn btn-primary">
            <Ticket size={16} /> View My Bookings
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Profile;
