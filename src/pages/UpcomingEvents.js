import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import UpcomingEventGrid from '../components/UpcomingEventGrid';
import './UpcomingEvents.css';
import { Link } from 'react-router-dom';

function UpcomingEvents() {
  // All upcoming events
  const upcomingEvents = [
    {
      image: '/assets/events/codecraft.jpg',
      title: 'CodeCraft Hackathon 2025',
      university: 'University of Kelaniya',
    },
    {
      image: '/assets/events/quantum.jpg',
      title: 'Quantum Computing Workshop',
      university: 'University of Moratuwa',
    },
    {
      image: '/assets/events/research.jpg',
      title: 'Research Showcase: Innovations in ICT',
      university: 'University of Colombo',
    },
     {
      image: '/assets/events/codecraft.jpg',
      title: 'CodeCraft Hackathon 2025',
      university: 'University of Kelaniya',
    },
    {
      image: '/assets/events/quantum.jpg',
      title: 'Quantum Computing Workshop',
      university: 'University of Moratuwa',
    },
    {
      image: '/assets/events/research.jpg',
      title: 'Research Showcase: Innovations in ICT',
      university: 'University of Colombo',
    },
  ];

  // State to hold filtered events
  const [filteredEvents, setFilteredEvents] = useState(upcomingEvents);

  // Triggered by SearchBar
  const handleSearch = (query) => {
    const results = upcomingEvents.filter((event) =>
      event.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(results);
  };

  return (
    <div className="upcoming-events">
      <div
        className="events-hero"
        style={{
          backgroundImage: "url('/assets/hero-image2.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '10px',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'Playfair Display',
            fontSize: '2rem',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            textAlign: 'left',
          }}
        >
          UPCOMING EVENTS
        </h1>
      </div>

      {/* 🔍 Search bar with callback */}
      <SearchBar onSearch={handleSearch} />

      {/* 🎯 Only matching events */}
      <UpcomingEventGrid events={filteredEvents} />

      <div className="events-heropast">
        <h1>PAST EVENTS</h1>
      </div>

      {/* You can later split past events properly */}
      <UpcomingEventGrid events={filteredEvents} />

      <div className="view-past-wrapper">
        <Link to="/past-events">
          <button className="view-past-button">View All Past Events</button>
        </Link>
      </div>
    </div>
  );
}

export default UpcomingEvents;
