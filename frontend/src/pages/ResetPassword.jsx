import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Film
} from 'lucide-react';
import api from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlToken = searchParams.get('token') || '';
  const urlEmail = searchParams.get('email') || '';

  const [token, setToken] = useState(urlToken);
  const [email, setEmail] = useState(urlEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [validatingToken, setValidatingToken] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Validate token from URL on mount
  useEffect(() => {
    if (urlToken) {
      const verifyToken = async () => {
        setValidatingToken(true);
        setError(null);
        try {
          const res = await api.get('/auth/verify-reset-token', {
            params: {
              token: urlToken,
              ...(urlEmail ? { email: urlEmail } : {})
            }
          });
          setTokenVerified(true);
          if (res.data?.email && !email) {
            setEmail(res.data.email);
          }
        } catch (err) {
          console.error('Token verification error', err);
          setError(
            err.response?.data?.message ||
            'This password reset link is invalid, expired, or has already been used. Please request a new link.'
          );
          setTokenVerified(false);
        } finally {
          setValidatingToken(false);
        }
      };
      verifyToken();
    }
  }, [urlToken, urlEmail]);

  // Countdown timer for automatic redirect upon success
  useEffect(() => {
    let timer = null;
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate('/login', {
        state: { message: 'Password updated successfully! Please log in with your new credentials.' }
      });
    }
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const activeToken = token.trim();
    if (!activeToken) {
      setError('Please provide your secure reset token or 6-digit verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email: email.trim() || undefined,
        token: activeToken,
        otp: activeToken,
        newPassword,
        confirmPassword
      });
      setSuccess(true);
    } catch (err) {
      console.error('Reset password submission error', err);
      setError(err.response?.data?.message || 'Failed to reset password. Please verify the reset link or code.');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword && newPassword !== confirmPassword;

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem 2rem' }}>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#FFFFFF',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.45)'
          }}>
            <KeyRound size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#0A192F', margin: 0, fontWeight: '800' }}>
            Set New Password
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '6px' }}>
            {email ? `Updating credentials for ${email}` : 'Enter your reset token and choose a new secure password'}
          </p>
        </div>

        {/* Validating token loader */}
        {validatingToken && (
          <div style={{
            padding: '1.25rem',
            textAlign: 'center',
            backgroundColor: '#F0F9FF',
            borderRadius: '10px',
            border: '1px solid #BAE6FD',
            marginBottom: '1.5rem',
            color: '#0369A1'
          }}>
            <Loader2 size={24} className="spinner" style={{ margin: '0 auto 8px', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Verifying your secure password reset link...</span>
          </div>
        )}

        {/* Token Verified Banner */}
        {tokenVerified && !success && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#ECFDF5',
            borderRadius: '8px',
            border: '1px solid #A7F3D0',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#065F46',
            fontSize: '0.85rem'
          }}>
            <ShieldCheck size={18} color="#10B981" />
            <span>Reset link verified! Please enter your new password below.</span>
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {/* Success Screen */}
        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              border: '2px solid #A7F3D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: '#10B981'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.35rem', color: '#0A192F', marginBottom: '0.5rem' }}>
              Password Reset Complete!
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Your password has been securely updated using BCrypt encryption. Your reset link is now single-use completed.
            </p>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              color: '#0284C7',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              fontWeight: '500'
            }}>
              Redirecting to login in <strong>{countdown}</strong> seconds...
            </div>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* If token was not passed in URL, allow typing/pasting it */}
            {!urlToken && (
              <>
                <div className="form-group">
                  <label className="form-label">Registered Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reset Token from Email Link</label>
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste secure token from your reset email"
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                  <span className="form-hint">Paste the secure token provided in your reset email link.</span>
                </div>
              </>
            )}

            {/* New Password */}
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: 0
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="form-input"
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    borderColor: passwordsMatch ? '#10B981' : passwordsMismatch ? '#EF4444' : undefined
                  }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: 0
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordsMatch && (
                <span style={{ color: '#10B981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <CheckCircle2 size={13} /> Passwords match
                </span>
              )}
              {passwordsMismatch && (
                <span style={{ color: '#EF4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <AlertCircle size={13} /> Passwords do not match
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || validatingToken || !newPassword || !confirmPassword || passwordsMismatch}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  Securing Password...
                </>
              ) : (
                'Confirm & Update Password'
              )}
            </button>
          </form>
        )}

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#64748B',
              fontSize: '0.875rem',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
