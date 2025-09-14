// src/components/AdminLayout.js
import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaClock, FaUsers, FaSignOutAlt, FaLock } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';
import { FaStore } from 'react-icons/fa';
import { FaTimesCircle } from "react-icons/fa";
import axios from '../axios'; // ✅ added

function AdminLayout({ children, activePage }) {
  const location = useLocation();

  // ✅ NEW: hold current admin (name + avatar)
  const [admin, setAdmin] = useState({
    name: '',
    avatar_url: '',
    avatar_path: '',
  });

  useEffect(() => {
    // Adjust the endpoint if yours is different (e.g., /api/admin/me)
    axios.get('/admin/me')
      .then(res => {
        const payload = res.data?.admin || res.data || {};
        setAdmin({
          name: payload.name || '',
          avatar_url: payload.avatar_url || '',
          avatar_path: payload.avatar_path || '',
        });
      })
      .catch(() => {
        // keep defaults if not logged in / no endpoint yet
        setAdmin(prev => ({ ...prev }));
      });
  }, []);

  // Build usable avatar src with fallback
  const avatarSrc =
    admin.avatar_url ||
    (admin.avatar_path ? `/storage/${admin.avatar_path}` : '/assets/admin/admin1.png');

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-profile">
          {/* ✅ dynamic avatar with graceful fallback */}
          <img
            src={avatarSrc}
            alt="admin"
            className="admin-avatar"
            onError={(e) => { e.currentTarget.src = '/assets/admin/admin1.png'; }}
          />
          {/* ✅ dynamic name */}
          <span className='welcome'>
            {admin.name ? `Welcome ${admin.name}!` : 'Welcome Ishini!'}
          </span>
        </div>

        <nav className="admin-menu">
          <Link to="/admin/dashboard" className={`menu-item ${location.pathname === "/admin/dashboard" ? "active" : ""}`}>
            <FaClipboardList /> Dashboard
          </Link>
          <Link to="/admin/events" className={`menu-item ${location.pathname === "/admin/events" ? "active" : ""}`}>
            <FaClipboardList /> All Events
          </Link>
          <Link to="/admin/approvals" className={`menu-item ${location.pathname === "/admin/approvals" ? "active" : ""}`}>
            <FaClock /> Pending Approvals
          </Link>
          <Link to="/admin/rejected-approvals" className={`menu-item ${location.pathname === "/admin/rejected-approvals" ? "active" : ""}`}>
            <FaTimesCircle /> Rejected Approvals
          </Link>
          <Link to="/admin/users" className={`menu-item ${location.pathname === "/admin/users" ? "active" : ""}`}>
            <FaUsers /> Users
          </Link>
          <Link to="/admin/societies" className={`menu-item ${location.pathname === "/admin/societies" ? "active" : ""}`}>
            <FaClipboardList /> Society Approvers
          </Link>
          <Link to="/admin/store" className={`menu-item ${activePage === 'store' ? 'active' : ''}`}>
            <FaStore /> Store
          </Link>
          <Link to="/admin/change-password" className={`menu-item ${location.pathname === "/admin/change-password" ? "active" : ""}`}>
            <FaLock /> Change Password
          </Link>
          <Link to="/admin/logout" className="menu-item">
            <FaSignOutAlt /> Logout
          </Link>
        </nav>

        <div className="admin-footer">
          <h4>UniHub</h4>
          <p>Version: 1.0.0.0</p>
        </div>
      </aside>

      {/* Right Side Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;