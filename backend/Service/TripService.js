const Trip = require("../models/trip");
const User = require("../models/User");
const { getWeatherForecast, getHotels, getFlights } = require("./HelperServices");

// Create a new trip
// Incoming req.body
// {
//     destination: "",
//     days: "",
//     budget: "",
//     persons: ""
// }

const createTrip = async (req, res) => {

  const {destination, tags, owner,travelDate} = req.body;

  try {
    const initialTrip = {
      owner: owner,
      destination: destination,
      tags: tags,
      weatherForecast: null,
      travelDate: travelDate,
      transportOptions: {
        trains:[],
        flights:[]
      }

    };

    //TODO: fetch: transports
    initialTrip.transportOptions.flights = getFlights();
    console.log(initialTrip.transportOptions.flights);

    //fetch: weather forecast
    initialTrip.weatherForecast = getWeatherForecast(destination);

    console.log(initialTrip.weatherForecast);

    //TODO: Testing
    initialTrip.hotelsToStay = getHotels(destination,travelDate,tags.days);

    console.log(initialTrip.hotelsToStay);

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
