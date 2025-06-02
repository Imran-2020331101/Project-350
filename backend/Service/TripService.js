const Trip = require("../models/trip")
const User = require("../models/User");

// Create a new trip
const createTrip = async (req, res) => {
  try {
    const initialTrip = {
      owner: req.owner,
      destination: req.destination,
      tags: req.tags,
    };

    //fetch: transports

    console.log("hello");

    //fetch: weather forecast
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${req.city}&appid=${apiKey}&units=metric`
    )
      .then((res) => {
        if (!res.ok) throw new Error("City not found");
        return res.json();
      })
      .then((data) => {
        const temp = data.main.temp + "°C";
        const condition = data.weather[0].description;
        const alerts =
          condition.includes("rain") || condition.includes("storm")
            ? "Weather Alert: Take precautions"
            : "No severe alerts";

        const suggestions = condition.includes("rain")
          ? "Bring an umbrella and raincoat"
          : "Light clothes are fine";

        initialTrip.weatherForecast = {
          temparature: temp,
          condition: condition,
          alerts: alerts,
          suggestions: suggestions,
        };
      })
      .catch((err) => {
        console.error(err);
      });

    //fetch: hotels from trivago

    //fetch: places to visit

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
    const { userId } = req.query;
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
