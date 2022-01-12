//need to setup github secret to store/use apikey
let apiKey = 'fbf31d182481f35e3b9fc07c433c4e62'
let pastCities = {}

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

210
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
    }
  })
}

//gets all weather data and displays on the page
const getWeather = (cityLat, cityLong, cityName) => {
  if (cityLat && cityLong) {
    let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&units=imperial&exclude=hourly,minutely,alerts&appid=${apiKey}`

    fetch(apiURL).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data)

          //Update the header information for the current day
          let currentDay = moment().format('L')
          let weatherIcon = data.current.weather[0].icon;
          let icon = document.createElement("img")
          icon.setAttribute("src",`http://openweathermap.org/img/wn/${weatherIcon}.png`)
          $("#current-day-header").text(`${cityName} (${currentDay})`)
          $("#current-day-header").append(icon)

          //create the current day weather info
          let temp = data.current.temp;
          let wind = data.current.wind_speed;
          let humidity = data.current.humidity;

          $("#current-temp").text(`Temp: ${temp}°F`);
          $("#current-wind").text(`Wind: ${wind} MPH`);
          $("#current-humidity").text(`Humidity: ${humidity}%`);

          let uv = data.current.uvi
          let uvBox = $("#current-uv-value")
          uvBox.text(uv)

          if (uv < 4) {
            uvBox.addClass("w3-green")
          } else if (uv > 7) {
            uvBox.addClass("w3-red")
          } else {
            uvBox.addClass("w3-yellow")
          }
        });
      }
    })
  }
}



//   // create event listener for search
$("#search-button").on("click", function (e) {
  e.preventDefault()
  city = $("#search-box").val()

  //check to see if the city already exists in the arry, if not push to array and create a button
  if (pastSearch.indexOf(city) == -1) {
    pastSearch.push(city)
    //create the button
    let previousCity = document.createElement("button")
    previousCity.id = "past-city"+pastSearch.length
    previousCity.classList.add("w3-button", "w3-gray", "w3-round", "past-city")
    previousCity.textContent = city
    $("#past-cities").append(previousCity)
  }

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


// const getFiveDay = (cityName) => {
  
//   if (cityName) {
//     let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`

//     fetch(apiURL).then(function (response) {
//       if (response.ok) {
//         response.json().then(function (data) {
         

//           //create the five day forecast
//             for (let i = 0; i < data.list.length; i++) {
//               let forecastDate = data.list[i].dt_txt;
//               let temp = data.list[i].main.temp;
//               let wind = data.list[i].wind.speed;
//               let humidity = data.list[i].main.humidity;
//               let icon = data.list[i].weather[0].icon;
//               console.log(forecastDate, temp, wind, humidity, icon)
//               // let forecastBox = document.createElement("p")
//               // forecastBox.id = `weather-day-${[i]}`
//               // forecastBox.addClass("w3-card w3-blue")
//               // $("#day" + i).text("Day")
//               // $("#day"+[i]).append()
//             }
//           })
//         }
//     })
//   }
// }