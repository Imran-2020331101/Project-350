const Trip = require("../models/trip");
const User = require("../models/User");
const { getWeatherForecast } = require("./WeatherService");

// Create a new trip
// Incoming req.body
// {
//     destination: "",
//     days: "",
//     budget: "",
//     persons: ""
// }

const createTrip = async (req, res) => {

  const {destination, days, budget, persons} = req.body;

  try {
    const initialTrip = {
      owner: req.owner,
      destination: req.destination,
      tags: req.tags,
      weatherForecast: {
        temparature: "",
        condition: "",
        alerts: "",
        suggestions: "",
      },
    };

    //TODO: fetch: transports

    console.log("hello");

    //fetch: weather forecast
    initialTrip.weatherForecast = getWeatherForecast(destination);
    /**
     * TODO: Add hotels from serpapi
     */

    //TODO: fetch: places to visit

    const newTrip = await Trip.create(initialTrip);
    res.status(201).json(newTrip);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params.id;
    const deletedTrip = Trip.findByIdAndDelete({ id: tripId });
    res.status(200).json({ deletedTrip });
  } catch (error) {
    console.log("error while deleting trip " + error);
    res.status(500).json({ error: "Failed to delete Trip" });
  }
};

const getAllTrips = async (req, res) => {
  try { 
    const { id:userId } = req.params;
    console.log(userId);
    if(!userId) return res.status(404).json({error: "must send user Id"})
    const trips = await Trip.find({ owner: userId });
    res.status(200).json(trips);
  } catch (error) {
    console.log("error while fetching all trips " + error);
    res.status(500).json({ error: "failed to fetch trips" });
  }
};

module.exports = {
  createTrip,
  deleteTrip,
  getAllTrips,
};
