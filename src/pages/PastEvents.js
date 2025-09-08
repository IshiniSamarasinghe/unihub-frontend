import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import PastEventGrid from '../components/PastEventGrid';
import UpcomingEventSlider from '../components/UpcomingEventSlider';
import './PastEvents.css';
import axios from '../axios';

function PastEvents() {
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    axios.get('/events/all')
      .then(res => {
        const now = new Date();
        const expired = res.data.filter(event => {
          const eventDateTime = new Date(`${event.date}T${event.time}`);
          return eventDateTime < now;
        });

        const formatted = expired.map(event => ({
          id: event.id, // ✅ include event ID
          image: event.media_path
            ? `http://127.0.0.1:8000/storage/${event.media_path}`
            : '/react/assets/events/default.jpg',
          title: event.name,
          university: event.university,
        }));


        setPastEvents(formatted);
      })
      .catch(err => {
        console.error('❌ Failed to fetch past events:', err);
      });
  }, []);

  return (
    <div className="past-events">
      <div
        className="events-hero"
        style={{
          backgroundColor: '#F39D0C',   // solid color
          height: 120,                  // number = px
          display: 'flex',
          alignItems: 'left',
          justifyContent: 'left',
          color: '#fff',
        }}
      >
        <h1 style={{
          fontFamily: 'Playfair Display',
          fontSize: '24px',
          padding: '0.5rem 1rem',
          borderRadius: '5px'
        }}>
          PAST EVENTS
        </h1>
      </div>

      <SearchBar />
      <PastEventGrid events={pastEvents} />
      <div className="pagination-wrapper">
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
      </div>
      <UpcomingEventSlider />
    </div>
  );
}

export default PastEvents;
