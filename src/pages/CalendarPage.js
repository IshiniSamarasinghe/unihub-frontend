import React, { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from '../axios';
import './CalendarPage.css';

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]); // keep as array

  // Normalize whatever the backend sends into a plain array
  const normalize = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.events)) return payload.events;
    if (Array.isArray(payload?.data?.data)) return payload.data.data; // common paginator shape
    return [];
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/events/approved');
        setEvents(normalize(res?.data));
      } catch (err) {
        console.error('❌ Failed to fetch events:', err);
        setEvents([]); // never leave it non-array
      }
    })();
  }, []);

  // Utility: YYYY-MM-DD in *local* time (to avoid timezone drift from toISOString())
  const toYMD = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate())
      .toLocaleDateString('en-CA'); // 2025-09-13

  // Safer date-time build (time may be null/empty or not ISO)
  const toDateTime = (ev) => {
    const t = (ev.time || '00:00').slice(0,5); // "HH:mm"
    return new Date(`${ev.date}T${t}`);
  };

  // Always operate on a safe array
  const safeEvents = useMemo(
    () => (Array.isArray(events) ? events.filter(Boolean) : []),
    [events]
  );

  const getEventsForDate = (date) => {
    const ymd = toYMD(date);
    return safeEvents.filter((ev) => ev?.date === ymd);
  };

  return (
    <div>
      {/* Hero */}
      <div
        className="about-hero"
        style={{
          backgroundColor: '#F39D0C',
          height: 140,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        <h1 className="about-title"> EVENT CALENDAR</h1>
      </div>

      {/* Main */}
      <div style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            marginTop: '2rem',
          }}
        >
          {/* Calendar */}
          <div>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="custom-calendar"
              tileClassName={({ date, view }) => {
                if (view !== 'month') return '';
                const ymd = toYMD(date);
                const todaysEvents = safeEvents.filter((ev) => ev?.date === ymd);
                if (todaysEvents.length === 0) return '';
                const isPast = toDateTime(todaysEvents[0]) < new Date();
                return isPast ? 'past-event' : 'upcoming-event';
              }}
              tileContent={({ date, view }) => {
                if (view !== 'month') return null;
                const ymd = toYMD(date);
                const some = safeEvents.some((ev) => ev?.date === ymd);
                if (!some) return null;
                const first = safeEvents.find((ev) => ev?.date === ymd);
                const isPast = first ? toDateTime(first) < new Date() : false;
                return (
                  <div
                    style={{
                      marginTop: '2px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isPast ? 'rgb(222, 1, 1)' : 'rgb(31, 167, 7)',
                      marginInline: 'auto',
                    }}
                  />
                );
              }}
            />
          </div>

          {/* Events list */}
          <div style={{ maxWidth: '400px' }}>
            <div style={{ marginTop: '1rem' }}>
              {getEventsForDate(selectedDate).length > 0 ? (
                <>
                  <h5>📌 Events on {selectedDate.toDateString()}</h5>
                  {getEventsForDate(selectedDate).map((ev) => (
                    <div
                      key={ev.id ?? `${ev.date}-${ev.name}`}
                      style={{
                        border: '1px solid #ccc',
                        borderRadius: '12px',
                        padding: '1.2rem',
                        marginBottom: '1rem',
                        background: '#f9f9f9',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        width: '100%',
                        fontSize: '12px',
                      }}
                    >
                      <h5 style={{ marginBottom: '0.8rem', fontWeight: '600' }}>
                        {ev.name ?? ev.title ?? 'Event'}
                      </h5>
                      <p><strong>⏰ Time:</strong> {ev.time ?? '—'}</p>
                      <p><strong>📍 Location:</strong> {ev.location || 'N/A'}</p>
                      <p><strong>🏛️ Society:</strong> {ev.society || '—'}</p>
                      <p><strong>🎓 University:</strong> {ev.university || '—'}</p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="warning">No events on this date.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
