import React from 'react';
import SearchBar from '../components/SearchBar';
import UpcomingEventGrid from '../components/UpcomingEventGrid';
import './UpcomingEvents.css';
import { Link } from 'react-router-dom'

function UpcomingEvents() {
    return (
        <div className="upcoming-events">
            <div
                className="events-hero"
                style={{
                    backgroundImage: "url('/assets/hero-image2.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '10px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    textAlign: 'center',
                   
                }}
            >
                <h1 style={{
                    fontFamily: 'Playfair Display',
                    fontSize: '2rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    textAlign: 'left'
                }}>
                    UPCOMING EVENTS
                </h1>
            </div>

            <SearchBar />
            <UpcomingEventGrid />

            <div className="events-heropast">
                <h1>PAST EVENTS</h1>
            </div>
            <UpcomingEventGrid />

            <div className="view-past-wrapper">
                <Link to="/past-events">
                    <button className="view-past-button">View All Past Events</button>
                </Link>
            </div>
        </div>
    );
}

export default UpcomingEvents;
