import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginApi } from '../apis/Api';
import bottomLeftImage from '../assets/bottomleft.png';
import topRightImage from '../assets/topright.png';
import './components/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const data = {
      email: email,
      password: password,
    };
  
    loginApi(data)
      .then((res) => {
        if (res.data.success === false) {
          if (res.data.lockoutEndTime) {
            const lockoutEndTime = new Date(res.data.lockoutEndTime);
            const currentTime = new Date();
            const remainingTime = Math.max(lockoutEndTime - currentTime, 0);
            
            // Calculate remaining minutes and seconds
            const remainingMinutes = Math.floor(remainingTime / 60000);
            const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);
  
            let message = `Account is locked. For ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
            if (remainingSeconds > 0) {
              message += ` and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}.`;
            } else {
              message += '.';
            }
  
            toast.error(message);
          } else {
            toast.error(res.data.message);
          }
        } else {
          toast.success(res.data.message);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.userData));
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Server Error!');
      });
  };
  

  return (
    <div className="login-container">
      <img src={topRightImage} alt="Top Right" className="top-right-image" />
      <img src={bottomLeftImage} alt="Bottom Left" className="bottom-left-image" />
      <div className="login-form-container">
        <h1 className="login-title">Please Log in First!</h1>
        <form>
          <label className="login-label">Email</label>
          <div className="input-group mb-2">
            <span className="input-group-text login-input-icon">
              <FaEnvelope />
            </span>
            <input
              onChange={changeEmail}
              className={`form-control login-input ${errors.email ? 'is-invalid' : ''}`}
              type="email"
              placeholder="Enter your email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <label className="login-label">Password</label>
          <div className="input-group mb-2">
            <span className="input-group-text login-input-icon">
              <FaLock />
            </span>
            <input
              onChange={changePassword}
              className={`form-control login-input ${errors.password ? 'is-invalid' : ''}`}
              type="password"
              placeholder="Enter your password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <button
            onClick={handleSubmit}
            className="btn btn-outline-success w-100 login-button"
            type="submit"
          >
            Login
          </button>
          <Link className="login-register-link" to="/register">
            Create a new account?
          </Link>
          <br />
        </form>
      </div>
    </div>
  );
};

export default Login;
