import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, CheckCircle2, ArrowLeft, Loader2, Send } from 'lucide-react';
import api from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

const ForgotPassword = () => {
  // State: 1 = Enter Email Form, 2 = Check Email Confirmation Screen
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState('');

  const handleRequestResetLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      setInfoMessage(
        res.data?.message ||
        `If that email is registered with CineWave Entertainment, a password reset link has been dispatched to your inbox.`
      );
      setStep(2);
    } catch (err) {
      console.error('Request reset link error', err);
      setError(
        err.response?.data?.message ||
        'Unable to process password reset request. Please check your network connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem'
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '2.5rem 2rem' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              color: '#FFFFFF',
              boxShadow: '0 0 18px rgba(56, 189, 248, 0.45)'
            }}
          >
            {step === 1 ? <KeyRound size={26} /> : <Mail size={26} />}
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#0A192F', margin: 0, fontWeight: '800' }}>
            {step === 1 ? 'Forgot Password' : 'Check Your Email'}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '6px', lineHeight: '1.5' }}>
            {step === 1
              ? 'Enter your registered email address to receive a secure password reset link.'
              : `We have sent a password reset link to your registered email address.`}
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* STEP 1: Enter Email & Request Link */}
        {step === 1 && (
          <form onSubmit={handleRequestResetLink}>
            <div className="form-group">
              <label className="form-label">Registered Account Email</label>
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
              <span className="form-hint">
                Enter the email associated with your CineWave account (Customer or Staff).
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Send size={16} /> Send Password Reset Link
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
              <Link
                to="/login"
                style={{ color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <ArrowLeft size={15} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: Instructions to check inbox */}
        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                backgroundColor: '#F0F9FF',
                border: '1px solid #BAE6FD',
                borderRadius: '10px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={20} color="#0284C7" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#0369A1', fontWeight: '700' }}>
                    Reset Link Dispatched
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                    A secure password reset link has been sent to <strong>{email}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Please check your email inbox and click the <strong>Reset Password</strong> button or link to choose your new password.
              The link is single-use and valid for <strong>15 minutes</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Return to Sign In
              </Link>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError(null);
                }}
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                Didn't receive the email? Try again
              </button>
            </div>

            <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '1.25rem' }}>
              Tip: Check your spam or promotions folder if the email does not appear in your inbox within a couple of minutes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
