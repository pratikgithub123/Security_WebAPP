const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Utility to validate password complexity
const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8 || password.length > 12) {
    errors.push("Password must be between 8 and 12 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must include at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must include at least one lowercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must include at least one number.");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must include at least one special character (e.g., !@#$%^&*).");
  }

  return errors;
};

// Create JWT token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '3600' } 
  );
};

// Register a new user
const createUser = async (req, res) => {
  const { fullname, location, phonenum, email, password } = req.body;

  if (!fullname || !location || !phonenum || !email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    return res.json({
      success: false,
      message: passwordErrors.join(" "),
    });
  }

  try {
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists.",
      });
    }

    const randomSalt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, randomSalt);

    const newUser = new Users({
      fullname: fullname,
      location: location,
      phonenum: phonenum,
      email: email,
      password: encryptedPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Account Created Successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "Account does not exist.",
      });
    }

    if (user.isLockedOut()) {
      return res.json({
        success: false,
        message: "Account is locked. For 30 Minutes.",
      });
    }

    if (user.isPasswordExpired()) {
      return res.json({
        success: false,
        message: "Password expired. Please reset your password.",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      await user.incrementFailedAttempts();
      return res.json({
        success: false,
        message: "Password Wrong.",
      });
    }

    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;
    await user.save();

    const token = createToken(user);

    res.status(200).json({
      success: true,
      message: "You logged In Successfully.",
      token: token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "Account does not exist.",
      });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '5h',
    });

    res.status(200).json({
      success: true,
      message: "Reset token generated successfully.",
      resetToken: resetToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

// Change user password
const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.json({
      success: false,
      message: "Please provide both old and new passwords.",
    });
  }

  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    return res.json({
      success: false,
      message: passwordErrors.join(" "),
    });
  }

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    }

    if (await user.isPasswordReused(newPassword)) {
      return res.json({
        success: false,
        message: "New password cannot be the same as one of the last 5 passwords.",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Old password is incorrect.",
      });
    }

    const randomSalt = await bcrypt.genSalt(10);
    const encryptedNewPassword = await bcrypt.hash(newPassword, randomSalt);
    user.password = encryptedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await Users.find({}, { password: 0 }); 

    res.status(200).json({
      success: true,
      message: "User data fetched successfully.",
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await Users.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      deletedUser: deletedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  resetPassword,
  changePassword,
  getUsers,
  getUserProfile,
  deleteUser,
};
