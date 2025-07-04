import React, { useEffect, useState } from 'react';
import './AdminSocieties.css';
import AdminLayout from './AdminLayout';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from '../axios';

function AdminSocieties() {
  const [approvers, setApprovers] = useState([]);
  const [editingApprover, setEditingApprover] = useState(null);
  const [editData, setEditData] = useState({
    society: '',
    position: '',
    whatsapp_number: '',
    email: ''
  });

  useEffect(() => {
    fetchApprovers();
  }, []);

  const fetchApprovers = async () => {
    try {
      const response = await axios.get('/approvers');
      setApprovers(response.data);
    } catch (error) {
      console.error('Error fetching approvers:', error);
    }
  };

  const deleteApprover = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`/approvers/${id}`);
      setApprovers(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting approver:', error);
    }
  };

  const handleEditClick = (approver) => {
    setEditingApprover(approver);
    setEditData({
      society: approver.society || '',
      position: approver.position || '',
      whatsapp_number: approver.whatsapp_number || '',
      email: approver.email || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/approvers/${editingApprover.id}`, editData);
      setEditingApprover(null);
      fetchApprovers();
    } catch (error) {
      alert("Failed to update approver.");
      console.error(error);
    }
  };

  return (
    <AdminLayout activePage="societies">
      <div className="society-management">
        <h3>Society Approvers</h3>
        <table>
          <thead>
            <tr>
              <th>Society</th>
              <th>Position</th>
              <th>WhatsApp</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvers.map((approver) => (
              <tr key={approver.id}>
                <td>{approver.society}</td>
                <td>{approver.position}</td>
                <td>{approver.whatsapp_number}</td>
                <td>{approver.email}</td>
                <td>
                  <button className="edit-btn2" onClick={() => handleEditClick(approver)}><FaEdit /></button>
                  <button className="delete-btn2" onClick={() => deleteApprover(approver.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="submission-actions">
          <button className="clear-btn">Clear</button>
          <button className="view-all-btn">Export</button>
        </div>

        {/* Edit Modal */}
        {editingApprover && (
          <div className="modal-backdrop">
            <div className="edit-modal">
              <h4>Edit Approver</h4>
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  name="society"
                  value={editData.society}
                  onChange={handleEditChange}
                  placeholder="Society"
                />
                <input
                  type="text"
                  name="position"
                  value={editData.position}
                  onChange={handleEditChange}
                  placeholder="Position"
                />
                <input
                  type="text"
                  name="whatsapp_number"
                  value={editData.whatsapp_number}
                  onChange={handleEditChange}
                  placeholder="WhatsApp Number"
                />
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  placeholder="Email"
                />
                <div className="modal-actions">
                  <button type="submit" className="view-all-btn">Update</button>
                  <button type="button" className="clear-btn" onClick={() => setEditingApprover(null)}>Cancel</button>
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
