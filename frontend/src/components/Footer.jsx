import React from 'react';
import { Film, Heart, Shield, Award, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#061325',
      color: '#94A3B8',
      borderTop: '1px solid rgba(56, 189, 248, 0.12)',
      paddingTop: '3.5rem',
      paddingBottom: '2rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                padding: '0.4rem',
                borderRadius: '8px'
              }}>
                <Film size={20} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                CineWave
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Experience the magic of cinema with CineWave Entertainment. Seamless ticket booking, IMAX & Dolby sound, luxury recliner seating, and real-time show status.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38BDF8', fontSize: '0.8125rem', fontWeight: '600' }}>
              <Award size={16} /> Premium Movie Experience Guaranteed
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              Explore CineWave
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><Link to="/movies" style={{ transition: 'color 0.2s', ':hover': { color: '#38BDF8' } }}>Now Showing Movies</Link></li>
              <li><Link to="/movies?status=COMING_SOON">Upcoming Releases</Link></li>
              <li><Link to="/theatres">Cinema Theatres & Screens</Link></li>
              <li><Link to="/shows">Showtimes & Schedules</Link></li>
              <li><Link to="/my-bookings">Manage Bookings</Link></li>
            </ul>
          </div>

          {/* User Stories & Pega Specs */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              System Features
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><span style={{ color: '#E2E8F0' }}>US-001:</span> Ticket Request Submission</li>
              <li><span style={{ color: '#E2E8F0' }}>US-002:</span> Real-Time Seat Availability</li>
              <li><span style={{ color: '#E2E8F0' }}>US-003:</span> Tiered Cost Calculation</li>
              <li><span style={{ color: '#E2E8F0' }}>US-004:</span> Explicit Confirmation Flow</li>
              <li><span style={{ color: '#E2E8F0' }}>US-009:</span> 30-Min SLA Engine</li>
              <li><span style={{ color: '#E2E8F0' }}>US-010:</span> Show-Type Auto Routing</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              Support & Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#38BDF8" /> support@cinewave.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#38BDF8" /> +1 (800) 555-WAVE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#38BDF8" /> Cyber City Hub, Downtown
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: '#10B981', fontSize: '0.8125rem' }}>
                <Shield size={16} /> 256-Bit SSL Encrypted Booking
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.8125rem'
        }}>
          <div>
            © {new Date().getFullYear()} CineWave Entertainment. All rights reserved. Movie Ticket Booking Management System.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>SLA Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
