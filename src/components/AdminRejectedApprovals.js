import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import axios from '../axios';
import { FaEye } from 'react-icons/fa';
import './AdminAllEvents.css'; // reuse same styles

function AdminRejectedApprovals() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/events/rejected') // make sure backend supports this
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading rejected events", err);
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout active="rejected">
      <div className="approval-section">
        <h2>Rejected Approvals</h2>
        {loading ? (
          <p>Loading...</p>
        ) : events.length === 0 ? (
          <p>No rejected events found.</p>
        ) : (
          <div className="table-scroll-container">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Society</th>
                  <th>University</th>
                  <th>Faculty</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Audience</th>
                  <th>Description</th>
                  <th>Media</th>
                  <th>Approver</th>
                  <th>Status</th>
                  <th>User ID</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{event.society}</td>
                    <td>{event.university}</td>
                    <td>{event.faculty}</td>
                    <td>{event.type}</td>
                    <td>{event.date}</td>
                    <td>{event.time}</td>
                    <td>{event.location}</td>
                    <td>{event.audience}</td>
                    <td>{event.description?.slice(0, 30)}...</td>
                    <td>{event.media_path ? 'Available' : 'Not Available'}</td>
                    <td>{event.approver}</td>
                    <td><span className="status rejected">{event.status}</span></td>
                    <td>{event.user_id}</td>
                    <td>{new Date(event.created_at).toLocaleDateString()}</td>
                    <td>{new Date(event.updated_at).toLocaleDateString()}</td>
                    <td className="icon-actions">
                      <FaEye
                        title="View"
                        style={{ cursor: 'pointer' }}
                        onClick={() => window.open(`/events`, '_blank')}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminRejectedApprovals;
