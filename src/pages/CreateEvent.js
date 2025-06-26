import React, { useState } from 'react';
import axios from '../axios';
import './CreateEvent.css';

function CreateEvent() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    university: '',
    faculty: '',
    date: '',
    time: '',
    type: '',
    location: '',
    audience: '',
    society: '',
    position: '',
    approver: '',
  });

  const [media, setMedia] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSuccessMessage('');

  try {
    const eventData = new FormData();
    Object.keys(formData).forEach(key => {
      eventData.append(key, formData[key]);
    });
    if (media) eventData.append('media', media);

    // Fetch CSRF token (only needed once per session usually)
    await axios.get('/sanctum/csrf-cookie');

    // ✅ Add `withCredentials: true` inside axios.post config
    await axios.post('/events', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    setSuccessMessage('Event details sent to approver.');
    setFormData({
      name: '', description: '', university: '', faculty: '', date: '',
      time: '', type: '', location: '', audience: '', society: '', position: '', approver: ''
    });
    setMedia(null);
  } catch (error) {
    console.error('❌ Event creation failed:', error.response?.data || error.message);
    alert('Failed to create event.');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="create-event-container">
      <div className="create-left">
        <img src="/react/assets/creation-img.png" alt="Illustration" className="event-image" />
      </div>

      <div className="create-right">
        <h1 className="logo">UniHub</h1>
        <p className="subtitle">Welcome to UniHub! Create events and share with your peers!</p>

        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Event Name :" required />
            <input name="description" value={formData.description} onChange={handleInputChange} placeholder="Description:" />
          </div>

          <div className="form-row">
            <select name="university" value={formData.university} onChange={handleInputChange} required>
              <option value="">Select your University:</option>
              <option value="kelaniya">University of Kelaniya</option>
              <option value="colombo">University of Colombo</option>
              <option value="peradeniya">University of Peradeniya</option>
              <option value="japura">University of Jayawardhanapura</option>
              <option value="moratuwa">University of Moratuwa</option>
              <option value="rajarata">University of Rajarata</option>
              <option value="eastern">Eastern University</option>
            </select>

            <select name="faculty" value={formData.faculty} onChange={handleInputChange}>
              <option value="">Select your Faculty:</option>
              <option value="fct">Faculty of Computing and Technology</option>
              <option value="humanities">Faculty of Humanities</option>
              <option value="social">Faculty of Social Science</option>
              <option value="physical">Faculty of Physical Science</option>
              <option value="management">Faculty of Management</option>
            </select>
          </div>

          <div className="form-row">
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
            <input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
          </div>

          <div className="form-row">
            <select name="type" value={formData.type} onChange={handleInputChange} required>
              <option value="">Event Type:</option>
              <option value="physical">Physical</option>
              <option value="online">Online</option>
            </select>

            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder={formData.type === 'online' ? "Meeting Link (Zoom, Google Meet, etc)" : "Location:"}
              required={formData.type === 'physical'}  // ✅ make it required only if physical
            />
          </div>

          <div className="form-row media-upload">
            <textarea placeholder={media?.name || "Add media:"} readOnly />
            <input
              type="file"
              id="mediaUpload"
              accept=".jpg, .jpeg, .png"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <div
              className="media-plus"
              onClick={() => document.getElementById('mediaUpload').click()}
            >
              +
            </div>
          </div>

          <div className="form-row">
            <select name="audience" value={formData.audience} onChange={handleInputChange} required>
              <option value="">Audience Type:</option>
              <option value="all">Open to all</option>
              <option value="Only-for-University-students">Only for University students</option>
              <option value="Only-for-faculty-students">Only for faculty students</option>
            </select>

            <select name="society" value={formData.society} onChange={handleInputChange} required>
              <option value="ITSA-society">ITSA</option>
              <option value="ETSA-society">ETSA</option>
              <option value="CSSA-society">CSSA</option>
              <option value="FOSS-society">FOSS</option>
              <option value="Legion-society">Legion</option>
              <option value="AISEC-society">AIESEC</option>
              <option value="LEO-society">Leo Club</option>
              <option value="Union">Union</option>
              <option value="ISACA-society">ISACA</option>
              <option value="By-Faculty">By Faculty</option>
            </select>

            <select name="position" value={formData.position} onChange={handleInputChange} required>
              <option value="">Your Position in Society:</option>
              <option value="president">President</option>
              <option value="vicepresident">Vice President</option>
              <option value="secretary">Secretary</option>
              <option value="assistantsecretary">Assistant Secretary</option>
              <option value="juniortreasurer">Junior Treasurer</option>
              <option value="coeditor">Co-Editor</option>
              <option value="committeemember">Committee Member</option>
              <option value="member">Member</option>
              <option value="organizingcommittee">Organizing Committee</option>
            </select>

            <select name="approver" value={formData.approver} onChange={handleInputChange} required>
              <option value="">Event Approver:</option>
              <option value="president">President</option>
              <option value="vicepresident">Vice President</option>
              <option value="seniortreasurer">Senior Treasurer</option>
            </select>
          </div>

          <div className="form-row button-row" style={{ flexDirection: 'column', alignItems: 'center' }}>
            <button type="submit" className="create-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Pending...
                </>
              ) : (
                "Create Event"
              )}
            </button>

            {successMessage && (
              <div className="success-message">
                ✅ {successMessage}
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateEvent;