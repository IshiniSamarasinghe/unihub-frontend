import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { FaStore, FaBell, FaBars, FaTimes } from 'react-icons/fa';
import NotificationToggle from './NotificationToggle';
import { FaUserCircle, FaCalendarCheck } from 'react-icons/fa';




<a href="/my-events" className="nav-link">
  <FaCalendarCheck style={{ marginRight: '6px' }} />
  My-Events
</a>


function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/react/assets/logo.png" alt="UniHub Logo" className="navbar-logo" />
      </Link>


      <div className="hamburger" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`navbar-links-container ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="navbar-center">
          <a href="/" className="nav-link">Home</a>
          <a href="/events" className="nav-link">Events</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/calendar" className="nav-link">Calendar</a>
          <a href="/my-events" className="nav-link">
            <FaUserCircle style={{ marginRight: '6px' }} />
            My-Events
          </a>



        </div>

        <div className="navbar-right">
          <Link to="/signup" className="nav-signup-button">Sign Up</Link>

          <Link to="/create-event" className="nav-create-button">Create Event</Link>

          <Link to="/store" className="icon-btn">
            <FaStore />
          </Link>

          <div className="icon-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <FaBell />
            {showDropdown && (
              <div className="notification-dropdown">
                <NotificationToggle />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
