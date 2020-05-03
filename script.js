let currentSearch = null;
let searchedHistoryList = [];

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

function renderForecastMedia(mediaIndex) {
  return `<div class="media" id="currentMedia">
<div class="media-body">
<h5 class="mt-0 mb-1">${currentSearch.city.name}</h5>
<p class="card-text">Temperature: ${currentSearch.list[mediaIndex].main.temp} F</p>
<p class="card-text"> Humidity: ${currentSearch.list[mediaIndex].main.humidity}%</p>
<p class="card-text"> Wind speed: ${currentSearch.list[mediaIndex].wind.speed}</p>
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
      console.log(info);
    });
});
