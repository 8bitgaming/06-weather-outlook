let apiKey = 'fbf31d182481f35e3b9fc07c433c4e62'
let pastSearch = []

const getCityLatLong = (city) => {
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units&appid=${apiKey}`

  fetch(apiURL).then(function(response) {
      if (response.ok){
      response.json().then(function(data) {
        let cityLat = data.coord.lat
        let cityLong = data.coord.lon
        let cityName = data.name
        getWeather(cityLat, cityLong, cityName);
      })
    }
  })
}

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
                $("#current-day-header").text(`${cityName} ${currentDay}`)
                console.log(cityName, data)
                
              });
            }
        })
    }    
  }

getCityLatLong("Minneapolis")




              // let cityName = data.name;
              // 
              // 
              // let temp = data.main.temp;
              // let wind = data.wind.speed;
              // let humidity = data.main.humidity;
              
              
              // cityName.textContent = ;
              
          
              // $("#todays-forecast").append(cityName, currentDay);
              // console.log("current day", data);