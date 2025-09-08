import React, { useState } from 'react';
import axios from '../axios';
import './EventMediaUpload.css';
import { useParams } from 'react-router-dom';

function EventMediaUpload() {
  const { id: eventId } = useParams(); // ✅ Get event ID from route like /event/61

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'image') setImages(files);
    if (type === 'video') setVideos(files);
  };

  const handleUpload = async () => {
    if (images.length === 0 && videos.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    setUploading(true);
    setSuccess('');

    const formData = new FormData();
    formData.append('event_id', eventId); // ✅ Correct event_id

    images.forEach((img, i) => formData.append(`images[${i}]`, img));
    videos.forEach((vid, i) => formData.append(`videos[${i}]`, vid));

    try {
      await axios.post('/event-media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('✅ Media uploaded successfully!');
      setImages([]);
      setVideos([]);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('Failed to upload media.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-box">
      <h3>Upload Event Images and Videos</h3>
      <p>Max size: 5MB per image, 20MB per video</p>

      <div className="upload-row">
        <div className="upload-group">
          <label>📷 Select Images</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={(e) => handleFileChange(e, 'image')}
          />
        </div>

        <div className="upload-group">
          <label>🎥 Select Videos</label>
          <input
            type="file"
            accept="video/mp4,video/mkv,video/webm"
            multiple
            onChange={(e) => handleFileChange(e, 'video')}
          />
        </div>
      </div>

      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Media'}
      </button>

      {success && <p className="success-message">{success}</p>}
    </div>
  );
}

export default EventMediaUpload;
