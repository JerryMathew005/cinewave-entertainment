import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Building,
  Tv,
  Calendar,
  Ticket,
  Users,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Tag,
  Clock,
  Shuffle,
  MessageSquare
} from 'lucide-react';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load admin analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner text="Loading admin operations dashboard..." />;

  const kpis = [
    { label: 'Total Revenue', value: `₹${Number(analytics?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: '#0284C7', bg: '#E0F2FE' },
    { label: 'Total Bookings', value: analytics?.totalBookings || 0, icon: Ticket, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Confirmed Passes', value: analytics?.confirmedBookings || 0, icon: TrendingUp, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'SLA Breaches', value: analytics?.slaBreaches || 0, icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2' },
    { label: 'Active Movies', value: analytics?.totalMovies || 0, icon: Film, color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Cinema Theatres', value: analytics?.totalTheatres || 0, icon: Building, color: '#F59E0B', bg: '#FFFBEB' },
  ];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', color: '#0A192F', margin: 0 }}>
            Operations & Admin Console
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
            Manage movie schedules, customer cases, SLA compliance, and auto-routing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/bookings" className="btn btn-primary btn-sm">
            <Ticket size={15} /> Process Bookings (US-007)
          </Link>
          <Link to="/admin/analytics" className="btn btn-secondary btn-sm">
            <TrendingUp size={15} /> Full Analytics
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: kpi.bg,
                color: kpi.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>
                  {kpi.label}
                </span>
                <strong style={{ fontSize: '1.5rem', color: '#0A192F' }}>
                  {kpi.value}
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation Management Tiles */}
      <h2 style={{ fontSize: '1.4rem', color: '#0A192F', marginBottom: '1.25rem' }}>
        System Management Modules
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        
        <Link to="/admin/bookings" className="card card-clickable" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: '#E0F2FE', color: '#0284C7', padding: '0.75rem', borderRadius: '10px' }}>
            <Ticket size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Manage Bookings</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              US-006 & US-007: Review requests, approve or reject tickets, view Pega audit log.
            </p>
          </div>
        </Link>

        <Link to="/admin/movies" className="card card-clickable" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: '#F5F3FF', color: '#8B5CF6', padding: '0.75rem', borderRadius: '10px' }}>
            <Film size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Manage Movies</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              Add new films, update release dates, change status (Now Showing / Coming Soon).
            </p>
          </div>
        </Link>

        <Link to="/admin/theatres" className="card card-clickable" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: '#FFFBEB', color: '#F59E0B', padding: '0.75rem', borderRadius: '10px' }}>
            <Building size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Manage Theatres</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              Configure cinema branches, cities, screens (IMAX, Dolby Atmos), and auditoriums.
            </p>
          </div>
        </Link>

        <Link to="/admin/shows" className="card card-clickable" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: '#EFF6FF', color: '#3B82F6', padding: '0.75rem', borderRadius: '10px' }}>
            <Calendar size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Manage Showtimes</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              Schedule movie slots, assign screen formats, configure base seat ticket pricing.
            </p>
          </div>
        </Link>

        <Link to="/admin/sla" className="card card-clickable" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: '#FEF2F2', color: '#EF4444', padding: '0.75rem', borderRadius: '10px' }}>
            <Clock size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>SLA Monitoring (US-009)</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              Monitor 30-min SLA breaches, warning alerts, and automated task scheduler metrics.
            </p>
          </div>
        </Link>

        <Link to="/admin/routing" className="card card-clickable" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: '#ECFDF5', color: '#10B981', padding: '0.75rem', borderRadius: '10px' }}>
            <Shuffle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Auto-Routing (US-010)</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              Map show types (IMAX, 3D, Premium) to specialized operations response queues.
            </p>
          </div>
        </Link>

        <Link to="/admin/coupons" className="card card-clickable" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: '#FDF4FF', color: '#D946EF', padding: '0.75rem', borderRadius: '10px' }}>
            <Tag size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Manage Coupons</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              Create discount promo codes, configure percentage/fixed cuts, usage caps.
            </p>
          </div>
        </Link>

        <Link to="/admin/users" className="card card-clickable" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: '#F0FDF4', color: '#16A34A', padding: '0.75rem', borderRadius: '10px' }}>
            <Users size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Manage Users</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              View registered users, manage Customer accounts and Admin privileges.
            </p>
          </div>
        </Link>

        <Link to="/admin/messages" className="card card-clickable" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: '#E0F2FE', color: '#0284C7', padding: '0.75rem', borderRadius: '10px' }}>
            <MessageSquare size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Contact Inquiries</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              Review messages sent through the Contact Us form and send direct email replies.
            </p>
          </div>
        </Link>

      </div>

    </div>
  );
};

export default AdminDashboard;
