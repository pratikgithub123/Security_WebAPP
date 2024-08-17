import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerApi } from '../apis/Api';
import bottomLeftImage from '../assets/bottomleft.png';
import topRightImage from '../assets/topright.png';
import './components/Register.css';

const Register = () => {
  const [fullname, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [phonenum, setPhoneNum] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!fullname) newErrors.fullname = 'Full name is required';
    if (!location) newErrors.location = 'Location is required';
    if (!phonenum) newErrors.phonenum = 'Phone number is required';
    else if (phonenum.length !== 10) newErrors.phonenum = 'Phone number should be exactly 10 digits';
    if (!email) newErrors.email = 'Email is required';
    else if (!email.includes('@gmail.com')) newErrors.email = 'Please enter a valid Gmail address';
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

    const data = { fullname, location, phonenum, email, password };
    registerApi(data)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message, {
            position: "top-center",
          });
          navigate('/login');
        } else {
          toast.error(res.data.message, {
            position: "top-center",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Internal Server Error!', {
          position: "top-center",
        });
      });
  };

  return (
    <div className="register-container">
      
      <div className="register-form-container">
        <h1 className="register-title">Create an Account!</h1>
        <form>
          {/* Form Fields */}
          <label className="register-label">Full Name</label>
          <div className="input-group mb-2">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullname}
              className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
              type="text"
              placeholder="Enter your Full Name"
            />
            {errors.fullname && <div className="invalid-feedback">{errors.fullname}</div>}
          </div>

          <label className="register-label">Location</label>
          <div className="input-group mb-2">
            <span className="input-group-text">
              <FaMapMarkerAlt />
            </span>
            <input
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              className={`form-control ${errors.location ? 'is-invalid' : ''}`}
              type="text"
              placeholder="Enter your location"
            />
            {errors.location && <div className="invalid-feedback">{errors.location}</div>}
          </div>

          <label className="register-label">Phone Number</label>
          <div className="input-group mb-2">
            <span className="input-group-text">
              <FaPhone />
            </span>
            <input
              onChange={(e) => {
                const input = e.target.value.replace(/\D/g, '');
                setPhoneNum(input.slice(0, 10));
              }}
              value={phonenum}
              className={`form-control ${errors.phonenum ? 'is-invalid' : ''}`}
              type="text"
              placeholder="Enter your phone number"
            />
            {errors.phonenum && <div className="invalid-feedback">{errors.phonenum}</div>}
          </div>

          <label className="register-label">Email</label>
          <div className="input-group mb-2">
            <span className="input-group-text">
              <FaEnvelope />
            </span>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              type="email"
              placeholder="Enter your email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <label className="register-label">Password</label>
          <div className="input-group mb-2">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              type="password"
              placeholder="Enter your password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <button
            onClick={handleSubmit}
            className="register-button"
          >
            Register
          </button>

          <Link className="login-register-link" to="/login">
            Already have an account? Log in
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
