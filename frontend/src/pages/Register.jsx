import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, Mail, Lock, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password, confirmPassword, phone, role });
      navigate('/');
    } catch (err) {
      console.error('Registration error', err);
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem 2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#FFFFFF',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
          }}>
            <Film size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#0A192F', margin: 0 }}>Create Account</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '4px' }}>
            Join CineWave Entertainment for instant movie booking
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jerry Mathew"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2831"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Phone size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={`form-input ${password && !isPasswordValid ? 'is-invalid' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
            </div>
            {password && !isPasswordValid && (
              <span className="invalid-feedback">Password must be at least 6 characters long.</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className={`form-input ${passwordsMismatch ? 'is-invalid' : passwordsMatch ? 'is-valid' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
              {passwordsMatch && (
                <CheckCircle2 size={16} style={{ position: 'absolute', right: '12px', top: '13px', color: '#10B981' }} />
              )}
              {passwordsMismatch && (
                <AlertCircle size={16} style={{ position: 'absolute', right: '12px', top: '13px', color: '#EF4444' }} />
              )}
            </div>
            {passwordsMismatch && (
              <span className="invalid-feedback">Passwords do not match.</span>
            )}
            {passwordsMatch && (
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#10B981', marginTop: '0.25rem', fontWeight: '500' }}>
                Passwords match perfectly.
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
            >
              <option value="CUSTOMER">Customer (Movie Booking)</option>
              <option value="STAFF">Staff (Operations & Ticket Processing)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || (confirmPassword && !passwordsMatch)}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                Creating Account...
              </>
            ) : (
              'Register Account'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748B' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0284C7', fontWeight: '600' }}>
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
