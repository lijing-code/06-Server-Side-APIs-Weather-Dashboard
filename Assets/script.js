var cityNameEl = $('#location-keyword');
var searchBtn = $('.btn')
var searchHistory = $('.search-history');
var showWeatherEl = $('.location-infor');
var apisKey = 'ca6bab3bfcdfbc0dda4246043e62e34b';

// Define Search Button when the user click it
var searchStart = function(event){
    event.preventDefault();
    if(!cityNameEl.val()){
        alert("Please enter a correct city name!");
        return;
    }
    showSearchHistory(cityNameEl.val())   
}

// Uses localStorage to store persistent city; show the history search for the user; list the record under the Search Button;
var searchHistoryRecord =[];
var showSearchHistory = function(cityName){
    searchHistoryRecord.push(cityName);
    localStorage.setItem('searchHistoryRecord', JSON.stringify(searchHistoryRecord));
    var addCity = $('<div>').text(cityName);    
    var cityLink = $('<button>').addClass('rounded w-75 d-flex justify-content-center p-2 ml-5 mb-2 bg-secondary text-white text-center');
    cityLink.append(addCity);
    searchHistory.append(cityLink);
    showCurrentWeather(cityName);
    fiveDayForecast(cityName);
    cityNameEl.val("");

    // When the user click the history search button, the weather information of the city will show on right side.
    cityLink.each(function(){
        $(this).on("click",function(event){
            event.preventDefault();
            showCurrentWeather(cityName); 
            fiveDayForecast(cityName);  
        })
    })   
}

// Function of the current weather section
var showCurrentWeather = function(locationName){
    var getLocation = 'https://api.openweathermap.org/data/2.5/weather?q='+locationName+'&appid='+apisKey+'&units=imperial'; 
    // Fetch the currentWeatherUrl data to get the lat and lon of the city
    fetch(getLocation) 
        .then(function (response) {
            if (response.ok) {
                return response.json(); 
            }
        })
        .then(function (data) {  
            // Use the city's lat and lon to fetch the displayed information for that city
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid='+apisKey+'&units=imperial')
                .then(function(response){
                    if (response.ok) {
                        return response.json(); 
                    }
                })
                .then(function(cityLocation){
                    showWeatherEl.addClass('border border-dark m-3');
                    // Current weather title (city-name; date; and weather icon)
                    var cityName = $('<h2>').text(data.name + ' (' + moment().format('L') + ')').addClass('fw-bolder fs-1 m-1');
                    var weatherLogo = $('<img>');
                    var iconcode = cityLocation.current.weather[0].icon;
                    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                    weatherLogo.attr('src', iconurl);
                    cityName.append(weatherLogo);
                    showWeatherEl.append(cityName);
                    // Current weather--temperature
                    var cityTemp = $('<div>');
                    cityTemp.text('Temp: ' + data.main.temp + '°F').addClass('m-1');
                    showWeatherEl.append(cityTemp);
                    // Current weather--wind
                    var cityWind = $('<div>').text('Wind: ' + data.wind.speed + ' MPH').addClass('m-1');
                    showWeatherEl.append(cityWind);
                    // Current weather--humidity
                    var cityHumidity = $('<div>').text('Humidity: ' + data.main.humidity + ' %').addClass('m-1');
                    showWeatherEl.append(cityHumidity);
                    // Current weather--UV index with color
                    var uvIndex = $('<span>');
                    var num = cityLocation.current.uvi
                    uvIndex.text(num);
                    var cityUvi = $('<div>').text('UV Index: ').addClass('m-1');
                    cityUvi.append(uvIndex);
                    // Add color for UV index based on its value 
                    if(num < 2){
                        uvIndex.addClass('bg-success p-1');
                    }else if (num >= 2 && num < 5){
                        uvIndex.addClass('bg-warning p-1');
                    }else if (num >= 5 && num < 7){
                        uvIndex.addClass('bg-danger p-1');
                    }else{
                        uvIndex.addClass('bg-primary p-1');
                    }
                    showWeatherEl.append(cityUvi);
                })
                // Clear the input column
                .then(showWeatherEl.text(""));
            })
        }
// Function for forecasting 5 days' weather of the city
var fiveDayForecast = function(cityName){
    var getLocation = 'https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+apisKey+'&units=imperial'; 
    // Fetch the currentWeatherUrl data to get the lat and lon of the city
    fetch(getLocation) 
        .then(function (response) {
            if (response.ok) {
                return response.json(); 
            }
        })
        .then(function (data) {  
            // Use the city's lat and lon to fetch the displayed information for that city
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid='+apisKey+'&units=imperial')
                .then(function(response){
                    if (response.ok) {
                        return response.json(); 
                    }
                })
            .then(function(forecast){
                var fiveDaysSection = $('.five-day-forecast');
                fiveDaysSection.addClass('border border-white m-3');
                var header = $('<h2>').text('5-Days-Forecast')
                fiveDaysSection.append(header);
                // Create <div> for each forecast days column
                var forecastPart = $('<div>').addClass('row justify-content-around');
                for(var i = 0; i < 5; i++){    
                    var forecastColumn = $('<div>').addClass('col-12 col-md-2 col-lg-2 text-white d-inline p-2').attr('style', 'background-color: rgba(18, 41, 68, 0.92)');
                    // Date
                    var forecastDate = $('<div>').text(moment().add(i+1, 'days').format('L')).addClass('fw-bold');
                    // Weather icon
                    var weatherLogo = $('<img>');
                    var iconcode = forecast.daily[i+1].weather[0].icon;
                    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                    weatherLogo.attr('src', iconurl);
                    //Temp
                    var temp = $('<div>').text('Temp: '+ forecast.daily[i+1].temp.day + '°F').addClass('m-1');
                    //Wind
                    var wind = $('<div>').text('Wind: '+ forecast.daily[i+1].wind_speed + ' MPH').addClass('m-1');
                    //Humidity
                    var humidity = $('<div>').text('Humidity: '+ forecast.daily[i+1].humidity + ' %').addClass('m-1');
                    forecastColumn.append(forecastDate).append(weatherLogo).append(temp).append(wind).append(humidity);
                    forecastPart.append(forecastColumn);
                    fiveDaysSection.append(forecastPart);
                }
            })
            .then($('.five-day-forecast').text(""));
        })
}
    
searchBtn.on('click',searchStart);
