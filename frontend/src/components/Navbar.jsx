import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Ticket, Bell, User, LogOut, Shield, Briefcase, Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnread = async () => {
        try {
          const count = await notificationService.getUnreadCount();
          setUnreadCount(count);
        } catch {
          // Ignore
        }
      };
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#0A192F',
      color: '#FFFFFF',
      borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)'
          }}>
            <Film size={24} color="#FFFFFF" />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #FFFFFF 0%, #BAE6FD 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CineWave
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#38BDF8', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '-4px', fontWeight: '600' }}>
              Entertainment
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-links">
          <Link to="/movies" style={{
            fontSize: '0.925rem',
            fontWeight: '500',
            color: isActive('/movies') ? '#38BDF8' : '#E2E8F0',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            Movies
          </Link>
          <Link to="/theatres" style={{
            fontSize: '0.925rem',
            fontWeight: '500',
            color: isActive('/theatres') ? '#38BDF8' : '#E2E8F0',
            transition: 'color 0.2s'
          }}>
            Theatres
          </Link>
          <Link to="/shows" style={{
            fontSize: '0.925rem',
            fontWeight: '500',
            color: isActive('/shows') ? '#38BDF8' : '#E2E8F0',
            transition: 'color 0.2s'
          }}>
            Showtimes
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/my-bookings" style={{
                fontSize: '0.925rem',
                fontWeight: '500',
                color: isActive('/my-bookings') ? '#38BDF8' : '#E2E8F0',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Ticket size={16} /> My Bookings
              </Link>
              <Link to="/wishlist" style={{
                fontSize: '0.925rem',
                fontWeight: '500',
                color: isActive('/wishlist') ? '#38BDF8' : '#E2E8F0',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Heart size={16} /> Wishlist
              </Link>
            </>
          )}

          {isStaff && (
            <Link to="/staff/dashboard" style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#38BDF8',
              backgroundColor: 'rgba(2, 132, 199, 0.15)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Briefcase size={14} /> Staff Portal
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#F59E0B',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Shield size={14} /> Admin
            </Link>
          )}
        </div>

        {/* Right Action Icons & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <Link to="/notifications" style={{
                position: 'relative',
                padding: '0.5rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}>
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #0A192F'
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(2, 132, 199, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#FFFFFF',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  <User size={16} color="#38BDF8" />
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '45px',
                    width: '210px',
                    backgroundColor: '#0F2744',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                    padding: '0.5rem',
                    zIndex: 110
                  }}>
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '0.25rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>{user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>{user?.email}</p>
                      <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#0284C7', color: '#FFFFFF' }}>
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#E2E8F0', borderRadius: '6px' }}
                    >
                      <User size={15} /> My Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#E2E8F0', borderRadius: '6px' }}
                    >
                      <Ticket size={15} /> Booking History
                    </Link>

                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.85rem',
                        color: '#EF4444',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit'
                      }}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ backgroundColor: 'transparent', color: '#E2E8F0', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: '#0F2744', padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/movies" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', padding: '0.5rem 0' }}>Movies</Link>
            <Link to="/theatres" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', padding: '0.5rem 0' }}>Theatres</Link>
            <Link to="/shows" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', padding: '0.5rem 0' }}>Showtimes</Link>
            {isAuthenticated && (
              <>
                <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', padding: '0.5rem 0' }}>My Bookings</Link>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', padding: '0.5rem 0' }}>Wishlist</Link>
                <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFFFFF', padding: '0.5rem 0' }}>Notifications ({unreadCount})</Link>
              </>
            )}
            {isStaff && <Link to="/staff/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#38BDF8', padding: '0.5rem 0' }}>Staff Dashboard</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#F59E0B', padding: '0.5rem 0' }}>Admin Dashboard</Link>}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
