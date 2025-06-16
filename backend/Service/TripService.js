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

  console.log("Create trip request:", { destination, tags, owner, travelDate });

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
        buses: []
      },
      placesToVisit: {},
      hotelsToStay: []
    };

    console.log("Fetching transport options...");
    // Fetch transport options with error handling
    try {
      initialTrip.transportOptions.flights = await getFlights(
        travelDate,
        tags.days
      );
    } catch (error) {
      console.log("Flights fetch error:", error.message);
      initialTrip.transportOptions.flights = [];
    }

    try {
      initialTrip.transportOptions.trains = await getTransport(
        "train",
        destination,
        travelDate,
        tags.days
      );
    } catch (error) {
      console.log("Transport fetch error:", error.message);
      initialTrip.transportOptions.trains = [];
    }

    console.log("Transport options:", initialTrip.transportOptions);

    console.log("Fetching weather forecast...");
    // Fetch weather forecast with error handling
    try {
      initialTrip.weatherForecast = await getWeatherForecast(destination);
    } catch (error) {
      console.log("Weather fetch error:", error.message);
      initialTrip.weatherForecast = {
        temperature: "N/A",
        condition: "Unknown",
        alerts: "No alerts available",
        suggestions: "Check local weather"
      };
    }

    console.log("Weather forecast:", initialTrip.weatherForecast);

    console.log("Fetching hotels...");
    // Fetch hotels with error handling
    try {
      initialTrip.hotelsToStay = await getHotels(
        destination,
        travelDate,
        tags.days
      );
    } catch (error) {
      console.log("Hotels fetch error:", error.message);
      initialTrip.hotelsToStay = [];
    }

    console.log("Hotels:", initialTrip.hotelsToStay);

    console.log("Fetching places to visit...");
    // Fetch places to visit with error handling
    try {
      const places = await getPlaces(destination, "tourist", tags.budget, 5);
      console.log("Places fetched:", places);
      
      const placesPrompt = `Give me a detailed itinerary for visiting these places in ${destination} over ${
        tags.days
      } days, considering a budget of ${tags.budget}: ${places.join(", ")}`;
      
      let itineraryResponse;
      try {
        itineraryResponse = await generateResponse(placesPrompt);
      } catch (error) {
        console.log("AI response error:", error.message);
        itineraryResponse = `Visit ${places.join(", ")} in ${destination} over ${tags.days} days.`;
      }

      // Structure the places data as a regular object instead of Map
      const placesToVisitObj = {};
      places.forEach((place, index) => {
        const dayKey = `Day ${Math.floor(index / 2) + 1} - ${
          index % 2 === 0 ? "Morning" : "Afternoon"
        }`;
        placesToVisitObj[dayKey] = {
          time: index % 2 === 0 ? "Morning" : "Afternoon",
          name: place,
          details: itineraryResponse,
        };
      });
      
      initialTrip.placesToVisit = placesToVisitObj;
    } catch (error) {
      console.log("Places fetch error:", error.message);
      initialTrip.placesToVisit = {
        "Day 1 - Morning": {
          time: "Morning",
          name: `${destination} City Tour`,
          details: `Explore the main attractions of ${destination}`
        }
      };
    }

    console.log("Creating trip in database...");
    const newTrip = await Trip.create(initialTrip);
    console.log("Trip created successfully:", newTrip._id);
    
    res.status(201).json({
      success: true,
      trip: newTrip
    });
  } catch (error) {
    console.error("Trip creation error:", error);
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
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
