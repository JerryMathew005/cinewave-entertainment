import React, { useState, useEffect } from 'react';
import { TrendingUp, Film, Building, DollarSign, Users, Award } from 'lucide-react';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner text="Compiling financial & booking analytics..." />;

  const statusMap = analytics?.statusDistribution || {};
  const popularMovies = analytics?.popularMovies || [];
  const monthlyData = analytics?.monthlyBookings || [];
  const theatreOccupancy = analytics?.theatreOccupancy || [];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#0A192F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={28} color="#0284C7" />
          Cinema Analytics & Revenue Insights
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
          Performance metrics, popular releases, case volume distributions, and auditorium yields.
        </p>
      </div>

      {/* Top Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #0284C7' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', display: 'block' }}>Gross Revenue</span>
          <strong style={{ fontSize: '1.75rem', color: '#0284C7' }}>
            ₹{Number(analytics?.totalRevenue || 0).toLocaleString()}
          </strong>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', display: 'block' }}>Total Bookings Created</span>
          <strong style={{ fontSize: '1.75rem', color: '#10B981' }}>
            {analytics?.totalBookings || 0}
          </strong>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3B82F6' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', display: 'block' }}>Confirmed Tickets</span>
          <strong style={{ fontSize: '1.75rem', color: '#3B82F6' }}>
            {analytics?.confirmedBookings || 0}
          </strong>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #F59E0B' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', display: 'block' }}>Total Registered Patrons</span>
          <strong style={{ fontSize: '1.75rem', color: '#F59E0B' }}>
            {analytics?.totalUsers || 0}
          </strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Popular Movies Chart */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Film size={18} color="#0284C7" /> Most Booked Blockbusters
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {popularMovies.slice(0, 5).map((m, idx) => {
              const maxCount = Math.max(...popularMovies.map((x) => x.bookingsCount || 1), 1);
              const percentage = Math.round(((m.bookingsCount || 0) / maxCount) * 100);

              return (
                <div key={m.movieId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', color: '#0A192F' }}>
                      #{idx + 1} {m.title}
                    </span>
                    <span style={{ color: '#0284C7', fontWeight: '700' }}>
                      {m.bookingsCount} Bookings
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #0284C7 0%, #38BDF8 100%)', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#0284C7" /> Case Lifecycle Status Yield
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.keys(statusMap).map((key) => {
              const count = statusMap[key];
              const total = analytics?.totalBookings || 1;
              const percent = Math.round((count / total) * 100);

              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                    <span style={{ color: '#475569', fontWeight: '500' }}>{key}</span>
                    <span style={{ fontWeight: '700', color: '#0A192F' }}>
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', backgroundColor: key === 'CONFIRMED' ? '#10B981' : key === 'PENDING' ? '#F59E0B' : key === 'CANCELLED' ? '#EF4444' : '#3B82F6', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Theatre Occupancy Yield */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building size={18} color="#0284C7" /> Cinema Locations Performance
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {theatreOccupancy.map((t, idx) => (
            <div key={idx} style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <strong style={{ fontSize: '1rem', color: '#0A192F', display: 'block' }}>{t.theatreName}</strong>
              <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginBottom: '0.75rem' }}>{t.city}</span>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0284C7' }}>
                {t.bookingCount} Bookings
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Analytics;
