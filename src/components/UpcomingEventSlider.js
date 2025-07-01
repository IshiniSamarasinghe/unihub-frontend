import React, { useRef, useEffect, useState } from 'react';
import './EventGrid.css';
import EventCard from './EventCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from '../axios';

function UpcomingEventSlider() {
  const sliderRef = useRef(null);
  const scrollByAmount = 300;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/events/approved')
      .then(res => {
        const now = new Date();

        const upcoming = res.data.filter(event => {
          const eventDateTime = new Date(`${event.date}T${event.time}`);
          return eventDateTime > now;
        });

        const formatted = upcoming.map(event => ({
          id: event.id, // ✅ include ID
          image: event.image_url || '/react/assets/events/default.jpg',
          title: event.name,
          university: event.university
        }));

        setEvents(formatted);
      })
      .catch(err => {
        console.error('❌ Failed to load upcoming events:', err);
      });
  }, []);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-section">
      <h2 className="slider-heading">UPCOMING EVENTS</h2>
      <div className="slider-wrapper">
        <button className="slider-arrow left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>

        <div className="event-slider" ref={sliderRef}>
          {events.length === 0 ? (
            <p style={{ fontFamily: 'Poppins', fontSize: '14px', paddingLeft: '1rem' }}>
              No upcoming events found.
            </p>
          ) : (
            events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id} // ✅ enables redirection
                image={event.image}
                title={event.title}
                university={event.university}
              />
            ))
          )}
        </div>

        <button className="slider-arrow right" onClick={scrollRight}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

export default UpcomingEventSlider;
