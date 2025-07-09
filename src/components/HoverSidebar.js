// src/components/HoverSidebar.js
import React from 'react';
import './HoverSidebar.css';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/logout';

export default function HoverSidebar() {
  const navigate = useNavigate(); // ✅ you missed this line earlier

  return (
    <div className="hover-sidebar">
      <nav>
        <a href="/" className="nav-link">Home</a>
        <a href="/events" className="nav-link">Events</a>
        <a href="/about" className="nav-link">About</a>
        <a href="/calendar" className="nav-link">Calendar</a>
        <a href="/my-events" className="nav-link">My-Event</a>
        <a href="/store" className="nav-link">Store</a>
        <a href="/" className="nav-link">Settings</a>
        <a href="/" className="nav-link">Preferences</a>
        <a href="https://www.google.com/" className="nav-link" onClick={() => logoutUser(navigate)}>Logout</a>
      </nav>

      <div className="sidebar-footer">
        <hr className='bar'/>
        <div className="sidebar-version">
          <div className="sidebar-app-name">UniHub</div>
          <div className="sidebar-version-number">Version: 1.0.0.0</div>
        </div>
      </div>
    </div>
  );
}
