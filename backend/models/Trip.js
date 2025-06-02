const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  id: String,
  owner: String,
  from: String,
  destination: String,
  travelDate: String,
  tripTypes: [String],
  transportOptions: {
    flights: [{
      airline: String,
      flightNumber: String,
      departure: Date,
      arrival: Date,
      from: String,
      to: String
    }],
    trains: [{
      trainName: String,
      departure: Date,
      arrival: Date,
      from: String,
      to: String
    }],
    buses: [{
      busName: String,
      departure: Date,
      arrival: Date,
      from: String,
      to: String
    }],
    
  },
  estimatedBudget: Number,
  tags: {
    days: Number,
    budget: String,
    numberOfTravelers: Number
  },
  weatherForecast: {
    temparature: String,
    condition: String,
    alerts: String,
    suggestions: String
  },
  description: String,
  placesToVisit: {
    type: Map,
    of: [{
      time: String,
      name: String,
      details: String
    }]
  },
  hotelsToStay: [{
    name: String,
    location: String,
    pricePerNight: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('trip', tripSchema);
