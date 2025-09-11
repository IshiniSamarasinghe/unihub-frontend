// src/pages/MyEvents.js (updated)
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './MyEvents.css';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // NEW: UI filter state (all/approved/pending/rejected)
  const [filter, setFilter] = useState('all');

  // ✅ Check if user is a super user based on user_type
  const isSuperUser = (user) => user?.user_type === 'super_user';

  // ✅ Get current logged-in user
  const fetchUser = async () => {
    try {
      const res = await axios.get('/user');
      setUser(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
      alert("⚠️ You must be logged in to access this page.");
    }
  };

  // ✅ Get events created by current user
  const fetchMyEvents = async () => {
    try {
      const res = await axios.get('/events/mine');
      setEvents(res.data);
    } catch (err) {
      console.error('❌ Failed to load events:', err);
      alert('Error loading your events.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete event by ID
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`/events/${id}`);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (err) {
      console.error('❌ Delete failed:', err);
      alert('Failed to delete event.');
    }
  };

  // 🔹 Map status -> badge styles (kept inline to avoid touching your CSS too much)
  const statusBadgeStyle = (status) => {
    const s = String(status || '').toLowerCase();
    const base = {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.02em',
    };
    if (s === 'approved') return { ...base, background: '#e7f7ed', color: '#137a3a', border: '1px solid #bfe8cf' };
    if (s === 'pending')  return { ...base, background: '#fff6e6', color: '#8b5b00', border: '1px solid #ffe0a8' };
    if (s === 'rejected') return { ...base, background: '#fde8e8', color: '#9b1c1c', border: '1px solid #f7baba' };
    return { ...base, background: '#eef2f7', color: '#334155', border: '1px solid #d5dbe3' }; // fallback/unknown
  };

  // 🔹 Simple client-side filter (no backend changes)
  const filteredEvents = events.filter(ev => {
    if (filter === 'all') return true;
    return String(ev.status || '').toLowerCase() === filter;
  });

  // ✅ Load user + events on page load
  useEffect(() => {
    fetchUser().then(() => fetchMyEvents());
  }, []);

  // 🔐 Access control and rendering
  if (!user) {
    return (
      <>
        {/* Yellow title bar */}
        <div
          style={{
            backgroundColor: '#F39D0C',
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, width: '100%', paddingLeft: '3rem' }}>
            MY EVENTS
          </h1>
        </div>

        <div className="my-events-container"><p>🔒 Checking access...</p></div>
      </>
    );
  }

  if (!isSuperUser(user)) {
    return (
      <>
        {/* Yellow title bar */}
        <div
          style={{
            backgroundColor: '#F39D0C',
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, width: '100%', paddingLeft: '3rem' }}>
            MY EVENTS
          </h1>
        </div>

        <div className="my-events-container">
          <h2 className="my-events-heading">📌 My Events</h2>
          <p>🚫 Access Denied. This section is only for super users.</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Yellow title bar */}
      <div
        style={{
          backgroundColor: '#F39D0C',
          height: 140,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, width: '100%', paddingLeft: '3rem' }}>
          MY EVENTS
        </h1>
      </div>

      <div className="my-events-container">
        {/* NEW: Status Filter Tabs */}
        <div className="my-events-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['all', 'approved', 'pending', 'rejected'].map(key => (
            <button
              key={key}
              type="button"
              className={`my-events-tab ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
              style={{
                border: '1px solid #ddd',
                background: filter === key ? '#111827' : '#fff',
                color: filter === key ? '#fff' : '#111827',
                padding: '0.4rem 0.8rem',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {key === 'all' ? 'All' : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {/* Count helper */}
        <div style={{ marginBottom: '0.5rem', fontSize: 14, color: '#374151' }}>
          Showing <strong>{filteredEvents.length}</strong> of {events.length}
        </div>

        {loading ? (
          <p>Loading your events...</p>
        ) : filteredEvents.length === 0 ? (
          <p>No events found{filter !== 'all' ? ` for "${filter}"` : ''}.</p>
        ) : (
          <div className="my-event-grid">
            {filteredEvents.map(event => (
              <div key={event.id} className="my-event-card">
                <div className="my-event-card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                  <h4 style={{ margin: 0 }}>{event.name}</h4>

                  {/* NEW: Status badge */}
                  <span style={statusBadgeStyle(event.status)}>
                    {(event.status || 'Unknown').toString().toUpperCase()}
                  </span>
                </div>

                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.name}
                    style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginTop: 8 }}
                  />
                )}

                <p style={{ marginTop: 8 }}>
                  <strong>University:</strong> {event.university}
                </p>
                <p>
                  <strong>Date:</strong> {event.date} &nbsp;|&nbsp; <strong>Time:</strong> {event.time}
                </p>

                {/* Keep your existing actions */}
                <div className="my-event-actions">
                  <button className="delete-btn" onClick={() => handleDelete(event.id)}>🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyEvents;
