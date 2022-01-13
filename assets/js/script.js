//need to setup github secret to store/use apikey
let apiKey = 'fbf31d182481f35e3b9fc07c433c4e62'
let invalidCity = false

//if data exists load to pastsearch, otherwise create empty array
let pastSearch = JSON.parse(localStorage.getItem("pastCities"));
if (!pastSearch) { pastSearch = [] }
for (let i = 0; i < pastSearch.length; i++) {
  let previousCity = document.createElement("button")
  previousCity.id = "past-city" + [i]
  previousCity.classList.add("w3-button", "w3-gray", "w3-round", "past-city")
  previousCity.textContent = pastSearch[i]
  $("#past-cities").append(previousCity)
}

//initial call to get city name and coordinates for use by the getWeather api call
const getCityLatLong = (city) => {

  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units&appid=${apiKey}`

  fetch(apiURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        let cityLat = data.coord.lat
        let cityLong = data.coord.lon
        let cityName = data.name
        getWeather(cityLat, cityLong, cityName);    
      })
    } else {
      alert("City Not Found!")
      invalidCity = true
      
    }
  }).catch((error) => {
    console.log(error)
  })
}

//gets all weather data and displays on the page
const getWeather = (cityLat, cityLong, cityName) => {
  if (cityLat && cityLong) {
    let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&units=imperial&exclude=hourly,minutely,alerts&appid=${apiKey}`

    fetch(apiURL).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {

          //Update the header information for the current day
          let currentDay = moment.unix(data.current.dt).format('L')
          let weatherIcon = data.current.weather[0].icon;
          let icon = document.createElement("img")
          icon.setAttribute("src",`http://openweathermap.org/img/wn/${weatherIcon}.png`)
          $("#current-day-header").text(`${cityName} (${currentDay})`)
          $("#current-day-header").append(icon)

          //add border to div
          $("#todays-forecast").addClass("w3-border")

          //create the current day weather info
          let temp = data.current.temp;
          let wind = data.current.wind_speed;
          let humidity = data.current.humidity;

          $("#current-temp").text(`Temp: ${temp}°F`);
          $("#current-wind").text(`Wind: ${wind} MPH`);
          $("#current-humidity").text(`Humidity: ${humidity}%`);

          let uv = data.current.uvi
          let uvBox = $("#current-uv")
          uvBox.text(`UV Index: ${uv}`)
          uvBox.removeClass("w3-green w3-red w3-yellow")

          if (uv < 4) {
            uvBox.addClass("w3-green")
          } else if (uv > 7) {
            uvBox.addClass("w3-red")
          } else {
            uvBox.addClass("w3-yellow")
          }

          //clear previous five day forecasts
          $(".five-day").empty()

          //create the five day weather info

          $("#five-day-label").text("5-Day Forecast:")
    
          for (let i = 1; i < 6; i++) {
            let fiveForecastDate = moment.unix(data.daily[i].dt).format('L')
            let fiveTemp = data.daily[i].temp.day;
            let fiveWind = data.daily[i].wind_speed;
            let fiveHumidity = data.daily[i].humidity;
            let fiveIcon = data.daily[i].weather[0].icon;

            let forecastIcon = document.createElement("img")
            forecastIcon.setAttribute("src",`http://openweathermap.org/img/wn/${fiveIcon}.png`)

            //add formatting to the forecast boxes
            $(".five-day").addClass("w3-card w3-light-blue")

            let forecastBox = document.createElement("div")
            forecastBox.id = `weather-day-${[i]}`
            forecastBox.classList.add("w3-card", "w3-blue" )
            let forecastDate = document.createElement("h4")
            forecastDate.textContent = fiveForecastDate
            let forecastTemp = document.createElement("p")
            forecastTemp.textContent = `Temp: ${fiveTemp}°F`
            let forecastWind = document.createElement("p")
            forecastWind.textContent = `Wind: ${fiveWind} MPH`
            let forecastHumidity = document.createElement("p")
            forecastHumidity.textContent = `Humidity: ${fiveHumidity}%`

            $("#day"+[i]).append(forecastDate, forecastIcon, forecastTemp, forecastWind, forecastHumidity)
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    })
  }
}

//event listener for search
$("#search-button").on("click", function (e) {
  e.preventDefault()
  city = $("#search-box").val()

  //check to see if the city already exists in the arry, if not push to array and create a button
  if (pastSearch.indexOf(city) == -1 && invalidCity === false) {
    pastSearch.push(city)
    //create the button
    let previousCity = document.createElement("button")
    previousCity.id = "past-city"+pastSearch.length
    previousCity.classList.add("w3-button", "w3-gray", "w3-round", "past-city")
    previousCity.textContent = city
    $("#past-cities").append(previousCity)
  }
  invalidCity = false

  setLocalStorage()
  getCityLatLong(city)
});

//save updated changes to local storage
const setLocalStorage = () => {
  for (let i = 0; i < pastSearch.length; i++) {
    localStorage.setItem("pastCities", JSON.stringify(pastSearch));
  }
  // update array from local storage (race condition? A: no, saving to local storage is blocking/syncronous API)
  pastSearch = JSON.parse(localStorage.getItem("pastCities"));
  return
}

//event listener for history buttons
$(".past-city").on("click", function (e) {
  e.preventDefault()
  city = $(this).text()
  getCityLatLong(city)
});