import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './EventGallery.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function EventGallery({ eventId }) {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    axios.get(`/event-media/${eventId}`)
      .then(res => {
        setMedia(res.data || []);
      })
      .catch(err => {
        console.error('❌ Failed to load event media:', err);
      });
  }, [eventId]);

  if (!media.length) return null;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
  };

  return (
    <div className="event-gallery">
      <h3 className="gallery-title">Image Gallery of {media[0]?.event_name || 'Event'}</h3>
      <Slider {...sliderSettings}>
        {media.map((item, idx) => (
          <div key={idx} className="media-card">
            {item.type === 'image' ? (
              <img src={item.url} alt={`media-${idx}`} className="media-img" />
            ) : (
              <video controls className="media-video">
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default EventGallery;
