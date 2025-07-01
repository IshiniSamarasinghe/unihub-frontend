import React from 'react';
import { useNavigate } from 'react-router-dom';

function EventCard({ id, image, title, university }) {
  const navigate = useNavigate();

  const handleImgError = (e) => {
    e.target.src = '/default-image.jpg';
  };

  const handleClick = () => {
    if (id) {
      navigate(`/event/${id}`);
    } else {
      console.warn('❌ Event ID not found. Navigation aborted.');
    }
  };

  return (
    <div
      className="event-card"
      onClick={handleClick}
      style={{ cursor: id ? 'pointer' : 'default' }}
    >
      <img
        src={image || '/default-image.jpg'}
        alt={title || 'Event'}
        className="event-image"
        onError={handleImgError}
      />
      <h3 className="event-title">{title || 'Untitled Event'}</h3>
      <p className="event-university">{university || 'Unknown University'}</p>
    </div>
  );
}

export default EventCard;
