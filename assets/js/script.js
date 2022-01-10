//need to setup github secret to store/use apikey

let pastSearch = []

//initial call to get city name and coordinates for use by the getWeather api call
const getCityLatLong = (city) => {
  
  console.log(city)
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units&appid=${apiKey}`

  fetch(apiURL).then(function(response) {
      if (response.ok){
      response.json().then(function(data) {
        let cityLat = data.coord.lat
        let cityLong = data.coord.lon
        let cityName = data.name
        console.log(cityLat, cityLong, cityName)
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

        fetch(apiURL).then(function(response) {
            if (response.ok){
              response.json().then(function(data) {

                //Update the header information for the current day
                let currentDay = moment().format('L')
                // let weatherIcon = data.current.weather[0].icon;
                //http://openweathermap.org/img/wn/10d@2x.png
                $("#current-day-header").text(`${cityName} (${currentDay})`)
                
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
                } else if (uv > 8 ) {
                  uvBox.addClass("w3-red")
                } else {
                  uvBox.addClass("w3-yellow")
                }

                //create the five day forecast
                for (let i=0; i<5; i++){
                  // let forecastBox = document.createElement("p")
                  // forecastBox.id = `weather-day-${[i]}`
                  // forecastBox.addClass("w3-card w3-blue")
                  $("#day"+i).text("Day")
                  // $("#day"+[i]).append()
                }
                
              });
            }
        })
    }    
  }

//   // create event listener for search
  $("#search-button").on("click", function(e){
    e.preventDefault()
    city = $("#search-box").val()
    // pastSearch.push(city)
    // localStorage.setItem(pastSearch)
    // displayPastCities()
    getCityLatLong(city)
  });

//   //display list of past searches
//   const displayPastCities = () => {
    
//     //check and load from local storage instead of array
//   if (pastSearch.length > 0) {
//     for (i=0; i < pastSearch.length; i++) {
//     let previousCity = document.createElement("button")
//     previousCity.id = `"past-city"${[i]}`
//     previousCity.addClass("w3-button w3-light-blue w3-round")
//     $("#past-cities").append(previousCity)
//     }
//   }
//   return
// }

// getCityLatLong("Minneapolis")
