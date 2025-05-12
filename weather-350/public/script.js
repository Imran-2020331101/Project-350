const apiKey = "8bd995f770b1dc341a8f681fd3bac658";

function fetchWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  document.getElementById("temperature").value = "";
  document.getElementById("weatherCondition").value = "";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      const temp = data.main.temp + "°C";
      const condition = data.weather[0].description;
      const alerts = condition.includes("rain") || condition.includes("storm")
        ? "Weather Alert: Take precautions"
        : "No severe alerts";

      const suggestions = condition.includes("rain")
        ? "Bring an umbrella and raincoat"
        : "Light clothes are fine";

      document.getElementById("forecastDate").valueAsDate = new Date();
      document.getElementById("temperature").value = temp;
      document.getElementById("weatherCondition").value = condition;
      document.getElementById("severeWeatherAlerts").value = alerts;
      document.getElementById("packingSuggestions").value = suggestions;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("response").innerText = "Failed to fetch weather.";
    });
}

document.getElementById("weatherForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    weatherID: document.getElementById("weatherID").value,
    locationID: document.getElementById("locationID").value,
    forecastDate: document.getElementById("forecastDate").value,
    temperature: document.getElementById("temperature").value,
    weatherCondition: document.getElementById("weatherCondition").value,
    severeWeatherAlerts: document.getElementById("severeWeatherAlerts").value,
    packingSuggestions: document.getElementById("packingSuggestions").value
  };

  console.log("Data to send:", data); // Log data being sent

  if (!data.weatherID || !data.locationID) {
    alert("Weather ID and Location ID are required.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/weather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      document.getElementById("response").innerText = "Weather data saved successfully!";
    } else {
      document.getElementById("response").innerText = `Error: ${result.message}`;
    }
  } catch (err) {
    console.error("Server error:", err);
    document.getElementById("response").innerText = "Server error.";
  }
});
