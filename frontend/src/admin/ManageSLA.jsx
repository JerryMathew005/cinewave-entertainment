import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageSLA = () => {
  const [slaSettings, setSlaSettings] = useState(null);
  const [breachedBookings, setBreachedBookings] = useState([]);
  const [warningBookings, setWarningBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlaData = async () => {
    setLoading(true);
    try {
      const [settings, breached, warning] = await Promise.all([
        adminService.getSlaSettings(),
        bookingService.getAdminBookings({ slaStatus: 'SLA_BREACHED' }),
        bookingService.getAdminBookings({ slaStatus: 'SLA_WARNING' })
      ]);
      setSlaSettings(settings);
      setBreachedBookings(breached || []);
      setWarningBookings(warning || []);
    } catch (err) {
      console.error('Failed to load SLA data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaData();
    const interval = setInterval(fetchSlaData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#0A192F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={28} color="#0284C7" />
          SLA Compliance Engine (US-009)
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
          Automatic deadline tracking, breach detection scheduler, and priority escalations.
        </p>
      </div>

      {/* SLA Configuration Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0284C7' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>Configured SLA Duration</span>
          <strong style={{ fontSize: '1.5rem', color: '#0A192F' }}>
            {slaSettings?.defaultSlaMinutes || 30} Minutes
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'block', marginTop: '4px' }}>Standard customer guarantee</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #F59E0B' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>Warning Threshold</span>
          <strong style={{ fontSize: '1.5rem', color: '#0A192F' }}>
            10 Minutes
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#D97706', display: 'block', marginTop: '4px' }}>Automated alert threshold</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10B981' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>Background Scheduler</span>
          <strong style={{ fontSize: '1.5rem', color: '#10B981' }}>
            Active (Every 30s)
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginTop: '4px' }}>Automated Spring cron task</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #EF4444' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>Active Breaches</span>
          <strong style={{ fontSize: '1.5rem', color: '#EF4444' }}>
            {breachedBookings.length}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#DC2626', display: 'block', marginTop: '4px' }}>Requires immediate triage</span>
        </div>
      </div>

      {/* SLA Breached Queue Table */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#991B1B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} color="#EF4444" />
          High Priority SLA Breached Queue ({breachedBookings.length})
        </h2>

        {breachedBookings.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#10B981' }}>
            <CheckCircle size={32} style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ margin: 0, fontWeight: '600' }}>All clear! No booking requests are currently in SLA breach.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Movie</th>
                  <th>Assigned Team</th>
                  <th>Submitted At</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {breachedBookings.map((b) => (
                  <tr key={b.id} style={{ backgroundColor: '#FEF2F2' }}>
                    <td><strong style={{ color: '#EF4444' }}>{b.bookingReference}</strong></td>
                    <td>{b.show?.movieTitle}</td>
                    <td>{b.assignedTeam}</td>
                    <td>{new Date(b.slaStartTime).toLocaleTimeString()}</td>
                    <td style={{ color: '#EF4444', fontWeight: '700' }}>
                      {new Date(b.slaDeadline).toLocaleTimeString()}
                    </td>
                    <td><span className="badge badge-warning">{b.status}</span></td>
                    <td>
                      <Link to={`/admin/bookings`} className="btn btn-danger btn-sm">
                        Process Now <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Warning Queue */}
      <div>
        <h2 style={{ fontSize: '1.35rem', color: '#D97706', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="#F59E0B" />
          SLA Warning Queue (&lt; 10 Mins Remaining)
        </h2>

        {warningBookings.length === 0 ? (
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748B' }}>
            No bookings currently nearing SLA expiration.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Movie</th>
                  <th>Assigned Team</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {warningBookings.map((b) => (
                  <tr key={b.id}>
                    <td><strong>{b.bookingReference}</strong></td>
                    <td>{b.show?.movieTitle}</td>
                    <td>{b.assignedTeam}</td>
                    <td>{new Date(b.slaDeadline).toLocaleTimeString()}</td>
                    <td><span className="badge badge-warning">{b.status}</span></td>
                    <td>
                      <Link to={`/admin/bookings`} className="btn btn-primary btn-sm">
                        Prioritize
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default ManageSLA;
