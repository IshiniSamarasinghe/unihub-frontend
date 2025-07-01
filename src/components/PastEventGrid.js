import React from 'react';
import './EventGrid.css'; // Reuse the same grid styles
import EventCard from './EventCard';

function PastEventGrid({ events }) {
  return (
    <div className="event-section">
      <div className="event-grid">
        {events && events.length > 0 ? (
          events.map((event, index) => (
            <EventCard
              key={event.id}
              id={event.id} // ✅ pass ID
              image={event.image}
              title={event.title}
              university={event.university}
            />

          ))
        ) : (
          <p style={{ fontFamily: 'Poppins', fontSize: '14px' }}>
            No past events found.
          </p>
        )}
      </div>
    </div>
  );
}

export default PastEventGrid;
