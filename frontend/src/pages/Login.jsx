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

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    loginApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
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
              className="form-control login-input"
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <label className="login-label">Password</label>
          <div className="input-group mb-2">
            <span className="input-group-text login-input-icon">
              <FaLock />
            </span>
            <input
              onChange={changePassword}
              className="form-control login-input"
              type="password"
              placeholder="Enter your password"
            />
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
