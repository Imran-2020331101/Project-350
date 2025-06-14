const Trip = require("../models/trip");
const User = require("../models/User");
const {
  getWeatherForecast,
  getHotels,
  getFlights,
} = require("./HelperServices");
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


// Create a new trip
const createTrip = async (req, res) => {
  const { destination, tags, owner, travelDate } = req.body;

  if (!destination || !tags || !owner || !travelDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const initialTrip = {
      owner: owner,
      destination: destination, 
      tags: tags,
      weatherForecast: null,
      travelDate: travelDate,
      transportOptions: {
        trains: [],
        flights: [],
      },
      placesToVisit: new Map(),
    };

    // Fetch transport options
    initialTrip.transportOptions.flights = await getFlights(
      travelDate,
      tags.days
    );
    initialTrip.transportOptions.trains = await getTransport(
      "train",
      destination,
      travelDate,
      tags.days
    );
    console.log("Transport options:", initialTrip.transportOptions);

    // Fetch weather forecast
    initialTrip.weatherForecast = await getWeatherForecast(destination);
    console.log("Weather forecast:", initialTrip.weatherForecast);

    // Fetch hotels
    initialTrip.hotelsToStay = await getHotels(
      destination,
      travelDate,
      tags.days
    );
    console.log("Hotels:", initialTrip.hotelsToStay);

    // Fetch places to visit
    const places = await getPlaces(destination, "tourist", tags.budget, 5);
    const placesPrompt = `Give me a detailed itinerary for visiting these places in ${destination} over ${
      tags.days
    } days, considering a budget of ${tags.budget}: ${places.join(", ")}`;
    const itineraryResponse = await generateResponse(placesPrompt);

    // Parse and structure the places data
    places.forEach((place, index) => {
      initialTrip.placesToVisit.set(
        `Day ${Math.floor(index / 2) + 1} - ${
          index % 2 === 0 ? "Morning" : "Afternoon"
        }`,
        {
          time: index % 2 === 0 ? "Morning" : "Afternoon",
          name: place,
          details: itineraryResponse,
        }
      );
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
    const { tripId } = req.params; 
    const deletedTrip = await Trip.findByIdAndDelete(tripId); 
    if (!deletedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(200).json({ message: "Trip successfully deleted", deletedTrip });
  } catch (error) {
    console.log("error while deleting trip " + error);
    res.status(500).json({ error: "Failed to delete Trip" });
  }
};

//GET /api/trips/:id
const getAllTrips = async (req, res) => {
  try {
    const { id } = req.params; 
    if (!id) return res.status(400).json({ error: "Must send user ID" });

    const trips = await Trip.find({ owner: id });
    if (!trips.length) {
      return res.status(404).json({ message: "No trips found for this user" });
    }
    res.status(200).json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (error) {
    console.log("error while fetching all trips " + error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

module.exports = {
  createTrip,
  deleteTrip,
  getAllTrips,
};
