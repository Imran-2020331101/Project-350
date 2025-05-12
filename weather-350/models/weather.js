const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  weatherID: { type: String, required: true },
  locationID: { type: String, required: true },
  forecastDate: { type: Date, required: true },
  temperature: { type: String, required: true },
  weatherCondition: { type: String, required: true },
  severeWeatherAlerts: { type: String, required: true },
  packingSuggestions: { type: String, required: true }
});

module.exports = mongoose.model('Weather', weatherSchema);
