import React, { useEffect, useState } from 'react';
import './AdminUsers.css';
import AdminLayout from './AdminLayout';
import { FaUserEdit, FaTrash } from 'react-icons/fa';
import axios from '../axios';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ phone: '', faculty: '', user_type: 'normal_user' });

  useEffect(() => {
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`/api/users/${id}`)
        .then(() => setUsers(prev => prev.filter(user => user.id !== id)))
        .catch(err => alert("Failed to delete user."));
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditData({
      phone: user.phone || '',
      faculty: user.faculty || '',
      user_type: user.user_type || 'normal_user',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/users/${editingUser.id}`, editData)
      .then(res => {
        setUsers(prev =>
          prev.map(u => (u.id === editingUser.id ? res.data.user : u))
        );
        setEditingUser(null);
      })
      .catch(err => alert("Failed to update user."));
  };

  return (
    <AdminLayout activePage="users">
      <div className="user-management">
        <h3>Registered Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>University Email</th>
              <th>Phone</th>
              <th>Faculty</th>
              <th>User Type</th>
              <th>Society + Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.faculty}</td>
                <td>{user.user_type}</td>
                <td>
                  {user.roles.map((role, i) => (
                    <div key={i}>{role.society} - {role.role}</div>
                  ))}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(user)}><FaUserEdit /></button>
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}><FaTrash /></button>
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
        {editingUser && (
          <div className="modal-backdrop">
            <div className="edit-modal">
              <h4>Edit User: {editingUser.name}</h4>
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  placeholder="Phone Number"
                />
                <input
                  type="text"
                  name="faculty"
                  value={editData.faculty}
                  onChange={handleEditChange}
                  placeholder="Faculty"
                />
                <select
                  name="user_type"
                  value={editData.user_type}
                  onChange={handleEditChange}
                >
                  <option value="normal_user">Normal User</option>
                  <option value="super_user">Super User</option>
                </select>
                <div style={{ marginTop: '1rem' }}>
                  <button type="submit" className="view-all-btn">Update</button>
                  <button type="button" className="clear-btn" onClick={() => setEditingUser(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
