import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Mail, KeyRound, Lock, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Clock } from 'lucide-react';
import api from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Steps: 1 = Enter Email, 2 = Enter OTP, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // 10-minute timer for OTP
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccessMsg(res.data.message || 'Verification code sent.');
      setStep(2);
      setTimeLeft(600);
      setTimerActive(true);
    } catch (err) {
      console.error('Request OTP error', err);
      setError(err.response?.data?.message || 'Unable to process reset request. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setStep(3);
    } catch (err) {
      console.error('Verify OTP error', err);
      setError(err.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
        confirmPassword
      });
      setStep(4);
      setTimeout(() => {
        navigate('/login');
      }, 3500);
    } catch (err) {
      console.error('Reset password error', err);
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
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
      <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '2.5rem 2rem' }}>

        {/* Brand Header */}
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
            <KeyRound size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#0A192F', margin: 0 }}>Password Recovery</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '4px' }}>
            {step === 1 && 'Enter your email to receive a 6-digit verification code'}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && 'Create a new secure password for your account'}
            {step === 4 && 'Password successfully updated!'}
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label className="form-label">Registered Email Address</label>
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

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  Sending Code...
                </>
              ) : (
                'Send Verification Code'
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{
              backgroundColor: '#F0F9FF',
              border: '1px solid #BAE6FD',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369A1', fontSize: '0.85rem' }}>
                <Clock size={16} />
                <span>Code Expires In:</span>
              </div>
              <strong style={{
                fontSize: '1rem',
                color: timeLeft < 60 ? '#EF4444' : '#0284C7',
                fontFamily: 'monospace'
              }}>
                {formatTime(timeLeft)}
              </strong>
            </div>

            <div className="form-group">
              <label className="form-label">6-Digit Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="form-input"
                style={{
                  fontSize: '1.5rem',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  fontWeight: '700',
                  padding: '0.5rem'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || timeLeft === 0}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  Verifying...
                </>
              ) : (
                'Confirm Code'
              )}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', fontSize: '0.8125rem' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary btn-sm"
              >
                Change Email
              </button>
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading || timeLeft > 540}
                className="btn btn-secondary btn-sm"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Enter New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
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
                  placeholder="Re-enter new password"
                  className={`form-input ${passwordsMismatch ? 'is-invalid' : ''}`}
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
            </div>

            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  Saving Password...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#0A192F', marginBottom: '0.5rem' }}>
              Password Reset Complete!
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Your account password has been updated securely. Redirecting you to the sign in page in a moment...
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Proceed to Sign In
            </Link>
          </div>
        )}

        {/* Return to Login link */}
        {step !== 4 && (
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem' }}>
            <Link to="/login" style={{ color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={15} /> Back to Sign In
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
