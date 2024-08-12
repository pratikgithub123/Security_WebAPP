import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteUserApi, getAllUsersApi } from '../../apis/Api';

const AdminDashboardUserDetails = () => {
  // State for users
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log('Fetching users...');
    getAllUsersApi()
      .then((res) => {
        console.log('Users fetched:', res);
        setUsers(res.users);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users. Please try again.');
      });
  }, []);

  // Delete user function
  const handleDeleteUser = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) {
      return;
    }

    deleteUserApi(id)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setUsers(users.filter((user) => user._id !== id));
        }
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user. Please try again.');
      });
  };

  return (
    <>
      <div className="m-5">
        <div className="d-flex justify-content-between">
          <h1>Admin Dashboard</h1>
          <Link to="/admin/dashboard" className="productdetails">
            Product Details <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px' }} />
          </Link>
          <Link to="/admin/dashboardorder" className="productdetails">
            Order Details <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px' }} />
          </Link>
        </div>

        {/* Users Table */}
        <div>
          <h2>Customer Details</h2>
          <table className="table">
            {/* Table Header */}
            <thead className="table-dark">
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.location}</td>
                  <td>{user.phonenum}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user._id)} type="button" className="btn btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardUserDetails;
