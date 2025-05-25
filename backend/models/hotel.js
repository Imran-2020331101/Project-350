const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  itineraryID: { type: String, required: true },
  hotelName: { type: String, required: true },
  cost: { type: Number, required: true },
  roomClass: { type: String, required: true },
  bookingLink: { type: String, required: true },
});

module.exports = mongoose.model("hotel", hotelSchema);
