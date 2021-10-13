const apikey = "3265874a2c77ae4a04bb96236a642d2f";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
function KtoC(K) {
  return Math.floor(K - 273.15);
}
function addWeatherToPage(data) {
  const temp = KtoC(data.main.temp);
  const weather = document.createElement("div");
  weather.classList.add("weather");
  weather.innerHTML = `
        <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${temp}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></h2>
        <small>${data.weather[0].description}</small>`;

  main.innerHTML = "";
  main.appendChild(weather);
}

// Manual
const url = (city) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

async function getWeatherByName(city) {
  const resp = await fetch(url(city), { origin: "cors" });
  const respData = await resp.json();
  addWeatherToPage(respData);
  addLocationM(respData);
}
function addLocationM(city) {
  city = city.name;
  document.getElementById("location").innerText = `Showing Weather in ${city}`;
}
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = search.value;
  ``;
  if (city) {
    getWeatherByName(city);
  }
});
//
// Geolocation
function success(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
  let urlL = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  async function getWeatherByLocation() {
    const resp = await fetch(url, { origin: "cors" });
    const respData = await resp.json();

    const respLocation = await fetch(urlL);
    const respDataLocation = await respLocation.json();
    console.log(respData);
    addWeatherToPage(respData);
    addLocation(respDataLocation);
  }
  getWeatherByLocation();
}
function addLocation(location) {
  location = location.display_name;
  document.getElementById(
    "location"
  ).innerText = `Showing Weather in ${location}`;
}
// function add
function error() {
  console.log("Unable to retrieve your location");
}
navigator.geolocation.getCurrentPosition(success, error);
