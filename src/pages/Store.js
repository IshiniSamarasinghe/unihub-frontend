import React, { useState, useEffect } from 'react';
import './Store.css';
import axios from '../axios';

function Store() {
  const [storeItems, setStoreItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    faculty: '',
    description: '',
    price: '',
    details: '',
    image: null
  });

  // ✅ Fetch items from Laravel backend
  useEffect(() => {
    axios.get('/store-items')
      .then(response => {
        const formattedItems = response.data.map(item => ({
          ...item,
          image: item.image_path
            ? `http://127.0.0.1:8000/storage/${item.image_path}`
            : '/react/assets/store/default.jpg'
        }));
        setStoreItems(formattedItems);
      })
      .catch(error => {
        console.error('Error fetching store items:', error);
      });
  }, []);

  // ✅ Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      if (file && !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Only JPG, JPEG, or PNG files are allowed.');
        return;
      }
      setFormValues({ ...formValues, image: file });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', formValues.title);
    formData.append('faculty', formValues.faculty);
    formData.append('description', formValues.description);
    formData.append('price', formValues.price);
    formData.append('details', formValues.details);
    if (formValues.image) {
      formData.append('image', formValues.image);
    }

    try {
      const res = await axios.post('/store-items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newItem = {
        ...res.data,
        image: res.data.image_path
          ? `http://127.0.0.1:8000/storage/${res.data.image_path}`
          : '/react/assets/store/default.jpg'
      };
      setStoreItems(prev => [newItem, ...prev]);
      alert('Item submitted!');
      setShowForm(false);
      setFormValues({
        title: '', faculty: '', description: '', price: '', details: '', image: null
      });
    } catch (error) {
      console.error('Error submitting item:', error);
      alert('Failed to submit item');
    }
  };

  return (
    <div className="store-wrapper">
      <div className={`store-container ${selectedItem || showForm ? 'blurred' : ''}`}>
        <h2 className='topic1'>Support Student Fundraisers</h2>

        <div className="add-item-btn-wrapper">
          <button className="add-item-btn" onClick={() => setShowForm(true)}>
            Add Your Item +
          </button>
        </div>

        <div className="store-grid">
          {storeItems.map(item => (
            <div className="store-card" key={item.id}>
              <img src={item.image} alt={item.title} className="store-image" />
              <h5>{item.title}</h5>
              <p className="item-description">{item.description}</p>
              <button className="buy-btn" onClick={() => setSelectedItem(item)}>View</button>
            </div>
          ))}
        </div>
      </div>

      {/* View Details Modal */}
      {selectedItem && (
        <div className="store-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={() => setSelectedItem(null)}>&times;</span>
            <img src={selectedItem.image} alt={selectedItem.title} />
            <h4>{selectedItem.title}</h4>
            <h6>{selectedItem.faculty}</h6>
            <p>{selectedItem.description}</p>
            <p>{selectedItem.price}</p>
            <p>{selectedItem.details}</p>
          </div>
        </div>
      )}

      {/* Add Item Form Modal */}
      {showForm && (
        <div className="store-modal1">
          <div className="modal-content1">
            <span className="close-modal" onClick={() => setShowForm(false)}>&times;</span>
            <h4>Add Your Fundraising Item</h4>
            <form className="add-item-form" onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Title" value={formValues.title} onChange={handleInputChange} required />
              <input type="text" name="faculty" placeholder="Faculty" value={formValues.faculty} onChange={handleInputChange} required />
              <input type="text" name="description" placeholder="Description" value={formValues.description} onChange={handleInputChange} required />
              <input type="text" name="price" placeholder="Price" value={formValues.price} onChange={handleInputChange} />
              <input type="text" name="details" placeholder="WhatsApp or Contact Details" value={formValues.details} onChange={handleInputChange} required />
              <input type="file" name="image" accept=".jpg,.jpeg,.png" onChange={handleInputChange} required />
              <button type="submit">Submit Item</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Store;
