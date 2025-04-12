import React, { useState } from 'react';
import axios from 'axios';

function ImageUploader({ initialImage, onImageChange }) {
  const [image, setImage] = useState(initialImage || "https://raw.githubusercontent.com/bumbeishvili/sample-data/main/images/empty-icon.png");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload the image to your server
      const response = await axios.post('https://family-tree-backend-2.onrender.com/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Get the image URL from response
      const imageUrl = response.data.imageUrl;
      
      // Update state and parent component
      setImage(imageUrl);
      if (onImageChange) {
        onImageChange(imageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-uploader">
      <div 
        style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%',
          overflow: 'hidden',
          margin: '0 auto 10px',
          border: '2px solid #ddd',
          position: 'relative'
        }}
      >
        <img 
          src={image} 
          alt="Profile" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} 
        />
        
        {uploading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white'
          }}>
            Uploading...
          </div>
        )}
      </div>
      
      <input
        type="file"
        id="profile-image"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      
      <label 
        htmlFor="profile-image" 
        style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: '#278B8D',
          color: 'white',
          borderRadius: '4px',
          cursor: 'pointer',
          textAlign: 'center',
          margin: '0 auto',
          fontSize: '14px'
        }}
      >
        {uploading ? 'Uploading...' : 'Change Image'}
      </label>
      
      {error && (
        <div style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;