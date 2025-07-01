import React from 'react';
import './EventGrid.css';
import EventCard from './EventCard';

function EventGrid({ events }) {
  return (
    <div id="event-section" className="event-section">
      <div className="event-grid">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event, index) => (
            <EventCard
              key={event.id}
              id={event.id}
              image={event.image}        // ✅ fixed
              title={event.title}        // ✅ fixed
              university={event.university}
            />
          ))
        ) : (
          <p>No matching events found.</p>
        )}
      </div>

      <div className="view-all-wrapper">
        <a href="/events" className="view-all-button">
          View All Events
        </a>
      </div>
    </div>
  );
}

export default EventGrid;
