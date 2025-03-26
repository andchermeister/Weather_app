import { key } from "./key.js";
let form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeatherAtLocation();
});

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
        const weatherData = getCurrentWeather(data.currentConditions);
        weatherData.displayCurrent();
        displayCurrentWether(weatherData);
      } else {
        console.log("No current weather data available");
      }

      if (data && data.days) {
        const dailyTemperatures = getDailyTemperatures(data.days);
        dailyTemperatures.displayDailyMaxMin();
        displayDailyTemps(dailyTemperatures);
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
  return {
    currentTemp: Math.round(current.temp),
    currentFeelsLike: Math.round(current.feelslike),
    currentConditions: Math.round(current.conditions),
    displayCurrent: function () {
      console.log(`Temperature: ${this.currentTemp}°C`);
      console.log(`Feels like: ${this.currentFeelsLike}°C`);
      console.log(`Conditions: ${this.currentConditions}`);
    },
  };
}

function getDailyTemperatures(days) {
  if (Array.isArray(days) && days.length > 0) {
    const currentDay = days[0];
    return {
      currentDayMax: Math.round(currentDay.tempmax),
      currentDayMin: Math.round(currentDay.tempmin),
      displayDailyMaxMin: function () {
        console.log(`Max Temperature: ${this.currentDayMax}`);
        console.log(`Min Temperature: ${this.currentDayMin}`);
      },
    };
  } else {
    console.log("No daily temperature data available");
    return null;
  }
}

function displayCurrentWether(weatherData) {
  let locationTemperature = document.getElementById("location-temperature");
  let feelLike = document.getElementById("feels-like");

  let locDegree = document.createElement("div");
  locDegree.setAttribute("class", "degree");
  locDegree.setAttribute("id", "lt-degree");
  let flDegree = document.createElement("div");
  flDegree.setAttribute("class", "degree");
  flDegree.setAttribute("id", "fl-degree");

  locationTemperature.innerHTML = `${weatherData.currentTemp}`;
  locationTemperature.appendChild(locDegree);
  feelLike.innerHTML = `Feels like: ${weatherData.currentFeelsLike}`;
  feelLike.appendChild(flDegree);
}

function displayDailyTemps(dailyTemperatures) {
  let maxTemp = document.getElementById("high");
  let minTemp = document.getElementById("low");

  let hDegree = document.createElement("div");
  let lDegree = document.createElement("div");
  hDegree.setAttribute("class", "degree");
  hDegree.setAttribute("id", "hl-degree");
  lDegree.setAttribute("class", "degree");
  lDegree.setAttribute("id", "hl-degree");

  maxTemp.innerHTML = `H: ${dailyTemperatures.currentDayMax}`;
  maxTemp.appendChild(hDegree);
  minTemp.innerHTML = `L: ${dailyTemperatures.currentDayMin}`;
  minTemp.appendChild(lDegree);
}
