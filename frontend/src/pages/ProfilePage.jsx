// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfileApi } from '../apis/Api'; // Function to fetch user profile data
import './components/ProfilePage.css'; // Add CSS for styling if needed

const ProfilePage = () => {
  const { userId } = useParams(); // Get the user ID from the URL
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='profile-page'>
      <h1>User Profile</h1>
      {userProfile ? (
        <div>
          <p><strong>Full Name:</strong> {userProfile.fullname}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>Phone Number:</strong> {userProfile.phonenum}</p>
          <p><strong>Location:</strong> {userProfile.location}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <p>User profile not found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
