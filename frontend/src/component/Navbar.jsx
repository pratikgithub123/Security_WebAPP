import { faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import { getCart } from '../apis/Api'; // Function to fetch cart data
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [uniqueProductCount, setUniqueProductCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success('You have successfully logged out.', {
      position: "top-center", // Position the toast in the center of the top
    }); // Show success toast
    navigate('/login');
  };

  const handleCartClick = () => {
    if (!user) {
      toast.warn('Please log in to view your cart.', {
        position: "top-center", // Position the toast in the center of the top
      });
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchCartData = () => {
      if (user && !user.isAdmin) { // Only fetch cart data for non-admin users
        getCart(user._id)
          .then(response => {
            if (response.success) {
              const uniqueProducts = response.cart.items.length;
              setUniqueProductCount(uniqueProducts);
            } else {
              setUniqueProductCount(0); // Ensure count is 0 if no cart is found
            }
          })
          .catch(error => {
            console.error('Error fetching cart:', error);
            setUniqueProductCount(0); // Reset count on error
          });
      } else {
        setUniqueProductCount(0); // Ensure count is 0 if no user is logged in or user is admin
      }
    };

    fetchCartData(); // Fetch initially
    const interval = setInterval(fetchCartData, 100); // Adjusted interval to every 100 miliseconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [user]);

  return (
    <div className='navbar'>
      <Link to="/">
        <img src={logo} alt="logo" className='logo' />
      </Link>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        
        {user && !user.isAdmin && ( // Render Orders link only if not an admin
          <li>
            <Link to="/orders">Orders</Link>
          </li>
        )}
        {user ? (
          <>
            {user.isAdmin && (
              <li className="dropdown">
                <div className="dropdown-content">
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                </div>
              </li>
            )}
            
            <li>
              {user.isAdmin ? (
                <span>Welcome Admin, {user.fullname}</span>
              ) : (
                <span>Welcome, {user.fullname}</span>
              )}
            </li>
            <li onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Registration</Link>
            </li>
          </>
        )}
      </ul>
      {!user?.isAdmin && ( // Render cart icon only if not an admin
        <Link to={`/cart/${user?._id}`} className='cart-container' onClick={handleCartClick}>
          <FontAwesomeIcon icon={faShoppingCart} className='cart' />
          {uniqueProductCount > 0 && <span className='cart-quantity'>{uniqueProductCount}</span>}
        </Link>
      )}
    </div>
  );
};

export default Navbar;
