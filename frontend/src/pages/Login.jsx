import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guestLoginApi, loginApi } from '../apis/Api';
import bottomLeftImage from '../assets/bottomleft.png';
import topRightImage from '../assets/topright.png';
import './components/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const changeEmail = (e) => setEmail(e.target.value);
    const changePassword = (e) => setPassword(e.target.value);

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
    
        loginApi({ email, password })
            .then((res) => {
                if (!res.data.success) {
                    if (res.data.lockoutEndTime) {
                        const lockoutEndTime = new Date(res.data.lockoutEndTime);
                        const remainingTime = Math.max(lockoutEndTime - new Date(), 0);
                        const remainingMinutes = Math.floor(remainingTime / 60000);
                        const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);
    
                        let message = `Account is locked. Please try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
                        if (remainingSeconds > 0) {
                            message += ` and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}.`;
                        } else {
                            message += '.';
                        }
    
                        toast.error(message, {
                            position: "top-center",
                        });
                    } else if (res.data.message === 'Account does not exist') {
                        toast.error('Account does not exist. Please register first.', {
                            position: "top-center",
                        });
                    } else if (res.data.message === 'Incorrect password') {
                        toast.error('Incorrect password. Please try again.', {
                            position: "top-center",
                        });
                    } else {
                        toast.error(res.data.message, {
                            position: "top-center",
                        });
                    }
                } else {
                    toast.success('Login successful!', {
                        position: "top-center",
                    });
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.userData));
                    navigate('/');
                }
            })
            .catch(() => toast.error('Server Error!', {
                position: "top-center",
            }));
    };
    

    const handleGuestLogin = () => {
        guestLoginApi()
            .then((res) => {
                if (res.data.success) {
                    toast.success('Logged in as guest', {
                        position: "top-center", // Position the toast in the center of the top
                    });
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.userData));
                    navigate('/');
                } else {
                    toast.error(res.data.message || 'Guest login failed', {
                        position: "top-center", // Position the toast in the center of the top
                    });
                }
            })
            .catch(() => toast.error('Server Error!'));
    };

    return (
        <div className="login-container">
            
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
                            value={email}
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
                            value={password}
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
                    <button
                        onClick={handleGuestLogin}
                        className="btn btn-outline-primary w-100 login-button mt-2"
                        type="button"
                    >
                        Login as Guest
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
