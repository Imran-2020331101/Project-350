const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
  {
    contactID: { type: String, required: true, unique: true },
    location: { type: String, required: true }, // City or country name
    contactType: {
      type: String,
      required: true,
      enum: [
        "police",
        "fire",
        "medical",
        "embassy",
        "tourist_helpline",
        "coast_guard",
        "rescue",
      ],
    },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: String,
    description: String,
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 1 }, // 1 = highest priority
  },
  { timestamps: true }
);

// Index for faster location-based queries
emergencyContactSchema.index({ location: 1, contactType: 1 });

module.exports = mongoose.model("EmergencyContact", emergencyContactSchema);
