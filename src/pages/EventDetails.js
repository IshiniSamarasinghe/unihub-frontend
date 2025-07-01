import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetails.css';
import axios from '../axios';
import PastEventSlider from '../components/PastEventSlider';
import {
  FaCalendarAlt, FaUniversity, FaClock, FaMapMarkerAlt,
  FaUsers, FaTag, FaLaptopCode, FaBook
} from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => {
    axios.get(`/events/${id}`)
      .then(response => {
        const mainEvent = response.data;
        setEvent(mainEvent);

        const keyword = mainEvent.name.split(' ')[0]; // Series keyword
        axios
          .get(`/events/past-series?name=${keyword}&excludeId=${mainEvent.id}`)
          .then(res => setRelatedEvents(res.data))
          .catch(err => console.error("❌ Failed to fetch related events:", err));
      })
      .catch(err => {
        console.error('❌ Error fetching event details:', err);
      });
  }, [id]);

  const handleDownload = () => {
    if (!event?.image_url) {
      alert("No image available to download.");
      return;
    }

    const link = document.createElement('a');
    link.href = event.image_url;
    link.download = `${event.name?.replace(/\s+/g, '_') || 'event_image'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowMenu(false);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const formattedHour = ((h + 11) % 12 + 1); // 0–23 to 1–12
    return `${formattedHour}:${minute} ${suffix}`;
  };

  if (!event) return <p style={{ padding: '2rem' }}>Loading event details...</p>;

  return (
    <>
      <div className="event-details-hero">
        <div
          className="event-header"
          style={{
            backgroundImage: "url('/react/assets/hero-image2.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '3rem',
            color: '#1a1a1a'
          }}
        >
          <h1>{event.name}</h1>
        </div>

        <div className="event-image-container">
          <img
            src={event.image_url || '/react/assets/events/default.jpg'}
            alt={event.name}
            className="hero-image"
          />

          <div className="more-menu-container">
            <BsThreeDotsVertical
              className="more-icon"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={handleDownload}>Download</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="event-details-grid">
        <p><FaLaptopCode style={{ marginRight: '10px' }} /><strong> Event Name:</strong> {event.name}</p>
        <p><FaBook style={{ marginRight: '10px' }} /><strong> Faculty:</strong> {event.faculty || 'N/A'}</p>
        <p><FaCalendarAlt style={{ marginRight: '10px' }} /><strong> Event Date:</strong> {event.date}</p>
        <p><FaClock style={{ marginRight: '10px' }} /><strong> Start Time:</strong> {formatTime(event.time)}</p>
        <p><FaMapMarkerAlt style={{ marginRight: '10px' }} /><strong> Location:</strong> {event.location || 'N/A'}</p>
        <p><FaUniversity style={{ marginRight: '10px' }} /><strong> University:</strong> {event.university}</p>
        <p><FaUsers style={{ marginRight: '10px' }} /><strong> Society:</strong> {event.society}</p>
        <p><FaTag style={{ marginRight: '10px' }} /><strong> Event Type:</strong> {event.type || 'N/A'}</p>
        <p><FaUsers style={{ marginRight: '10px' }} /><strong> Audience:</strong> {event.audience || 'N/A'}</p>
      </div>

      <PastEventSlider events={relatedEvents} />
    </>
  );
}

export default EventDetails;
