const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '3600' } 
  );
};

const createUser = async (req, res) => {
  console.log(req.body);

  const { fullname, location, phonenum, email, password } = req.body;

  if (!fullname || !location || !phonenum || !email || !password) {
    return res.json({
      success: false,
      message: "Please enter all the fields.",
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

const loginUser = async (req, res) => {
  console.log(req.body);

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

    const databasePassword = user.password;
    const isMatched = await bcrypt.compare(password, databasePassword);

    if (!isMatched) {
      return res.json({
        success: false,
        message: "Password Wrong.",
      });
    }

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

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

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

const getUsers = async (req, res) => {
  try {
    // Fetching all the users
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

const getUserProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id); // Corrected to use 'Users' model
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
  getUsers,
  getUserProfile,
  deleteUser,
};
