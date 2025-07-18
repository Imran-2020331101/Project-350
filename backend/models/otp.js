const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
    enum: [
      "registration",
      "password_reset",
      "email_verification",
      "login_verification",
    ],
    default: "registration",
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function () {
      return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient queries
otpSchema.index({ email: 1, purpose: 1 });

// TTL index to automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate OTP
otpSchema.statics.generateOTP = function (length = 6) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

// Static method to create new OTP
otpSchema.statics.createOTP = async function (email, purpose = "registration") {
  // Delete any existing OTPs for this email and purpose
  await this.deleteMany({ email, purpose });

  const otp = this.generateOTP();
  const otpDoc = new this({
    email,
    otp,
    purpose,
  });

  await otpDoc.save();
  return otp;
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function (
  email,
  otp,
  purpose = "registration"
) {
  const otpDoc = await this.findOne({
    email,
    purpose,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpDoc) {
    return {
      success: false,
      message: "Invalid or expired OTP",
    };
  }

  // Check attempt limit
  if (otpDoc.attempts >= 5) {
    return {
      success: false,
      message: "Too many failed attempts. Please request a new OTP",
    };
  }

  // Verify OTP
  if (otpDoc.otp !== otp) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    return {
      success: false,
      message: `Invalid OTP. ${5 - otpDoc.attempts} attempts remaining`,
    };
  }

  // Mark as used
  otpDoc.isUsed = true;
  await otpDoc.save();

  return {
    success: true,
    message: "OTP verified successfully",
  };
};

// Static method to check if OTP exists and is valid
otpSchema.statics.isValidOTP = async function (
  email,
  purpose = "registration"
) {
  const count = await this.countDocuments({
    email,
    purpose,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  return count > 0;
};

module.exports = mongoose.model("OTP", otpSchema);
