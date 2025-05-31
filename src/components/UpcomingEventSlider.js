import React, { useRef, useEffect } from 'react';
import './EventGrid.css';
import EventCard from './EventCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
    university: 'University of Kelaniya',
  },
  {
    image: '/assets/events/codecraft.jpg',
    title: 'DevX Tech Talks',
    university: 'University of Jaffna',
  },
    {
    image: '/assets/events/research.jpg',
    title: 'Research Showcase: Innovations in ICT',
    university: 'University of Kelaniya',
  },
  {
    image: '/assets/events/codecraft.jpg',
    title: 'DevX Tech Talks',
    university: 'University of Jaffna',
  },
 
];

function UpcomingEventSlider() {
  const sliderRef = useRef(null);

  const scrollByAmount = 300;

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
        // Go back to start
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll forward
        sliderRef.current.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
      }
    }, 3000); // scroll every 3 seconds

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
          {upcomingEvents.map((event, index) => (
            <EventCard
              key={index}
              image={event.image}
              title={event.title}
              university={event.university}
            />
          ))}
        </div>

        <button className="slider-arrow right" onClick={scrollRight}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

export default UpcomingEventSlider;
