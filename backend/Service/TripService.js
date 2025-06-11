const Trip = require("../models/trip");
const User = require("../models/User");
const { getWeatherForecast, getHotels, getFlights } = require("./HelperServices");
const { getTransport } = require("../utils/utils");
const { getPlaces, generateResponse } = require("../utils/utils");

// Create a new trip
// Incoming req.body
// {
//     destination: "",
//     days: "",
//     budget: "",
//     persons: ""
// }

const createTrip = async (req, res) => {
  const { destination, tags, owner, travelDate } = req.body;

  try {
    const initialTrip = {
      owner: owner,
      destination: destination,
      tags: tags,
      weatherForecast: null,
      travelDate: travelDate,
      transportOptions: {
        trains: [],
        flights: []
      },
      placesToVisit: new Map()
    };

    // Fetch transport options
    initialTrip.transportOptions.flights = await getFlights(travelDate, tags.days);
    initialTrip.transportOptions.trains = await getTransport("train", destination, travelDate, tags.days);
    
    console.log("Transport options:", initialTrip.transportOptions);

    // Fetch weather forecast
    initialTrip.weatherForecast = await getWeatherForecast(destination);
    console.log("Weather forecast:", initialTrip.weatherForecast);

    // Fetch hotels
    initialTrip.hotelsToStay = await getHotels(destination, travelDate, tags.days);
    console.log("Hotels:", initialTrip.hotelsToStay);

    // Fetch places to visit
    const places = await getPlaces(destination, "tourist", tags.budget, 5);
    const placesPrompt = `Give me a detailed itinerary for visiting these places in ${destination} over ${tags.days} days, considering a budget of ${tags.budget}: ${places.join(", ")}`;
    const itineraryResponse = await generateResponse(placesPrompt);
    
    // Parse and structure the places data
    places.forEach((place, index) => {
      initialTrip.placesToVisit.set(`Day ${Math.floor(index / 2) + 1} - ${index % 2 === 0 ? "Morning" : "Afternoon"}`, {
        time: index % 2 === 0 ? "Morning" : "Afternoon",
        name: place,
        details: itineraryResponse
      });
    });

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
