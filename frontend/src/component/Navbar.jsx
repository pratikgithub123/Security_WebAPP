import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCart } from '../apis/Api';
import logo from '../assets/logo.png';
import './Navbar.css';
import { faShoppingCart, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Navbar = () => {
  const [uniqueProductCount, setUniqueProductCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleCartClick = () => {
    if (!user) {
      toast.warn('Please log in to view your cart.');
      navigate('/login');
    }
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
              setUniqueProductCount(0);
            }
          })
          .catch(error => {
            console.error('Error fetching cart:', error);
            setUniqueProductCount(0);
          });
      } else {
        setUniqueProductCount(0);
      }
    };

    fetchCartData(); 
    const interval = setInterval(fetchCartData, 100); 

    return () => clearInterval(interval);
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
        
        {user && !user.isAdmin && (
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
            <li>
              <Link to="/profile">
                <FontAwesomeIcon icon={faUser} className='profile-icon' />
              </Link>
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
        <Link to={`/cart/${user._id}`} className='cart-container' onClick={handleCartClick}>
          <FontAwesomeIcon icon={faShoppingCart} className='cart' />
          {uniqueProductCount > 0 && <span className='cart-quantity'>{uniqueProductCount}</span>}
        </Link>
      ) : (
        <Link to="/login" className='cart-container' onClick={handleCartClick}>
          <FontAwesomeIcon icon={faShoppingCart} className='cart' />
        </Link>
      )}
    </div>
  );
};

export default Navbar;
