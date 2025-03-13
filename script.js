async function getWeatherAtLocation() {
  event.preventDefault();
  let searchValue = document.getElementById("search").value;
  let locationTitle = document.getElementById("location-title");
  locationTitle.innerHTML = searchValue;

  try {
    let response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchValue}/today?unitGroup=metric&include=days%2Ccurrent%2Chours&key=${key}`,
      { mode: "cors" }
    );
    if (response.ok) {
      let data = await response.json();
      console.log(data);

      if (data && data.currentConditions) {
        getCurrentWeather(data.currentConditions);
      } else {
        console.log("No current weather data available");
      }

      if (data && data.days) {
        getDailyTemperatures(data.days);
      } else {
        console.log("No daily temperatures available");
      }
    } else {
      console.log(`HTTP error! Status: ${response.status}`);
    }
  } catch (err) {
    console.log(err);
  }
}

function getCurrentWeather(current) {
  let locationTemperature = document.getElementById("location-temperature");
  let feelLike = document.getElementById("feels-like");

  let locDegree = document.createElement("div");
  locDegree.setAttribute("class", "degree");
  locDegree.setAttribute("id", "lt-degree");
  let flDegree = document.createElement("div");
  flDegree.setAttribute("class", "degree");
  flDegree.setAttribute("id", "fl-degree");

  locationTemperature.innerHTML = current.temp;
  locationTemperature.appendChild(locDegree);
  feelLike.innerHTML = current.feelslike;
  feelLike.appendChild(flDegree);

  console.log(`Temperature: ${current.temp}°C`);
  console.log(`Feels like: ${current.feelslike}°C`);
  console.log(`Conditions: ${current.conditions}`);
}

function getDailyTemperatures(days) {
  let maxTemp = document.getElementById("high");
  let minTemp = document.getElementById("low");

  let hDegree = document.createElement("div");
  let lDegree = document.createElement("div");
  hDegree.setAttribute("class", "degree");
  hDegree.setAttribute("id", "hl-degree");
  lDegree.setAttribute("class", "degree");
  lDegree.setAttribute("id", "hl-degree");

  if (Array.isArray(days) && days.length > 0) {
    const currentDay = days[0];

    maxTemp.innerHTML = `H: ${currentDay.tempmax}`;
    maxTemp.appendChild(hDegree);
    minTemp.innerHTML = `L: ${currentDay.tempmin}`;
    minTemp.appendChild(lDegree);

    console.log(`Max Temperature: ${currentDay.tempmax}`);
    console.log(`Min Temperature: ${currentDay.tempmin}`);
  } else {
    console.log("No daily temperature data available");
  }
}
