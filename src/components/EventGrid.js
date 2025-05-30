import React from 'react';
import './EventGrid.css';
import EventCard from './EventCard';

const events = [
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
    university: 'University of Kelaniya',
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
    university: 'University of Kelaniya',
  },
  
  // repeat as needed...
];

function EventGrid() {
  return (
    <div className="event-section">
      <div className="event-grid">
        {events.map((event, index) => (
          <EventCard
            key={index}
            image={event.image}
            title={event.title}
            university={event.university}
          />
        ))}
      </div>

      <div className="view-all-wrapper">
        <button className="view-all-button">View All Events</button>
      </div>
    </div>
  );
}

export default EventGrid;
