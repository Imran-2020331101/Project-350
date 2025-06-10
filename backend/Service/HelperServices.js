const fetch = require("node-fetch"); // If needed
const apiKey = process.env.OPENWEATHER_API_KEY;
const { getJson } = require("serpapi");

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
    console.error(err);
    return null; // Or throw the error to let the calling function decide
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
      api_key: proccess.env.SERP_API_KEY,
    };

    const res = await axios.get("https://serpapi.com/search", { params });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Error fetching hotels : ", error);
  }
};

const getFlights = async (travelDate, days) => {
  try {
    const res = await getJson(
      {
        api_key: process.env.SERP_API_KEY,
        engine: "google_flights",
        hl: "en",
        gl: "us",
        departure_id: "CDG",
        arrival_id: "AUS",
        outbound_date: travelDate,
        return_date: travelDate + days,
        currency: "BDT",
      });
    console.log(res);
    return res;
  } catch (error) {
    console.log("Error fetching flights : ", error);
  }
};

module.exports = { getWeatherForecast, getHotels, getFlights };
