const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
require("dotenv").config();

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });

    const foundUser = await User.findOne({ email });
    if (!foundUser)
      return res.status(401).json({ msg: "Invalid email or password" });

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
      return res.status(401).json({ msg: "Invalid email or password" });

    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    res.status(200).cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth/refresh-token'
    }).json({
      accessToken,
      user: foundUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const handleRegister = async (req, res) => {
  try {
    console.log(req.body);
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name,Username , email, and password are required." });
    }
    const duplicateUser = await User.findOne({ email: email });
    if (duplicateUser)
      return res.status(409).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userEntity = await User.create({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
      role: "user",
    });

    res
      .status(201)
      .json({ message: "User registered successfully.", userEntity });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleLogout = (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "None" });
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None", // or 'Strict' if you're not doing cross-site
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
    const restrictedFields = [
      "email",
      "username",
      "id",
      "followers",
      "following",
      "joinedDate",
    ];
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

const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });
};

module.exports = {
  handleLogin,
  handleRegister,
  handleLogout,
  handleProfileUpdate,
  refreshToken,
};
