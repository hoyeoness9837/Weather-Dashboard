let currentSearch = null;
let searchedHistoryList = [];

function renderForecastMedia(mediaIndex) {
  return `<div class="media" id="currentMedia">
  <div class="media-body">
  <h4 class="mt-0 mb-1">${currentSearch.city.name}</h4>
  <p class="card-text">Temperature: ${currentSearch.list[mediaIndex].main.temp} F</p>
  <p class="card-text"> Humidity: ${currentSearch.list[mediaIndex].main.humidity}%</p>
  <p class="card-text"> Wind speed: ${currentSearch.list[mediaIndex].wind.speed}</p>
  <p class="uv-text"></p>
  </div>
  <img src="http://openweathermap.org/img/wn/${currentSearch.list[mediaIndex].weather[0].icon}@2x.png" class="ml-3">
  </div>`;
}

function renderForecastCard(cardIndex) {
  return `<div class="col-sm-2">
  <div class="card text-white bg-primary mb-3" style="max-width: 12rem;">
  <div class="card-header">${currentSearch.list[cardIndex].dt_txt}</div>
  <div class="card-body">
  <h5 class="card-title"><img src='http://openweathermap.org/img/wn/${currentSearch.list[cardIndex].weather[0].icon}@2x.png'></h5>
  <p class="card-text">Temperature: ${currentSearch.list[cardIndex].main.temp} F</p>
  <p class="card-text"> Humidity: ${currentSearch.list[cardIndex].main.humidity}%</p>
  </div>
  </div>
  </div>`;
}

function renderHistory() {
  document.getElementById(
    'searchedHistory'
  ).innerHTML = searchedHistoryList.reduce((allSearches, cityObject) => {
    return (allSearches += `<li class="list-group-item">${cityObject.city.name}</li>`);
  }, '');
}

// update by every 3hrs, 3*8 = 24hr = a day, so if we want to create 5days, 0,8,16,24,32.
function renderCurrent() {
  document.getElementById('js-currentMedia').innerHTML = renderForecastMedia(0);
  document.getElementById('forecast').innerHTML =
    renderForecastCard(0) +
    renderForecastCard(8) +
    renderForecastCard(16) +
    renderForecastCard(24) +
    renderForecastCard(32);
}

// when the btn is inside of the form tag you can use .onsubmit instead of addEventListener.submit
document.getElementById('searchBtn').addEventListener('click', (event) => {
  event.preventDefault();
  const city = document.getElementById('input').value;
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=90b2f773fae3862aaf2f11a1fe2f96b7&units=imperial`
  )
    .then((r) => r.json())
    .then((info) => {
      currentSearch = info;
      searchedHistoryList.push(info);
      renderHistory();
      renderCurrent();
      askForCoords();
      console.log(info);
      document.getElementById('input').value = '';
    });
});

//-----------------------------------------Fetching UV index-----------------------------//
function askForCoords() {
  navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

function handleGeoError() {
  console.log('Cannot access the location');
}

function handleGeoSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeather(lat, lon);
}

let currentData = null;

function getWeather(lat, lon) {
  fetch(
    `http://api.openweathermap.org/data/2.5/uvi?appid=90b2f773fae3862aaf2f11a1fe2f96b7&lat=${lat}&lon=${lon}`
  )
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      currentData = data;
      document.querySelector('.uv-text').innerHTML = `UV Index: ${data.value}`;
    });
}
