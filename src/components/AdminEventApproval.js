import React, { useEffect, useState } from 'react';
import './AdminEventApproval.css';
import AdminLayout from './AdminLayout';
import axios from '../axios';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';

function AdminEventApproval() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDesc, setExpandedDesc] = useState(null);

  const [editEvent, setEditEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const openEditModal = (event) => {
    setEditEvent(event);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEvent({ ...editEvent, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/events/${editEvent.id}`, editEvent);
      setShowEditModal(false);
      fetchEvents();
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/events/${id}`);
      setEvents(events.filter(event => event.id !== id));
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
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
                        onClick={() => openEditModal(event)}
                      />
                      <FaTrash
                        title="Delete"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDelete(event.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Event</h3>
              <input type="text" name="name" value={editEvent.name} onChange={handleEditChange} placeholder="Event Name" />
              <input type="text" name="society" value={editEvent.society} onChange={handleEditChange} placeholder="Society" />
              <input type="text" name="university" value={editEvent.university} onChange={handleEditChange} placeholder="University" />
              <input type="text" name="faculty" value={editEvent.faculty} onChange={handleEditChange} placeholder="Faculty" />
              <input type="text" name="type" value={editEvent.type} onChange={handleEditChange} placeholder="Type" />
              <input type="date" name="date" value={editEvent.date} onChange={handleEditChange} />
              <input type="time" name="time" value={editEvent.time} onChange={handleEditChange} />
              <input type="text" name="location" value={editEvent.location} onChange={handleEditChange} placeholder="Location" />
              <input type="text" name="audience" value={editEvent.audience} onChange={handleEditChange} placeholder="Audience" />
              <textarea name="description" value={editEvent.description} onChange={handleEditChange} placeholder="Description" />

              <div className="modal-actions">
                <button onClick={handleUpdate} className="edit-btn1">Update</button>
                <button onClick={() => setShowEditModal(false)} className="delete-btn1">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminEventApproval;
