import React, { useState, useEffect } from 'react';
import axios from '../axios';
import './AdminAllEvents.css';
import AdminLayout from './AdminLayout';
import { FaEdit, FaTrash } from 'react-icons/fa';

function AdminAllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editEvent, setEditEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch all events from the API
  const fetchAllEvents = () => {
    setLoading(true);
    axios.get('/events/all')
      .then(res => {
        console.log('All events:', res.data);  // Log the response to check its structure

        // Check if the data is an array or is inside 'data'
        const eventsData = Array.isArray(res.data.data) ? res.data.data : [];
        setEvents(eventsData); // Set the events from the 'data' property
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching all events:', err);
        setLoading(false);
      });
  };

  // Fetch events when the component mounts
  useEffect(() => {
    fetchAllEvents();
  }, []); // empty dependency array ensures this runs only once

  // Delete an event
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/events/${id}`);
      setEvents(prev => prev.filter(event => event.id !== id)); // Remove event from the state
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  // Open the edit modal
  const openEditModal = (event) => {
    setEditEvent(event);
    setShowEditModal(true);
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEvent({ ...editEvent, [name]: value });
  };

  // Update the event
  const handleUpdate = async () => {
    try {
      await axios.put(`/events/${editEvent.id}`, editEvent);
      setShowEditModal(false);
      fetchAllEvents(); // Refresh the event list after updating
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-all-events">
        <h2 className="topic">All Events</h2>
        <div className="table-container">
          {loading ? (
            <p>Loading...</p>
          ) : events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <table className="events-table">
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
                  <th>Approver</th>
                  <th>Position</th>
                  <th>Token</th>
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
                    <td>{event.description}</td>
                    <td>{event.approver}</td>
                    <td>{event.position}</td>
                    <td>{event.approval_token}</td>
                    <td>
                      <button
                        onClick={() => openEditModal(event)}
                        className="icon-btn edit-btn1"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="icon-btn delete-btn1"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

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

export default AdminAllEvents;
