const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema({
  itineraryID: { type: String, required: true },
  companyName: { type: String, required: true },
  cost: { type: Number, required: true },
  travelClass: {
    type: String,
    required: true,
  },
  bookingLink: { type: String, required: true },
});

module.exports = mongoose.model("transport", transportSchema);
