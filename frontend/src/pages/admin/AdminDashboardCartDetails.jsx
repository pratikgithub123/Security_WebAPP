import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllCartsApi, getAllUsersApi } from '../../apis/Api';

const AdminDashboardCartDetails = () => {
  const [users, setUsers] = useState([]);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await getAllUsersApi();
        setUsers(usersResponse.data.users);
        
        const cartsResponse = await getAllCartsApi();
        setCarts(cartsResponse.data.carts);

        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data. Please try again.');
        toast.error('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserById = (userId) => {
    return users.find(user => user._id === userId);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="m-5">
      <div className="d-flex justify-content-between">
        <h1>Cart Details</h1>
        <Link to="/admin/dashboard" className="productdetails">
          Product Details <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px' }} />
        </Link>
        <Link to="/admin/dashboarduser" className="productdetails">
          User Details <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px' }} />
        </Link>
      </div>

      <div>
        <h2>Cart Details with User Info</h2>
        <table className="table">
          <thead className="table-dark">
            <tr>
              <th>User Full Name</th>
              <th>User Email</th>
              <th>Cart Items</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => {
              const user = getUserById(cart.userId);

              return (
                <tr key={cart._id}>
                  <td>{user ? user.fullname : 'N/A'}</td>
                  <td>{user ? user.email : 'N/A'}</td>
                  <td>
                    {cart.items.map((item) => (
                      <div key={item.productId}>
                        {item.productName} (Qty: {item.quantity})
                      </div>
                    ))}
                  </td>
                  <td>Rs.{cart.totalPrice}</td>
                  <td>
                    {/* Add any actions here if needed */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardCartDetails;
