import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import axios from '../axios';
import { FaEye } from 'react-icons/fa';
import './AdminAllEvents.css'; // reuse same styles

function AdminRejectedApprovals() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await axios.get('/events/rejected'); // public endpoint
        // The API might return an array OR a paginated object { data: [...] } OR an error object.
        const payload = res?.data;
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];

        if (!cancelled) {
          setEvents(items);
        }
      } catch (err) {
        console.error('Error loading rejected events', err);
        if (!cancelled) setLoadError('Failed to load rejected events.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminLayout active="rejected">
      <div className="approval-section">
        <h2>Rejected Approvals</h2>

        {loading && <p>Loading...</p>}

        {!loading && loadError && (
          <p style={{ fontSize: '12px', color: '#b00', textAlign: 'center', marginTop: 12 }}>
            {loadError}
          </p>
        )}

        {!loading && !loadError && (!Array.isArray(events) || events.length === 0) && (
          <p style={{ fontSize: '12px', color: '#555', textAlign: 'center', marginTop: 20 }}>
            No rejected events found.
          </p>
        )}

        {!loading && !loadError && Array.isArray(events) && events.length > 0 && (
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
                {events.map((event) => {
                  const created = event?.created_at ? new Date(event.created_at) : null;
                  const updated = event?.updated_at ? new Date(event.updated_at) : null;

                  return (
                    <tr key={event.id}>
                      <td>{event.name ?? '—'}</td>
                      <td>{event.society ?? '—'}</td>
                      <td>{event.university ?? '—'}</td>
                      <td>{event.faculty ?? '—'}</td>
                      <td>{event.type ?? '—'}</td>
                      <td>{event.date ?? '—'}</td>
                      <td>{event.time ?? '—'}</td>
                      <td>{event.location ?? '—'}</td>
                      <td>{event.audience ?? '—'}</td>
                      <td>{event.description ? `${event.description.slice(0, 30)}…` : '—'}</td>
                      <td>{event.media_path ? 'Available' : 'Not Available'}</td>
                      <td>{event.approver ?? '—'}</td>
                      <td><span className="status rejected">{event.status ?? 'rejected'}</span></td>
                      <td>{event.user_id ?? '—'}</td>
                      <td>{created ? created.toLocaleDateString() : '—'}</td>
                      <td>{updated ? updated.toLocaleDateString() : '—'}</td>
                      <td className="icon-actions">
                        <FaEye
                          title="View"
                          style={{ cursor: 'pointer' }}
                          onClick={() => window.open(`/event/${event.id}`, '_blank')}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminRejectedApprovals;
