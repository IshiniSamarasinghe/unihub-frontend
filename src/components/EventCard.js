import React from 'react';

function EventCard({ image, title, university }) {
  return (
    <div className="event-card">
      <img src='/assets/events/1.jpg' alt='event' className="event-image" />
      <h3 className="event-title">{title}</h3>
      <p className="event-university">{university}</p>
    </div>
  );
}

export default EventCard;
