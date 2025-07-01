import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from '../axios';

function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('/events/approved')
            .then(res => setEvents(res.data))
            .catch(err => console.error("❌ Failed to fetch events:", err));
    }, []);

    const getEventsForDate = (date) => {
        const formatted = date.toISOString().split('T')[0];
        return events.filter(ev => ev.date === formatted);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center', fontWeight: 'bold', marginLeft: '-500px' }}>
                <span role="img" aria-label="calendar">📅</span> Event Calendar
            </h3>

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

                            const formatted = date.toISOString().split('T')[0];
                            const matchedEvent = events.find(ev => ev.date === formatted);
                            if (!matchedEvent) return '';

                            const eventDateTime = new Date(`${matchedEvent.date}T${matchedEvent.time}`);
                            const isPast = eventDateTime < new Date();

                            return isPast ? 'past-event' : 'upcoming-event';
                        }}
                        tileContent={({ date, view }) => {
                            if (view !== 'month') return null;

                            const formatted = date.toISOString().split('T')[0];
                            const matchedEvent = events.find(ev => ev.date === formatted);
                            if (!matchedEvent) return null;

                            const eventDateTime = new Date(`${matchedEvent.date}T${matchedEvent.time}`);
                            const isPast = eventDateTime < new Date();

                            return (
                                <div
                                    style={{
                                        marginTop: '2px',
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: isPast ? 'rgb(222, 1, 1)' : ' rgb(31, 167, 7)',  // 🎨 baby red or green
                                        marginInline: 'auto',
                                    }}
                                />
                            );
                        }}

                    />
                </div>

                {/* Events */}
                <div style={{ maxWidth: '400px' }}>
                    <div style={{ marginTop: '1rem' }}>
                        {getEventsForDate(selectedDate).length > 0 ? (
                            <>
                                <h4>📌 Events on {selectedDate.toDateString()}</h4>
                                {getEventsForDate(selectedDate).map(ev => (
                                    <div
                                        key={ev.id}
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '12px',
                                            padding: '1.2rem',
                                            marginBottom: '1rem',
                                            background: '#f9f9f9',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                            width: '100%',
                                            fontSize: '15px'
                                        }}
                                    >
                                        <h5 style={{ marginBottom: '0.8rem', fontWeight: '600' }}>{ev.name}</h5>
                                        <p><strong>⏰ Time:</strong> {ev.time}</p>
                                        <p><strong>📍 Location:</strong> {ev.location || 'N/A'}</p>
                                        <p><strong>🏛️ Society:</strong> {ev.society}</p>
                                        <p><strong>🎓 University:</strong> {ev.university}</p>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p><em>No events on this date.</em></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;
