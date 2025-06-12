const fetch = require("node-fetch");
const axios = require("axios");
const { getJson } = require("serpapi");

const apiKey = "8bd995f770b1dc341a8f681fd3bac658";
const serpApiKe ="46a31540b59d93a796fd74ccb6b348740ba68616a7e17a957f48af1984604e29";

const getWeatherForecast = async (city) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
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
    // Convert check_in to proper date format if it's not already
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + parseInt(days));

    const params = {
      engine: "google_hotels",
      q: destination,
      hl: "en",
      gl: "bd",
      check_in_date: checkInDate.toISOString().split('T')[0],
      check_out_date: checkOutDate.toISOString().split('T')[0],
      currency: "BDT",
      api_key: serpApiKey,
    };

    const res = await axios.get("https://serpapi.com/search", { params });
    if (!res.data) throw new Error("No hotel data received");
    
    return res.data.hotels || [];
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw new Error("Failed to fetch hotel data");
  }
};

const getFlights = async (travelDate, days, from = "DAC") => {
  try {
    // Convert travelDate to proper date format if it's not already
    const departureDate = new Date(travelDate);
    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + parseInt(days));

    const params = {
      api_key: serpApiKey,
      engine: "google_flights",
      hl: "en",
      gl: "bd",
      departure_id: from,
      arrival_id: "AUS", // This should ideally come from a mapping of the destination
      outbound_date: departureDate.toISOString().split('T')[0],
      return_date: returnDate.toISOString().split('T')[0],
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