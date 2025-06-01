// src/components/PastEventSlider.js
import React, { useRef, useEffect } from 'react';
import './EventGrid.css';
import EventCard from './EventCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const pastEvents = [
  {
    image: '/assets/events/codecraft.jpg',
    title: 'CodeCraft 2024',
    university: 'University of Kelaniya',
  },
  {
    image: '/assets/events/codecraft.jpg',
    title: 'CodeCraft 2023',
    university: 'University of Kelaniya',
  },
  {
    image: '/assets/events/codecraft.jpg',
    title: 'CodeCraft 2022',
    university: 'University of Kelaniya',
  },
  {
    image: '/assets/events/codecraft.jpg',
    title: 'CodeCraft 2021',
    university: 'University of Kelaniya',
  },
];

function PastEventSlider() {
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
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-section">
      <h2 className="slider-heading">PAST CODECRAFT HACKATHON 2025 EVENTS</h2>
      <div className="slider-wrapper">
        <button className="slider-arrow left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>

        <div className="event-slider" ref={sliderRef}>
          {pastEvents.map((event, index) => (
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

export default PastEventSlider;
