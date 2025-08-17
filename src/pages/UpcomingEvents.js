import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import UpcomingEventGrid from '../components/UpcomingEventGrid';
import './UpcomingEvents.css';
import { Link } from 'react-router-dom';
import axios from '../axios';

function UpcomingEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredUpcoming, setFilteredUpcoming] = useState([]);
  const [filteredPast, setFilteredPast] = useState([]);

  useEffect(() => {
    axios.get('/events/all')
      .then(response => {
        const now = new Date();

        const events = response.data.map(event => {
          const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
          return {
            id: event.id, // ✅ Add this line
            image: event.media_path
              ? `http://127.0.0.1:8000/storage/${event.media_path}`
              : '/default-image.jpg',
            title: event.name,
            university: event.university,
            eventDateTime: eventDateTime,
          };
        });


        const upcoming = events.filter(e => e.eventDateTime >= now);
        const past = events.filter(e => e.eventDateTime < now);

        setAllEvents(events);
        setFilteredUpcoming(upcoming);
        setFilteredPast(past);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const handleSearch = (query) => {
    const lower = query.toLowerCase();
    const upcoming = allEvents.filter(e =>
      e.eventDateTime >= new Date() &&
      e.title.toLowerCase().includes(lower)
    );
    const past = allEvents.filter(e =>
      e.eventDateTime < new Date() &&
      e.title.toLowerCase().includes(lower)
    );

    setFilteredUpcoming(upcoming);
    setFilteredPast(past);
  };

  return (
    <div className="upcoming-events">
      <div
        className="events-hero"
        style={{
          backgroundColor: '#F39D0C',   // solid color
          height: 140,                  // number = px
          display: 'flex',
          alignItems: 'left',
          justifyContent: 'left',
          color: '#fff',
        }}
      >
        <h1 className="events-heading"

          style={{
            fontFamily: 'Playfair Display',
            fontSize: '24px',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            textAlign: 'left',
          }}
        >
          UPCOMING EVENTS
        </h1>
      </div>

      <SearchBar onSearch={handleSearch} />

      <UpcomingEventGrid events={filteredUpcoming} />

      <div className="events-heropast">
        <h1>PAST EVENTS</h1>
      </div>

      <UpcomingEventGrid events={filteredPast} />

      <div className="view-past-wrapper">
        <Link to="/past-events">
          <button className="view-past-button">View All Past Events</button>
        </Link>
      </div>
    </div>
  );
}

export default UpcomingEvents;
