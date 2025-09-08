import React, { useEffect, useState, useCallback } from 'react';
import './AdminSocieties.css';
import AdminLayout from './AdminLayout';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from '../axios';

function AdminSocieties() {
  const [approvers, setApprovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [editingApprover, setEditingApprover] = useState(null);
  const [editData, setEditData] = useState({
    society: '',
    position: '',
    whatsapp_number: '',
    email: ''
  });

  // Pull array out of any common Laravel response shapes
  const pluckArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.approvers)) return payload.approvers;
    if (Array.isArray(payload?.data?.approvers)) return payload.data.approvers;
    return [];
  };

  const fetchApprovers = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      // Try /approvers first (your existing), then /society-approvers
      let res = await axios.get('/approvers');
      let list = pluckArray(res.data);

      if (!list.length) {
        const res2 = await axios.get('/society-approvers');
        list = pluckArray(res2.data);
      }

      setApprovers(list);
    } catch (e) {
      console.error('❌ Error fetching approvers:', e);
      setErr('Failed to load approvers.');
      setApprovers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovers();
  }, [fetchApprovers]);

  const handleEditClick = (row) => {
    setEditingApprover(row);
    setEditData({
      society: row?.society ?? '',
      position: row?.position ?? '',
      whatsapp_number: row?.whatsapp_number ?? '',
      email: row?.email ?? ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingApprover?.id) return;

    try {
      // Prefer the new route; if backend only has /approvers/{id}, it will still work
      await axios.put(`/society-approvers/${editingApprover.id}`, editData)
        .catch(async () => {
          await axios.put(`/approvers/${editingApprover.id}`, editData);
        });

      setEditingApprover(null);
      fetchApprovers();
    } catch (error) {
      console.error('❌ Failed to update approver:', error);
      alert('Failed to update approver.');
    }
  };

  const deleteApprover = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`/society-approvers/${id}`)
        .catch(async () => {
          await axios.delete(`/approvers/${id}`);
        });

      setApprovers((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('❌ Error deleting approver:', error);
      alert('Delete failed.');
    }
  };

  // Simple CSV export
  const exportCSV = () => {
    if (!approvers.length) return;
    const headers = ['id', 'society', 'position', 'whatsapp_number', 'email'];
    const rows = approvers.map((r) =>
      headers.map((h) => (r[h] ?? '')).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'society_approvers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout activePage="societies">
      <div className="society-management">
        <h3>Society Approvers</h3>

        <div className="toolbar">
          <button className="reload-btn" onClick={fetchApprovers}>Reload</button>
          <button className="export-btn" onClick={exportCSV} disabled={!approvers.length}>
            Export CSV
          </button>
        </div>

        {loading && <p className="info">Loading…</p>}
        {err && <p className="error">{err}</p>}

        {!loading && !err && (
          approvers.length ? (
            <table className="society-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Society</th>
                  <th>Position</th>
                  <th>WhatsApp</th>
                  <th>Email</th>
                  <th style={{ width: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvers.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.society}</td>
                    <td>{row.position}</td>
                    <td>{row.whatsapp_number}</td>
                    <td>{row.email}</td>
                    <td>
                      <button className="edit-btn2" onClick={() => handleEditClick(row)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="delete-btn2" onClick={() => deleteApprover(row.id)}>
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="info">No approvers found.</p>
          )
        )}

        {/* Edit Modal */}
        {editingApprover && (
          <div className="modal-backdrop" onClick={() => setEditingApprover(null)}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <h4>Edit Approver</h4>
              <form onSubmit={handleEditSubmit} className="edit-form">
                <label>
                  <span>Society</span>
                  <input
                    type="text"
                    name="society"
                    value={editData.society}
                    onChange={handleEditChange}
                    required
                  />
                </label>
                <label>
                  <span>Position</span>
                  <input
                    type="text"
                    name="position"
                    value={editData.position}
                    onChange={handleEditChange}
                    required
                  />
                </label>
                <label>
                  <span>WhatsApp Number</span>
                  <input
                    type="text"
                    name="whatsapp_number"
                    value={editData.whatsapp_number}
                    onChange={handleEditChange}
                    required
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                  />
                </label>

                <div className="modal-actions">
                  <button type="button" className="clear-btn" onClick={() => setEditingApprover(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="view-all-btn">Update</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminSocieties;
