import React, { useEffect, useState } from 'react';
import './AdminEventApproval.css';
import AdminLayout from './AdminLayout';
import axios from '../axios';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';

function AdminEventApproval() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDesc, setExpandedDesc] = useState(null);

  // 🔁 Function to fetch events
  const fetchEvents = () => {
    setLoading(true);
    axios.get('/events/pending')
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.events)
          ? res.data.events
          : [];
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching events:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const toggleDescription = (id) => {
    setExpandedDesc(prev => (prev === id ? null : id));
  };

  return (
    <AdminLayout active="approvals">
      <div className="approval-section">
        <h2>Pending Event Approvals</h2>

        {loading ? (
          <p>Loading...</p>
        ) : events.length === 0 ? (
          <p>No pending events found.</p>
        ) : (
          <div className="approval-table-container">
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
                    <td>
                      {event.description?.length > 30 ? (
                        expandedDesc === event.id ? (
                          <>
                            {event.description}
                            <br />
                            <button onClick={() => toggleDescription(event.id)} className="desc-btn">View less</button>
                          </>
                        ) : (
                          <>
                            {event.description.slice(0, 30)}...
                            <button onClick={() => toggleDescription(event.id)} className="desc-btn">View more</button>
                          </>
                        )
                      ) : (
                        event.description
                      )}
                    </td>
                    <td>{event.media_path ? 'Available' : 'Not Available'}</td>
                    <td>{event.approver}</td>
                    <td><span className="status pending">{event.status}</span></td>
                    <td>{event.user_id}</td>
                    <td>{new Date(event.created_at).toLocaleDateString()}</td>
                    <td>{new Date(event.updated_at).toLocaleDateString()}</td>
                    <td className="icon-actions">
                      <FaEye
                        title="View"
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                        onClick={() => window.open(`/events`, '_blank')}
                      />
                      <FaEdit
                        title="Edit"
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                        onClick={() => alert('Edit functionality not implemented yet')}
                      />
                      <FaTrash
                        title="Delete"
                        style={{ cursor: 'pointer' }}
                        onClick={() => alert('Delete functionality not implemented yet')}
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

export default AdminEventApproval;
