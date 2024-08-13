import axios from 'axios';
import React, { useState } from 'react';
import './components/ProfilePage.css';

const ProfilePage = () => {
  // State to manage form data and error messages
  const [profileData, setProfileData] = useState({
    fullname: '',
    location: '',
    phonenum: '',
    email: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/user/update_profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess('Profile updated successfully');
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <div className="profile-page">
      <h2>Update Profile</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={profileData.fullname}
            onChange={handleInputChange}
            placeholder="Full Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={profileData.location}
            onChange={handleInputChange}
            placeholder="Location"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phonenum">Phone Number</label>
          <input
            type="text"
            id="phonenum"
            name="phonenum"
            value={profileData.phonenum}
            onChange={handleInputChange}
            placeholder="Phone Number"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
        </div>
        <button type="submit">Update Profile</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default ProfilePage;
