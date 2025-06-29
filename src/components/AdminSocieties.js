import React, { useEffect, useState } from 'react';
import './AdminSocieties.css';
import AdminLayout from './AdminLayout';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from '../axios'; // 👈 your custom axios instance

function AdminSocieties() {
  const [approvers, setApprovers] = useState([]);

  useEffect(() => {
    fetchApprovers();
  }, []);

  const fetchApprovers = async () => {
    try {
      const response = await axios.get('/approvers');
      setApprovers(response.data); // assumes response is [{id, society, position, whatsapp_number, email}]
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
                  <button className="edit-btn2"><FaEdit /></button>
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
      </div>
    </AdminLayout>
  );
}

export default AdminSocieties;
