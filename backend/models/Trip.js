const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  itineraryID: { type: String, required: true, unique: true },
  userID: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: Date,
  timePeriod: Number,
  mealRecommendations: [{
    mealName: String,
    mealImageLink:String,
    mealDescription:String
  }],
  cost: Number
});

module.exports = mongoose.model("itinerary", itinerarySchema);
