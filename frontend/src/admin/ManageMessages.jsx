import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Check, CheckCheck, Eye, Search, Reply, Calendar, Clock } from 'lucide-react';
import contactService from '../services/contactService';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState('ALL'); // 'ALL', 'UNREAD', 'READ'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await contactService.getAllMessages();
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to load contact messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id, currentRead) => {
    try {
      const updated = await contactService.markReadStatus(id, !currentRead);
      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(updated);
      }
    } catch (err) {
      console.error('Failed to toggle read status', err);
    }
  };

  const handleView = async (msg) => {
    setSelectedMessage(msg);
    setModalOpen(true);
    if (!msg.isRead) {
      handleToggleRead(msg.id, false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterRead === 'UNREAD') return !m.isRead;
    if (filterRead === 'READ') return m.isRead;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', color: '#0A192F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageSquare size={28} color="#0284C7" />
            Contact Messages & Inquiries
            {unreadCount > 0 && (
              <span className="badge badge-danger" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
            Review and respond to messages submitted through the public Contact Us form.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.875rem' }}
          >
            <option value="ALL">All Inquiries ({messages.length})</option>
            <option value="UNREAD">Unread Only ({unreadCount})</option>
            <option value="READ">Read ({messages.length - unreadCount})</option>
          </select>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search by sender name, email, subject, or message keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
        />
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94A3B8' }} />
      </div>

      {/* Message List */}
      {loading ? (
        <LoadingSpinner text="Fetching contact inquiries..." />
      ) : filteredMessages.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748B' }}>
          <Mail size={40} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#0A192F', fontSize: '1.15rem', marginBottom: '0.25rem' }}>No Messages Found</h3>
          <p style={{ fontSize: '0.875rem' }}>
            {searchTerm ? 'No inquiries matched your search criteria.' : 'No contact inquiries have been submitted yet.'}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Status</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Date Received</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => (
                <tr
                  key={msg.id}
                  style={{
                    backgroundColor: msg.isRead ? 'transparent' : 'rgba(2, 132, 199, 0.04)',
                    fontWeight: msg.isRead ? 'normal' : '600'
                  }}
                >
                  <td>
                    <span className={`badge ${msg.isRead ? 'badge-success' : 'badge-danger'}`}>
                      {msg.isRead ? 'Read' : 'New'}
                    </span>
                  </td>
                  <td>
                    <div style={{ color: '#0A192F' }}>{msg.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 'normal' }}>
                      {msg.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ color: '#0A192F' }}>{msg.subject}</div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748B',
                      maxWidth: '360px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: 'normal'
                    }}>
                      {msg.message}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 'normal' }}>
                    {new Date(msg.createdAt).toLocaleString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleView(msg)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                        title="Read Full Inquiry"
                      >
                        <Eye size={14} /> View
                      </button>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 8px' }}
                        title="Reply via Email"
                      >
                        <Reply size={14} /> Reply
                      </a>
                      <button
                        onClick={() => handleToggleRead(msg.id, msg.isRead)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                        title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        {msg.isRead ? <CheckCheck size={14} color="#10B981" /> : <Check size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Full Message View Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Contact Inquiry Details"
        maxWidth="640px"
      >
        {selectedMessage && (
          <div>
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.1rem', color: '#0A192F' }}>
                  {selectedMessage.subject}
                </strong>
                <span className={`badge ${selectedMessage.isRead ? 'badge-success' : 'badge-danger'}`}>
                  {selectedMessage.isRead ? 'Read' : 'New'}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>
                  <strong style={{ color: '#475569' }}>From:</strong> {selectedMessage.name} &lt;
                  <a href={`mailto:${selectedMessage.email}`} style={{ color: '#0284C7' }}>{selectedMessage.email}</a>&gt;
                </div>
                <div>
                  <strong style={{ color: '#475569' }}>Received:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Message Body:</label>
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1rem',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                color: '#1E293B',
                whiteSpace: 'pre-wrap',
                minHeight: '120px'
              }}>
                {selectedMessage.message}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.isRead)}
                className="btn btn-secondary"
              >
                {selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="btn btn-primary"
              >
                <Reply size={16} /> Reply to {selectedMessage.name}
              </a>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default ManageMessages;
