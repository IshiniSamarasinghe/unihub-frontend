import React, { useRef, useEffect } from 'react';
import './EventGrid.css'; // You can keep or change this to a dedicated slider CSS
import EventCard from './EventCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function PastEventSlider({ events }) {
  const sliderRef = useRef(null);
  const scrollByAmount = 300;

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
  };

  // Auto scroll every 3 seconds
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
      <h2 className="slider-heading">Related Past Events</h2>

      <div className="slider-wrapper">
        <button className="slider-arrow left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>

        <div className="event-slider" ref={sliderRef}>
          {events && events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                image={event.image_url || '/react/assets/events/default.jpg'}
                title={event.name}
                university={event.university}
              />
            ))
          ) : (
            <p className='msg' style={{ padding: '1rem' }}>No related past events found.</p>
          )}
        </div>

        <button className="slider-arrow right" onClick={scrollRight}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

export default PastEventSlider;
