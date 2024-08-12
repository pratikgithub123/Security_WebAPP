import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPasswordApi } from '../apis/Api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      email: email,
    };

    resetPasswordApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          navigate('/login'); 
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Server Error!");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="w-25">
        <h1 className='mb-4' style={{ color: 'green', textAlign: 'center' }}>Reset Your Password</h1>
        <form>
          <label style={{ color: 'green' }}>Email Address</label>
          <input
            onChange={changeEmail}
            className='form-control mb-2'
            type="email"
            placeholder='Enter your email'
            style={{ borderColor: 'green' }}
          />

          <button
            onClick={handleSubmit}
            className='btn btn-outline-success w-100'
            type='submit'
            style={{ backgroundColor: 'green', color: 'white' }}
          >
            Reset Password
          </button>
          <Link className='text-decoration-none text-black' to="/login">Back to Login</Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
