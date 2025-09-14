// src/pages/UpcomingEvents.js
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import UpcomingEventGrid from '../components/UpcomingEventGrid';
import './UpcomingEvents.css';
import { Link } from 'react-router-dom';
import axios from '../axios';

/* =========================
   Top-level helpers (no deps)
   ========================= */

const getArrayFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.events)) return data.events;
  if (data && Array.isArray(data.results)) return data.results;
  if (data && Array.isArray(data.items)) return data.items;

  console.warn('Unexpected events response shape:', data);
  return [];
};

const pad2 = (x) => (x.toString().length === 1 ? `0${x}` : `${x}`);

const normalizeTimeTo24h = (raw) => {
  if (!raw || typeof raw !== 'string') return '00:00:00';
  const t = raw.trim();

  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;        // HH:mm:ss
  if (/^\d{1,2}:\d{2}$/.test(t)) return `${t}:00`;    // HH:mm

  // h:mm AM/PM (space optional)
  const ampm = t.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (ampm) {
    let h = parseInt(ampm[1], 10);
    const m = ampm[2];
    const mer = ampm[3].toUpperCase();
    if (mer === 'PM' && h !== 12) h += 12;
    if (mer === 'AM' && h === 12) h = 0;
    return `${pad2(h)}:${m}:00`;
  }

  return '00:00:00';
};

const toEventModel = (e) => {
  const absoluteImage = e.image_url || e.imageUrl || null;
  const storagePath = e.media_path || e.mediaPath || e.image_path || null;

  const image =
    absoluteImage ||
    (storagePath ? `http://127.0.0.1:8000/storage/${storagePath}` : '/default-image.jpg');

  const time = normalizeTimeTo24h(e.time);
  const eventDateTime = new Date(`${e.date}T${time}`);

  return {
    id: e.id ?? e.event_id ?? e._id ?? Math.random().toString(36).slice(2),
    image,
    title: e.name || e.title || 'Untitled Event',
    university: e.university || e.faculty || '',
    eventDateTime,
    _raw: e,
  };
};

const splitUpcomingPast = (events) => {
  const now = new Date();
  const upcoming = events.filter((ev) => ev.eventDateTime >= now);
  const past = events.filter((ev) => ev.eventDateTime < now);
  upcoming.sort((a, b) => a.eventDateTime - b.eventDateTime);
  past.sort((a, b) => b.eventDateTime - a.eventDateTime);
  return { upcoming, past };
};

/* =========================
   Component
   ========================= */

function UpcomingEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredUpcoming, setFilteredUpcoming] = useState([]);
  const [filteredPast, setFilteredPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setErrMsg('');

        const res = await axios.get('/events/all');
        const rawArray = getArrayFromResponse(res?.data);
        const normalized = rawArray.map(toEventModel);
        const { upcoming, past } = splitUpcomingPast(normalized);

        if (!mounted) return;
        setAllEvents(normalized);
        setFilteredUpcoming(upcoming);
        setFilteredPast(past);
      } catch (err) {
        console.error('Error fetching events:', err);
        if (mounted) {
          setErrMsg('Unable to load events right now.');
          setAllEvents([]);
          setFilteredUpcoming([]);
          setFilteredPast([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, []); // ✅ no missing-deps warning

  const handleSearch = (query) => {
    const lower = (query || '').toLowerCase();
    const now = new Date();

    const upcoming = allEvents.filter(
      (e) => e.eventDateTime >= now && e.title.toLowerCase().includes(lower)
    );
    const past = allEvents.filter(
      (e) => e.eventDateTime < now && e.title.toLowerCase().includes(lower)
    );

    setFilteredUpcoming(upcoming);
    setFilteredPast(past);
  };

  return (
    <div className="upcoming-events">
      <div
        className="events-hero"
        style={{
          backgroundColor: '#F39D0C',
          height: 140,
          display: 'flex',
          alignItems: 'left',
          justifyContent: 'left',
          color: '#fff',
        }}
      >
        <h1
          className="events-heading"
          style={{
            fontFamily: 'Playfair Display',
            fontSize: '24px',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            textAlign: 'left',
          }}
        >
          UPCOMING EVENTS
        </h1>
      </div>

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <div style={{ padding: '1rem' }}>Loading events…</div>
      ) : errMsg ? (
        <div style={{ padding: '1rem', color: 'crimson' }}>{errMsg}</div>
      ) : (
        <>
          <UpcomingEventGrid events={filteredUpcoming} />

          <div className="events-heropast">
            <h1>PAST EVENTS</h1>
          </div>

          <UpcomingEventGrid events={filteredPast} />
        </>
      )}

      <div className="view-past-wrapper">
        <Link to="/past-events">
          <button className="view-past-button">View All Past Events</button>
        </Link>
      </div>
    </div>
  );
}

export default UpcomingEvents;
