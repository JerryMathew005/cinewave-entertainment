import React, { useState, useEffect } from 'react';
import { Users, Shield, Edit2, Check } from 'lucide-react';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert('Failed to update user role: ' + (err.response?.data?.message || ''));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#0A192F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={28} color="#0284C7" />
          Manage System Users & Roles
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
          Manage registered user accounts and administrator privileges (Customer, Admin).
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching user accounts..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Account Role</th>
                <th>Modify Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><strong>#{u.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0A192F' }}>{u.name}</div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge ${
                      u.role === 'ADMIN' ? 'badge-warning' : 'badge-primary'
                    }`} style={{ fontWeight: '700' }}>
                      {u.role === 'ADMIN' ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td>
                    <select
                      value={u.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'}
                      disabled={updatingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="form-select"
                      style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8125rem' }}
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
