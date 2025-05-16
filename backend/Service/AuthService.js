const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const foundUser = await User.findOne({ email });
    if (!foundUser)
      return res.status(401).json({ msg: "Invalid email or password" });

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
      return res.status(401).json({ msg: "Invalid email or password" });

    const accessToken = jwt.sign(
      {
        userInfo: {
          id: foundUser._id,
          email: foundUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: "Login successful",
      user: {
        id: foundUser._id,
        email: foundUser.email,
        name: foundUser.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


const handleRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
    const duplicateUser = await User.findOne({ email: email });
    if (duplicateUser)
      return res.status(409).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userEntity = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: "user",
    });

    res
      .status(201)
      .json({ message: "User registered successfully.", userEntity });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleLogout = (req, res) => {

  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None', // or 'Strict' if you're not doing cross-site
  });

  return res.status(200).json({ msg: "Logout successful" });
};

const handleProfileUpdate = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userEmail = decoded?.emailInfo?.email;

    if (!userEmail) {
      return res.status(403).json({ msg: "Forbidden: Invalid token" });
    }

    // The updated fields come from frontend (e.g., { bio: "New bio" })
    const updates = req.body;

    // Prevent updating sensitive or restricted fields
    const restrictedFields = ["email", "username", "id", "followers", "following", "joinedDate"];
    for (const field of restrictedFields) {
      if (field in updates) {
        return res.status(400).json({ msg: `Cannot update field: ${field}` });
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ msg: "No update data provided" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({
      msg: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  handleLogout,
  handleProfileUpdate,
};
