import React, { useState } from 'react';

const ProfilePicture = ({ currentPicture, adminId, onUpdateSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (e.g., 5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      setError('File size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", adminId);

    try {
      const response = await fetch('http://localhost:8080/api/profile/admin/uploadProfilePicture', {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      // Fetch the updated picture
      const pictureResponse = await fetch(`http://localhost:8080/api/profile/admin/getProfilePicture/${adminId}`);
      const pictureBlob = await pictureResponse.blob();
      const newProfilePictureUrl = URL.createObjectURL(pictureBlob);
      
      // Call the success callback with the new picture URL
      onUpdateSuccess(newProfilePictureUrl);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="profile-picture-container">
      <img 
        src={currentPicture || '/default.png'} 
        alt="Profile" 
        className="profile-picture"
      />
      <div className="upload-button-container">
        <label className="upload-button">
          {isUploading ? 'Uploading...' : 'Upload'}
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*"
            style={{ display: "none" }}
            disabled={isUploading}
          />
        </label>
      </div>
      {error && <div className="error-message text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default ProfilePicture;