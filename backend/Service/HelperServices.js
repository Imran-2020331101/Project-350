const { getJson } = require("serpapi");

const serpApiKey = process.env.SERP_API_KEY;
const weatherApiKey = process.env.API_KEY;

const getWeatherForecast = async (city) => {
  try {
    if (!weatherApiKey) {
      console.log("No weather API key found, using mock data");
      return {
        temperature: "25°C",
        condition: "partly cloudy",
        alerts: "No severe alerts",
        suggestions: "Light clothes are fine",
      };
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
    );
    
    if (!res.ok) {
      console.log(`Weather API error: ${res.status}`);
      throw new Error("City not found");
    }

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
    console.error("Error fetching weather:", err.message);
    // Return mock data as fallback
    return {
      temperature: "25°C",
      condition: "partly cloudy",
      alerts: "No severe alerts",
      suggestions: "Light clothes are fine",
    };
  }
};

const getHotels = async (destination, check_in, days) => {
  try {
    if (!serpApiKey) {
      console.log("No SERP API key found, using mock hotel data");
      return [
        {
          name: `Hotel ${destination} Plaza`,
          location: `Central ${destination}`,
          pricePerNight: 120
        },
        {
          name: `${destination} Grand Hotel`,
          location: `Downtown ${destination}`,
          pricePerNight: 85
        }
      ];
    }

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
    console.error("Error fetching hotels:", error.message);
    // Return mock data as fallback
    return [
      {
        name: `Hotel ${destination} Plaza`,
        location: `Central ${destination}`,
        pricePerNight: 120
      },
      {
        name: `${destination} Grand Hotel`,
        location: `Downtown ${destination}`,
        pricePerNight: 85
      }
    ];
  }
};




const getFlights = async (travelDate, days, from = "DAC") => {
  try {
    if (!serpApiKey) {
      console.log("No SERP API key found, using mock flight data");
      return [
        {
          airline: "Biman Bangladesh",
          flightNumber: "BG001",
          departure: new Date(travelDate),
          arrival: new Date(new Date(travelDate).getTime() + 2 * 60 * 60 * 1000),
          from: from,
          to: "Destination Airport"
        }
      ];
    }

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
    console.error("Error fetching flights:", error.message);
    // Return mock data as fallback
    return [
      {
        airline: "Biman Bangladesh",
        flightNumber: "BG001",
        departure: new Date(travelDate),
        arrival: new Date(new Date(travelDate).getTime() + 2 * 60 * 60 * 1000),
        from: from,
        to: "Destination Airport"
      }
    ];
  }
};

module.exports = { getWeatherForecast, getHotels, getFlights };