const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "3265874a2c77ae4a04bb96236a642d2f";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData = () => {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    )
      .then((res) => res.json())
      .then((data) => {
        timezone.innerHTML = data.address.county;
      });

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);
      });
  });
};
getWeatherData();
showWeatherData = (data) => {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  currentWeatherItemsEl.innerHTML = `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div>

    `;

  let forecast = "";
  data.daily.forEach((e, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${
              e.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            
            <div class="other">
                <div class="day">${window
                  .moment(e.dt * 1000)
                  .format("dddd")}</div>
                  <div class="temp">Day - ${Math.round(e.temp.day)}°C</div>
                <div class="temp">Night - ${Math.round(e.temp.night)}°C</div>
                <div class="temp">${e.weather[0].description}</div>
                </div>
                
            `;
    } else {
      forecast += `
            <div  class="weather-forecast-item">
                <div class="day">${window
                  .moment(e.dt * 1000)
                  .format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  e.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Day - ${Math.round(e.temp.day)}°C</div>
                <div class="temp">Night - ${Math.round(e.temp.night)}°C</div>
                <div class="temp">${e.weather[0].description}</div>
            </div>

            `;
    }
  });

  weatherForecastEl.innerHTML = forecast;
};
