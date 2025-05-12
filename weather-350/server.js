const express = require('express');
const mongoose = require('mongoose');
const Weather = require('./models/weather'); // Import the Weather model
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost/weatherdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error: ', err));

// POST Route to save weather data
app.post('/api/weather', async (req, res) => {
  const { weatherID, locationID, forecastDate, temperature, weatherCondition, severeWeatherAlerts, packingSuggestions } = req.body;

  const newWeather = new Weather({
    weatherID,
    locationID,
    forecastDate,
    temperature,
    weatherCondition,
    severeWeatherAlerts,
    packingSuggestions
  });

  try {
    await newWeather.save();
    res.status(200).json({ message: 'Weather data saved successfully!' });
  } catch (err) {
    console.error("Error occurred during save:", err); // Log the error details to the console
    res.status(500).json({ message: 'Server error occurred.', error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
