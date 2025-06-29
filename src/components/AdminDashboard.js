// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaClock, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import AdminLayout from './AdminLayout';
import './AdminDashboard.css';

function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: 0,
    pendingEvents: 0,
    registeredUsers: 0,
  });

  const [recentEvents, setRecentEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/dashboard-metrics')
      .then(res => {
        setDashboardStats(res.data);
      })
      .catch(err => console.error('Failed to load dashboard stats', err));

    axios.get('/events/all')
      .then(res => {
        const latestFive = res.data.slice(0, 5);
        setRecentEvents(latestFive);
      })
      .catch(err => console.error('Failed to load recent events', err));
  }, []);

  return (
    <AdminLayout activePage="dashboard">
      <div className="admin-topbar">
        <div className="search-bar">
          <input type="text" placeholder="Quick search" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card active">
          <FaClipboardList className="card-icon" />
          <h4>Total Events</h4>
          <p>{dashboardStats.totalEvents}</p>
        </div>
        <div className="dashboard-card">
          <FaClock className="card-icon" />
          <h4>Pending Approvals</h4>
          <p>{dashboardStats.pendingEvents}</p>
        </div>
        <div className="dashboard-card">
          <FaUsers className="card-icon" />
          <h4>Registered Users</h4>
          <p>{dashboardStats.registeredUsers}</p>
        </div>
      </div>

      {/* Recent submissions */}
      <div className="recent-submissions">
        <h3>Recent Event Submissions</h3>
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>University</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentEvents.map((event) => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.university}</td>
                <td>{event.date}</td>
                <td><span className={`status ${event.status}`}>{event.status}</span></td>
                <td><button onClick={() => navigate('/admin/events')}>More Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="submission-actions">
          <button className="clear-btn">Clear</button>
          <button className="view-all-btn" onClick={() => navigate('/admin/events')}>View all</button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
