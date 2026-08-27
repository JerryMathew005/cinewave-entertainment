import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Lock, Mail, User, Shield, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem' }}>
        
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
            <Film size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#0A192F', margin: 0 }}>Welcome Back</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '4px' }}>
            Sign in to manage bookings and tickets
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Demo Quick-Fill Buttons */}
        <div style={{
          backgroundColor: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: '10px',
          padding: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#0369A1', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
            ⚡ Quick Demo Accounts:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => fillDemo('customer@cinewave.com', 'Customer@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.7rem', padding: '4px 6px', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <User size={12} /> Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemo('staff@cinewave.com', 'Staff@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.7rem', padding: '4px 6px', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <Briefcase size={12} /> Staff
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@cinewave.com', 'Admin@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.7rem', padding: '4px 6px', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <Shield size={12} /> Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
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
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748B' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#0284C7', fontWeight: '600' }}>
            Register Now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
