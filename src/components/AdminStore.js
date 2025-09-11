import React, { useEffect, useState } from 'react';
import './AdminStore.css';
import AdminLayout from './AdminLayout';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from '../axios';

function AdminStore() {
  const [storeItems, setStoreItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    faculty: '',
    description: '',
    price: '',
    details: '',
    end_date: '',       // ✅ Added End Date
    image: null,
  });

  useEffect(() => {
    fetchStoreItems();
  }, []);

  const fetchStoreItems = () => {
    axios.get('/store-items')
      .then(response => {
        const formatted = response.data.map(item => ({
          ...item,
          image: item.image_path
            ? `http://127.0.0.1:8000/storage/${item.image_path}`
            : '/react/assets/store/default.jpg'
        }));
        setStoreItems(formatted);
      })
      .catch(error => {
        console.error('Error loading store items:', error);
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`/store-items/${id}`);
      setStoreItems(prev => prev.filter(item => item.id !== id));
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item.');
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      faculty: item.faculty,
      description: item.description,
      price: item.price,
      details: item.details,
      end_date: item.end_date || '',   // ✅ NEW: set end_date in the form
      image: null,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditForm({ ...editForm, image: files[0] });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', editForm.title);
    formData.append('faculty', editForm.faculty);
    formData.append('description', editForm.description);
    formData.append('price', editForm.price);
    formData.append('details', editForm.details);
    formData.append('end_date', editForm.end_date || ''); // ✅ NEW: send end_date
    if (editForm.image) {
      formData.append('image', editForm.image);
    }

    try {
      await axios.post(`/store-items/${editingItem.id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Item updated successfully!');
      setEditingItem(null);
      fetchStoreItems();
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    }
  };

  return (
    <AdminLayout activePage="store">
      <div className="admin-store-page">
        <div className="store-header">
          <h2 className='topic'>Store Management</h2>
        </div>

        <table className="store-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th>Faculty</th>
              <th>Price</th>
              <th>Details</th>
              <th>End Date</th> {/* ✅ NEW: Added End Date column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {storeItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '60px', borderRadius: '4px' }}
                  />
                </td>
                <td>{item.faculty}</td>
                <td>{item.price}</td>
                <td>{item.details}</td>
                <td>{item.end_date || '-'}</td> {/* ✅ NEW: Display End Date */}
                <td>
                  {/* Black-only icons */}
                  <button className="icon-btn1" onClick={() => openEditModal(item)} aria-label="Edit" title="Edit">
                    <FaEdit />
                  </button>
                  <button className="icon-btn1" onClick={() => handleDelete(item.id)} aria-label="Delete" title="Delete">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✏️ Edit Modal */}
        {editingItem && (
          <div className="edit-modal">
            <div className="edit-modal-content">
              <span className="close-modal" onClick={() => setEditingItem(null)}>&times;</span>
              <h3>Edit Item</h3>
              <form className="edit-form" onSubmit={handleEditSubmit}>
                <input type="text" name="title" placeholder="Title" value={editForm.title} onChange={handleEditInputChange} required />
                <input type="text" name="faculty" placeholder="Faculty" value={editForm.faculty} onChange={handleEditInputChange} required />
                <input type="text" name="description" placeholder="Description" value={editForm.description} onChange={handleEditInputChange} required />
                <input type="text" name="price" placeholder="Price" value={editForm.price} onChange={handleEditInputChange} required />
                <input type="text" name="details" placeholder="WhatsApp or Contact Details" value={editForm.details} onChange={handleEditInputChange} required />
                {/* ✅ NEW: End Date */}
                <input type="date" name="end_date" value={editForm.end_date} onChange={handleEditInputChange} />
                <input type="file" name="image" accept=".jpg,.jpeg,.png" onChange={handleEditInputChange} />
                <button type="submit">Update Item</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminStore;
