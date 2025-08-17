import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './MyEvents.css';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
      

        {loading ? (
          <p>Loading your events...</p>
        ) : events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="my-event-grid">
            {events.map(event => (
              <div key={event.id} className="my-event-card">
                <h4>{event.name}</h4>
                {event.image_url && <img src={event.image_url} alt={event.name} />}
                <p><strong>University:</strong> {event.university}</p>
                <p><strong>Date:</strong> {event.date} | <strong>Time:</strong> {event.time}</p>
                <p><strong>Status:</strong> {event.status}</p>
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
