import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, User, MessageSquare, Phone, MapPin, Shield, Loader2 } from 'lucide-react';
import contactService from '../services/contactService';
import ErrorMessage from '../components/ErrorMessage';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const adminEmail = 'jerrymathew987@gmail.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await contactService.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact submission error', err);
      setError(err.response?.data?.message || 'Failed to submit your message. Please try again or email directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '1080px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{
          fontSize: '0.8125rem',
          color: '#0284C7',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          backgroundColor: '#E0F2FE',
          padding: '4px 12px',
          borderRadius: '9999px',
          display: 'inline-block',
          marginBottom: '0.75rem'
        }}>
          Direct Assistance & Administration
        </span>
        <h1 style={{ fontSize: '2.5rem', color: '#0A192F', margin: '0 0 0.5rem' }}>
          Contact CineWave Administration
        </h1>
        <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          Have an inquiry, cinema partnership question, or need customer assistance? We are here to help.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        
        {/* Left: Contact Info & Administrator Box */}
        <div>
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', borderLeft: '4px solid #0284C7' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0A192F', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={20} color="#0284C7" /> Administrator Direct Contact
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              For official business, executive escalation, and system administration:
            </p>
            
            <a
              href={`mailto:${adminEmail}`}
              className="btn btn-secondary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#0284C7',
                fontWeight: '700',
                fontSize: '0.95rem',
                padding: '0.75rem'
              }}
            >
              <Mail size={16} /> {adminEmail}
            </a>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: '#0A192F', marginBottom: '1.25rem' }}>
              Cinema Support Channels
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ backgroundColor: '#E0F2FE', padding: '8px', borderRadius: '8px', color: '#0284C7' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <strong style={{ color: '#0A192F', display: 'block' }}>Customer Support Desk</strong>
                  <span style={{ color: '#64748B' }}>+1 (800) 555-WAVE (Mon-Sun, 8am-11pm)</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ backgroundColor: '#E0F2FE', padding: '8px', borderRadius: '8px', color: '#0284C7' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <strong style={{ color: '#0A192F', display: 'block' }}>Headquarters</strong>
                  <span style={{ color: '#64748B' }}>Cyber City Entertainment Hub, Downtown</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ backgroundColor: '#ECFDF5', padding: '8px', borderRadius: '8px', color: '#10B981' }}>
                  <Shield size={18} />
                </div>
                <div>
                  <strong style={{ color: '#0A192F', display: 'block' }}>Guaranteed SLA</strong>
                  <span style={{ color: '#64748B' }}>30-Minute case response standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="card" style={{ padding: '2.5rem 2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#0A192F', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={22} color="#0284C7" /> Send a Message
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            All messages are directly logged in the administration console.
          </p>

          {error && <ErrorMessage message={error} />}

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#0A192F', marginBottom: '0.5rem' }}>
                Message Sent Successfully!
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Thank you for contacting CineWave. Your inquiry has been routed to our administrator console.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn btn-secondary"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94A3B8' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Ticket Booking / Feedback / Inquiry"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your question or message in detail..."
                  className="form-textarea"
                />
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
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};

export default Contact;
