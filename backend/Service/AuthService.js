const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const OTPService = require("./OTPService");
const EmailService = require("./EmailService");
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

    // Check if email is verified
    if (!foundUser.isEmailVerified) {
      return res.status(403).json({
        msg: "Email not verified. Please verify your email to continue.",
        emailVerificationRequired: true,
        email: foundUser.email,
      });
    }

    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/auth/refresh-token",
      })
      .json({
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
      isEmailVerified: false,
    });

    // Generate and send OTP for email verification
    const otpResult = await OTPService.generateAndSendOTP(
      email,
      "registration"
    );

    if (!otpResult.success) {
      // If OTP sending fails, we still create the user but inform about the issue
      console.error("Failed to send verification OTP:", otpResult.message);
      return res.status(201).json({
        message:
          "User registered successfully, but failed to send verification email. Please try to verify later.",
        userEntity,
        emailSent: false,
        otpError: otpResult.message,
      });
    }

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification code.",
      userEntity,
      emailSent: true,
      requiresEmailVerification: true,
    });
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

// New OTP-related functions
const sendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const result = await OTPService.generateAndSendOTP(email, "registration");

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Send verification OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Verify OTP
    const result = await OTPService.verifyOTP(email, otp, "registration");

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Update user's email verification status
    const user = await User.findOneAndUpdate(
      { email },
      {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send welcome email
    EmailService.sendWelcomeEmail(email, user.name).catch(console.error);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user,
    });
  } catch (error) {
    console.error("Verify email OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const resendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists and is not verified
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const result = await OTPService.resendOTP(email, "registration");

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Resend verification OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const checkOTPStatus = async (req, res) => {
  try {
    const { email, purpose = "registration" } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result = await OTPService.checkOTPStatus(email, purpose);
    res.status(200).json(result);
  } catch (error) {
    console.error("Check OTP status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  handleLogout,
  handleProfileUpdate,
  refreshToken,
  sendVerificationOTP,
  verifyEmailOTP,
  resendVerificationOTP,
  checkOTPStatus,
};
