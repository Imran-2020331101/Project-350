const fetch = require('node-fetch'); // If needed
const apiKey = process.env.OPENWEATHER_API_KEY;

const getWeatherForecast = async (city) => {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    const temp = data.main.temp + "°C";
    const condition = data.weather[0].description;

    return {
      temperature: temp,
      condition,
      alerts: condition.includes("rain") || condition.includes("storm")
        ? "Weather Alert: Take precautions"
        : "No severe alerts",
      suggestions: condition.includes("rain")
        ? "Bring an umbrella and raincoat"
        : "Light clothes are fine"
    };
  } catch (err) {
    console.error(err);
    return null; // Or throw the error to let the calling function decide
  }
};

module.exports = { getWeatherForecast };
