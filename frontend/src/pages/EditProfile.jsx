// src/pages/EditProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserProfileApi, updateUserProfileApi } from '../apis/Api'; // Import the API functions
import './components/EditProfilePage.css';

const EditProfilePage = () => {
  const { userId } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    fullname: '',
    location: '',
    phonenum: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfileApi(userId); // Fetch user profile data
        setUserProfile(response);
      } catch (error) {
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfileApi(userId, userProfile);
      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => navigate(`/profile/${userId}`), 2000); // Navigate back to profile after 2 seconds
    } catch (error) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='edit-profile-page'>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            type='text'
            name='fullname'
            value={userProfile.fullname}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type='email'
            name='email'
            value={userProfile.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Phone Number:
          <input
            type='text'
            name='phonenum'
            value={userProfile.phonenum}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Location:
          <input
            type='text'
            name='location'
            value={userProfile.location}
            onChange={handleChange}
            required
          />
        </label>
        {error && <p className='error'>{error}</p>}
        {successMessage && <p className='success'>{successMessage}</p>}
        <button type='submit'>Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfilePage;
