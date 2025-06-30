import React from 'react';

function EventCard({ image, title, university }) {
  const handleImgError = (e) => {
    e.target.src = '/default-image.jpg';
  };

  return (
    <div className="event-card">
      <img
        src={image || '/default-image.jpg'}
        alt="event"
        className="event-image"
        onError={handleImgError}
      />
      <h3 className="event-title">{title}</h3>
      <p className="event-university">{university}</p>
    </div>
  );
}

export default EventCard;
