let apiKey = 'fbf31d182481f35e3b9fc07c433c4e62'
let pastSearch = []


const getTodaysWeather = (city) => {
    if (city) {
        
      let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

        fetch(apiURL).then(function(response) {
            if (response.ok){
            response.json().then(function(data) {
              var cityName = document.createElement("h3");
              var currentDay = moment().format('L')
              cityName.textContent = data.name;
                   
              // append to container
              $("#todays-forecast").append(cityName, currentDay);
              console.log("current day", data);
            });
            }
        }
    
        )}
}

const getFiveDayForecast = (city) => {
  if (city) {
      
    let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

      fetch(apiURL).then(function(response) {
          if (response.ok){
          response.json().then(function(data) {
            console.log("five day", data);
          });
          }
      }
  
      )}
}

getTodaysWeather("Minneapolis")
getFiveDayForecast("Minneapolis")