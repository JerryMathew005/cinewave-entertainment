import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Shield,
  Ticket,
  Calendar,
  Edit3,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Profile modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // Change Password modal state
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState(null);

  // Fetch real profile dynamically from backend on mount
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getMyProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile', err);
      if (err.response && err.response.status === 401) {
        navigate('/login', { state: { from: { pathname: '/profile' } } });
        return;
      }
      // Fallback to auth context if offline
      if (authUser) {
        setProfile(authUser);
      } else {
        setError('Unable to load user profile. Please check your connection or sign in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Compute initials for avatar (e.g. "Jerry Mathew J" -> "JM")
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Open Edit Modal
  const handleOpenEdit = () => {
    if (profile) {
      setEditName(profile.name || '');
      setEditPhone(profile.phone || '');
      setEditError(null);
      setEditModalOpen(true);
    }
  };

  // Save Profile Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName || editName.trim().length < 2) {
      setEditError('Full Name must be at least 2 characters.');
      return;
    }

    setEditLoading(true);
    setEditError(null);
    try {
      const updated = await userService.updateProfile({
        name: editName.trim(),
        phone: editPhone ? editPhone.trim() : null
      });
      setProfile(updated);
      if (updateUser) updateUser(updated);
      setSuccessMsg('Your profile details have been successfully updated.');
      setEditModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update profile', err);
      setEditError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setEditLoading(false);
    }
  };

  // Open Change Password Modal
  const handleOpenChangePwd = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwdError(null);
    setPwdModalOpen(true);
  };

  // Save New Password
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New password and confirmation password do not match.');
      return;
    }

    setPwdLoading(true);
    setPwdError(null);
    try {
      await userService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      setSuccessMsg('Your password has been changed successfully.');
      setPwdModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to change password', err);
      setPwdError(err.response?.data?.message || 'Failed to change password. Please verify current password.');
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <Loader2 size={36} className="spinner" style={{ margin: '0 auto 1rem', color: '#0284C7', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#64748B' }}>Loading account profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '640px' }}>
        <ErrorMessage message={error} />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button onClick={fetchProfile} className="btn btn-primary">
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const userRole = profile?.role || authUser?.role || 'CUSTOMER';
  const isAdmin = userRole === 'ADMIN';
  const isStaff = userRole === 'STAFF';

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '720px' }}>
      
      {/* Success Notification Banner */}
      {successMsg && (
        <div style={{
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          color: '#065F46',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={20} color="#10B981" />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{successMsg}</span>
        </div>
      )}

      <div className="card" style={{ padding: '2.5rem' }}>
        
        {/* Profile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '1.75rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: isAdmin
              ? 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)'
              : isStaff
              ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)'
              : 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.85rem',
            fontWeight: '800',
            boxShadow: isAdmin
              ? '0 0 25px rgba(245, 158, 11, 0.45)'
              : '0 0 20px rgba(2, 132, 199, 0.4)',
            letterSpacing: '1px',
            flexShrink: 0
          }}>
            {getInitials(profile?.name)}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.85rem', color: '#0A192F', margin: 0, fontWeight: '800' }}>
                {profile?.name}
              </h1>
              <span className={`badge ${isAdmin ? 'badge-warning' : isStaff ? 'badge-info' : 'badge-primary'}`} style={{ fontSize: '0.75rem' }}>
                {userRole}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', color: '#64748B', fontSize: '0.85rem' }}>
              <span>Account ID: #{profile?.id}</span>
              <span>•</span>
              <span>Username: @{profile?.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Profile Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ backgroundColor: '#E0F2FE', padding: '8px', borderRadius: '8px', color: '#0284C7' }}>
              <Mail size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: '500' }}>Email Address</span>
              <strong style={{ fontSize: '0.95rem', color: '#0A192F' }}>{profile?.email}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ backgroundColor: '#E0F2FE', padding: '8px', borderRadius: '8px', color: '#0284C7' }}>
              <Phone size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: '500' }}>Phone Number</span>
              <strong style={{ fontSize: '0.95rem', color: profile?.phone ? '#0A192F' : '#94A3B8' }}>
                {profile?.phone || 'Not provided'}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ backgroundColor: isAdmin ? '#FEF3C7' : '#E0F2FE', padding: '8px', borderRadius: '8px', color: isAdmin ? '#D97706' : '#0284C7' }}>
              {isAdmin ? <ShieldAlert size={18} /> : isStaff ? <Briefcase size={18} /> : <Shield size={18} />}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: '500' }}>Access Privileges</span>
              <strong style={{ fontSize: '0.95rem', color: '#0A192F' }}>
                {isAdmin
                  ? 'Full System Administration'
                  : isStaff
                  ? 'Cinema Operations & Ticket Processing'
                  : 'Standard Customer Booking'}
              </strong>
            </div>
          </div>

          {profile?.createdAt && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ backgroundColor: '#E0F2FE', padding: '8px', borderRadius: '8px', color: '#0284C7' }}>
                <Calendar size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: '500' }}>Member Since</span>
                <strong style={{ fontSize: '0.95rem', color: '#0A192F' }}>
                  {new Date(profile.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </strong>
              </div>
            </div>
          )}

        </div>

        {/* Profile Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.875rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          borderTop: '1px solid #E2E8F0',
          paddingTop: '1.5rem'
        }}>
          
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleOpenEdit}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Edit3 size={15} /> Edit Profile
            </button>

            <button
              onClick={handleOpenChangePwd}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <KeyRound size={15} /> Change Password
            </button>
          </div>

          <div>
            {isAdmin ? (
              <Link
                to="/admin"
                className="btn btn-warning btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}
              >
                <Shield size={16} /> Go to Admin Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                to="/my-bookings"
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Ticket size={16} /> My Bookings
              </Link>
            )}
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Account Profile"
        maxWidth="480px"
      >
        <form onSubmit={handleSaveProfile}>
          {editError && <ErrorMessage message={editError} />}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Your Name"
              />
              <User size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="form-input"
                style={{ paddingLeft: '2.5rem', backgroundColor: '#F1F5F9', cursor: 'not-allowed', color: '#64748B' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
            </div>
            <span className="form-hint">Email address is permanently linked to your account.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="+1 (555) 019-2831"
              />
              <Phone size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editLoading}
              className="btn btn-primary"
            >
              {editLoading ? (
                <>
                  <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={pwdModalOpen}
        onClose={() => setPwdModalOpen(false)}
        title="Change Account Password"
        maxWidth="480px"
      >
        <form onSubmit={handleSavePassword}>
          {pwdError && <ErrorMessage message={pwdError} />}

          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter current password"
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="At least 6 characters"
              />
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Re-enter new password"
              />
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
            <button
              type="button"
              onClick={() => setPwdModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pwdLoading}
              className="btn btn-primary"
            >
              {pwdLoading ? (
                <>
                  <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  Updating Password...
                </>
              ) : (
                'Save New Password'
              )}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

// Helper icon component
const ShieldAlert = ({ size }) => <Shield size={size} color="#D97706" />;

export default Profile;
