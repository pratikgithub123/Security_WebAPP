import { faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart } from '../apis/Api'; // Function to fetch cart data
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [uniqueProductCount, setUniqueProductCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const fetchCartData = () => {
      if (user) {
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
        setUniqueProductCount(0); // Ensure count is 0 if no user is logged in
      }
    };

    fetchCartData(); // Fetch initially
    const interval = setInterval(fetchCartData, 100); // Fetch every 10 seconds

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
      {user && !user.isAdmin ? (
        <Link to={`/cart/${user._id}`} className='cart-container'>
          <FontAwesomeIcon icon={faShoppingCart} className='cart' />
          {uniqueProductCount > 0 && <span className='cart-quantity'>{uniqueProductCount}</span>}
        </Link>
      ) : (
        user ? null : (
          <Link to="/login" className='cart-container'>
            <FontAwesomeIcon icon={faShoppingCart} className='cart' />
          </Link>
        )
      )}
    </div>
  );
};

export default Navbar;
