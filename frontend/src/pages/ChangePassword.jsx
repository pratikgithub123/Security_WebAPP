import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { changePasswordApi } from '../apis/Api';
import './components/ChangePassword.css'; // Create this CSS file for styling

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({});

    const changeCurrentPassword = (e) => setCurrentPassword(e.target.value);
    const changeNewPassword = (e) => setNewPassword(e.target.value);
    const changeConfirmNewPassword = (e) => setConfirmNewPassword(e.target.value);

    const validateForm = () => {
        const newErrors = {};
        if (!currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!newPassword) newErrors.newPassword = 'New password is required';
        else if (newPassword.length < 8) newErrors.newPassword = 'New password must be at least 8 characters long';
        if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = 'New passwords do not match';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        changePasswordApi({ currentPassword, newPassword })
            .then((res) => {
                if (res.data.success) {
                    toast.success('Password changed successfully!', {
                        position: "top-center",
                    });
                } else {
                    toast.error(res.data.message || 'Failed to change password', {
                        position: "top-center",
                    });
                }
            })
            .catch(() => toast.error('Server Error!', {
                position: "top-center",
            }));
    };

    return (
        <div className="change-password-container">
            <h1 className="change-password-title">Change Your Password</h1>
            <form>
                <label className="change-password-label">Current Password</label>
                <div className="input-group mb-2">
                    <span className="input-group-text change-password-input-icon">
                        <FaLock />
                    </span>
                    <input
                        onChange={changeCurrentPassword}
                        value={currentPassword}
                        className={`form-control change-password-input ${errors.currentPassword ? 'is-invalid' : ''}`}
                        type="password"
                        placeholder="Enter your current password"
                    />
                    {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
                </div>

                <label className="change-password-label">New Password</label>
                <div className="input-group mb-2">
                    <span className="input-group-text change-password-input-icon">
                        <FaLock />
                    </span>
                    <input
                        onChange={changeNewPassword}
                        value={newPassword}
                        className={`form-control change-password-input ${errors.newPassword ? 'is-invalid' : ''}`}
                        type="password"
                        placeholder="Enter your new password"
                    />
                    {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                </div>

                <label className="change-password-label">Confirm New Password</label>
                <div className="input-group mb-2">
                    <span className="input-group-text change-password-input-icon">
                        <FaLock />
                    </span>
                    <input
                        onChange={changeConfirmNewPassword}
                        value={confirmNewPassword}
                        className={`form-control change-password-input ${errors.confirmNewPassword ? 'is-invalid' : ''}`}
                        type="password"
                        placeholder="Confirm your new password"
                    />
                    {errors.confirmNewPassword && <div className="invalid-feedback">{errors.confirmNewPassword}</div>}
                </div>

                <button
                    onClick={handleSubmit}
                    className="btn btn-outline-primary w-100 change-password-button"
                    type="submit"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
