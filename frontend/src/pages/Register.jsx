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

  const changeFullName = (e) => setFullName(e.target.value);
  const changeLocation = (e) => setLocation(e.target.value);
  const changePhoneNum = (e) => {
    const input = e.target.value.replace(/\D/g, '');
    setPhoneNum(input.slice(0, 10));
  };
  const changeEmail = (e) => setEmail(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullname || !location || !phonenum || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (!email.includes('@gmail.com')) {
      toast.error('Please enter a valid Gmail address.');
      return;
    }
    if (phonenum.length !== 10) {
      toast.error('Phone number should be exactly 10 digits.');
      return;
    }

    const data = { fullname, location, phonenum, email, password };
    registerApi(data)
      .then((res) => {
        if (res.data.success) {
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
        <h1 className="register-title">Create an Account!</h1>
        <form>
          {/* Form Fields */}
          <label className="register-label">Full Name</label>
          <div className="input-group mb-2">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              onChange={changeFullName}
              value={fullname}
              className="form-control"
              type="text"
              placeholder="Enter your Full Name"
            />
          </div>

          <label className="register-label">Location</label>
          <div className="input-group mb-2">
            <span className="input-group-text">
              <FaMapMarkerAlt />
            </span>
            <input
              onChange={changeLocation}
              value={location}
              className="form-control"
              type="text"
              placeholder="Enter your location"
            />
          </div>

          <label className="register-label">Phone Number</label>
          <div className="input-group mb-2">
            <span className="input-group-text">
              <FaPhone />
            </span>
            <input
              onChange={changePhoneNum}
              value={phonenum}
              className="form-control"
              type="text"
              placeholder="Enter your phone number"
            />
          </div>

          <label className="register-label">Email</label>
          <div className="input-group mb-2">
            <span className="input-group-text">
              <FaEnvelope />
            </span>
            <input
              onChange={changeEmail}
              value={email}
              className="form-control"
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <label className="register-label">Password</label>
          <div className="input-group mb-2">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              onChange={changePassword}
              value={password}
              className="form-control"
              type="password"
              placeholder="Enter your password"
            />
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
