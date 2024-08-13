const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    phonenum: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email uniqueness
    },
    password: {
        type: String,
        required: true,
    },
    passwordHistory: [{
        type: String, // Store hashed versions of previous passwords
    }],
    passwordUpdatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    lockoutUntil: {
        type: Date,
        default: null,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    }],
});

// Method to check if the password is expired
userSchema.methods.isPasswordExpired = function() {
    // Password expiry: 90 days
    const expiryDate = new Date(this.passwordUpdatedAt);
    expiryDate.setDate(expiryDate.getDate() + 90);
    return new Date() > expiryDate;
};

// Method to check if the password is reused
userSchema.methods.isPasswordReused = function(newPassword) {
    // Check against last 5 passwords
    return this.passwordHistory.includes(newPassword);
};

// Method to handle failed login attempts
userSchema.methods.incrementFailedAttempts = async function() {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= 5) {
        // Lockout period: 1 minutes
        this.lockoutUntil = new Date(Date.now() + 1 * 60 * 1000);
    }
    await this.save();
};

// Method to reset failed login attempts
userSchema.methods.resetFailedAttempts = async function() {
    this.failedLoginAttempts = 0;
    this.lockoutUntil = null;
    await this.save();
};

// Method to check if the user is locked out
userSchema.methods.isLockedOut = function() {
    // If lockoutUntil is null or in the past, the user is not locked out
    return this.lockoutUntil && new Date() < this.lockoutUntil;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
