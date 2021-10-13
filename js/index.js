const apikey = "3265874a2c77ae4a04bb96236a642d2f";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
function KtoC(K) {
  return Math.floor(K - 273.15);
}

// forecast();

function addWeatherToPage(data, location) {
  // Date
  let d = new Date();
  let date = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();

  const temp = KtoC(data.main.temp);
  const weather = document.createElement("div");
  weather.classList.add("weather");
  weather.innerHTML = `
    <div class="card" id="card">
      <h2>${date}/${month}/${year}</h2>
      <h2 id="location"></h2>
      <h3>${data.weather[0].main}</h3>
      <h1>${temp}°C</h1>
      <div class="img"><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></div>
        <table id="table">
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </table>
  </div>

`;
  main.innerHTML = "";
  main.appendChild(weather);
  forecast(location);
}

// Manual
try {
  async function getWeatherByName(city) {
    const url = (city) =>
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    var transfer = city;

    const resp = await fetch(url(city), { origin: "cors" });
    const respData = await resp.json();
    addWeatherToPage(respData);
    addLocationM(respData);
  }
  function addLocationM(city) {
    city = city.name;
    document.getElementById("location").innerText = city;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = search.value;
    ``;
    if (city) {
      getWeatherByName(city, city);
    }
  });
} catch {
  let error = document.getElementById("error");
  error.innerText = "Some Error Have Occurred";
}

// Geolocation
function success(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
  let urlL = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  async function getWeatherByLocation() {
    const resp = await fetch(url, { origin: "cors" });
    const respData = await resp.json();

    const respLocation = await fetch(urlL, { origin: "cors" });
    const respDataLocation = await respLocation.json();

    addWeatherToPage(respData, respDataLocation.address.county);
    addLocation(respDataLocation);
  }
  getWeatherByLocation();
}
function addLocation(location) {
  document.getElementById("location").innerText = location.address.county;
  forecast(location.address.county);
}

function error() {
  console.log("Unable to retrieve your location");
}
navigator.geolocation.getCurrentPosition(success, error);

async function forecast(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;
    const forecastD = await fetch(url, { origin: "cors" });
    const forecastJ = await forecastD.json();
    processforecastJ(forecastJ.list);
  } catch (error) {
    let city = search.value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;
    const forecastD = await fetch(url, { origin: "cors" });
    const forecastJ = await forecastD.json();
    processforecastJ(forecastJ.list);
  }
}

function processforecastJ(list) {
  let day1 = list.slice(9, 10);
  let day2 = list.slice(17, 18);
  let day3 = list.slice(25, 26);
  let day4 = list.slice(33, 34);
  let day5 = list.slice(39, 40);

  let day1D = day1[0].dt_txt.split(" ");
  let day2D = day2[0].dt_txt.split(" ");
  let day3D = day3[0].dt_txt.split(" ");
  let day4D = day4[0].dt_txt.split(" ");
  let day5D = day5[0].dt_txt.split(" ");

  let n = `
  <table id="table">
      <tr>
        <td>${day1D[0]}</td>
        <td>${day2D[0]}</td>
        <td>${day3D[0]}</td>
        <td>${day4D[0]}</td>
        <td>${day5D[0]}</td>
      </tr>
      <tr>
        <td>${KtoC(day1[0].main.temp)}°</td>
        <td>${KtoC(day2[0].main.temp)}°</td>
        <td>${KtoC(day3[0].main.temp)}°</td>
        <td>${KtoC(day4[0].main.temp)}°</td>
        <td>${KtoC(day5[0].main.temp)}°</td>
      </tr>


    </table>`;
  let t = document.getElementById("table");

  t.innerHTML = n;
}
