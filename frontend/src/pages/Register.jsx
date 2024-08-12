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
  const navigate = useNavigate();

  const changeFullName = (e) => {
    setFullName(e.target.value);
  };

  const changeLocation = (e) => {
    setLocation(e.target.value);
  };

  const changePhoneNum = (e) => {
    const input = e.target.value;
    // Replace any non-digit characters with an empty string
    const formattedInput = input.replace(/\D/g, '');
    // Limit to 10 digits
    const limitedInput = formattedInput.slice(0, 10);
    setPhoneNum(limitedInput);
  };

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple form validation
    if (!fullname || !location || !phonenum || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Check if email contains "@gmail.com"
    if (!email.includes('@gmail.com')) {
      toast.error('Please enter a valid Gmail address.');
      return;
    }

    // Check if phone number is exactly 10 digits
    if (phonenum.length !== 10) {
      toast.error('Phone number should be exactly 10 digits.');
      return;
    }

    const data = {
      fullname: fullname,
      location: location,
      phonenum: phonenum,
      email: email,
      password: password,
    };

    registerApi(data)
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res.data.message);
          navigate('/login');
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Internal Server Error!');
      });
  };

  return (
    <div className="register-container">
      <img src={topRightImage} alt="Top Right" className="top-right-image" />
      <img src={bottomLeftImage} alt="Bottom Left" className="bottom-left-image" />
      <div className="register-form-container">
        <h1 className='m-3 register-title'> Create an Account!</h1>
        <form>
          <label className="register-label">Full Name</label>
          <div className="input-group mb-2">
            <span className="input-group-text" style={{ borderColor: 'black' }}>
              <FaUser />
            </span>
            <input
              onChange={changeFullName}
              value={fullname}
              className='form-control'
              type="text"
              placeholder='Enter your Full Name'
              style={{ borderColor: 'black' }}
            />
          </div>

          <label className="register-label">Location</label>
          <div className="input-group mb-2">
            <span className="input-group-text" style={{ borderColor: 'black' }}>
              <FaMapMarkerAlt />
            </span>
            <input
              onChange={changeLocation}
              value={location}
              className='form-control'
              type="text"
              placeholder='Enter your location'
              style={{ borderColor: 'black' }}
            />
          </div>

          <label className="register-label">Phone Number</label>
          <div className="input-group mb-2">
            <span className="input-group-text" style={{ borderColor: 'black' }}>
              <FaPhone />
            </span>
            <input
              onChange={changePhoneNum}
              value={phonenum}
              className='form-control'
              type="text"
              placeholder='Enter your phone number'
              style={{ borderColor: 'black' }}
            />
          </div>

          <label className="register-label">Email</label>
          <div className="input-group mb-2">
            <span className="input-group-text" style={{ borderColor: 'black' }}>
              <FaEnvelope />
            </span>
            <input
              onChange={changeEmail}
              value={email}
              className='form-control'
              type="email"
              placeholder='Enter your email'
              style={{ borderColor: 'black' }}
            />
          </div>

          <label className="register-label">Password</label>
          <div className="input-group mb-2">
            <span className="input-group-text" style={{ borderColor: 'black' }}>
              <FaLock />
            </span>
            <input
              onChange={changePassword}
              value={password}
              className='form-control'
              type="password"
              placeholder='Enter your password'
              style={{ borderColor: 'black' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            className='btn btn-outline-success w-100 login-buttonyy'
            style={{ backgroundColor: 'black', color: 'white' }}
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
