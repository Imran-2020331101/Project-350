const apiKey = "8bd995f770b1dc341a8f681fd3bac658";

function getWeather() {
  const city = document.getElementById("cityInput").value;
  
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  
  document.getElementById("weather").innerHTML = "Loading...";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const temp = data.main.temp;
      const description = data.weather[0].description;
      const icon = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      // Check for rain in the description
      const rainPossible = description.includes("rain") ? "Rain is possible." : "No rain expected.";

      document.getElementById("weather").innerHTML = `
        <img src="${iconUrl}" alt="Weather icon"><br>
        <strong>${temp}°C</strong><br>
        ${description}<br>
        <strong>${rainPossible}</strong>
      `;
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("weather").textContent = "City not found or API error.";
    });
}
