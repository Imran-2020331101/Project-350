const { getJson } = require("serpapi");

const serpApiKey = process.env.SERP_API_KEY;
const weatherApiKey = process.env.API_KEY;

const getWeatherForecast = async (city) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
    );
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    const temp = data.main.temp + "°C";
    const condition = data.weather[0].description;

    return {
      temperature: temp,
      condition,
      alerts:
        condition.includes("rain") || condition.includes("storm")
          ? "Weather Alert: Take precautions"
          : "No severe alerts",
      suggestions: condition.includes("rain")
        ? "Bring an umbrella and raincoat"
        : "Light clothes are fine",
    };
  } catch (err) {
    console.error("Error fetching weather:", err);
    throw new Error("Failed to fetch weather data");
  }
};

const getHotels = async (destination, check_in, days) => {
  try {
    const params = {
      engine: "google_hotels",
      q: destination,
      hl: "en",
      gl: "bd",
      check_in_date: check_in,
      check_out_date: check_in + days,
      currency: "BDT",
      api_key: serpApiKey,
    };

    const res = await getJson(params);
    if (!res.data) throw new Error("No hotel data received");
    
    return res.data.hotels || [];
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw new Error("Failed to fetch hotel data");
  }
};




const getFlights = async (travelDate, days, from = "DAC") => {
  try {

    //TODO: 

    const params = {
      api_key: serpApiKey,
      engine: "google_flights",
      hl: "en",
      gl: "bd",
      departure_id: from,
      arrival_id: "AUS",
      outbound_date: travelDate,
      currency: "BDT",
    };

    const res = await getJson(params);
    if (!res) throw new Error("No flight data received");
    
    return res.flights || [];
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error("Failed to fetch flight data");
  }
};

module.exports = { getWeatherForecast, getHotels, getFlights };