var APIkey = "56836e2a46736cad61161f2be7acb461";
var todayEl = $('#today');
var forecastEl = $('#forecast');
var searchBtn = $('#search-button');
var clearBtn = $('#clear-history');
var searchInput = "";
var searchHistory = [];

// SIDE PANEL

// search button
searchBtn.on('click', function (event) {
    event.preventDefault();
    searchInput = $('#search-input').val().trim();
    getForecast();
    cityButton();
});

// generated city buttons
function cityButton() {
    var button = $('<button>').text(searchInput);
    button.attr({
        class: 'search-history mb-3',
        "data-name": searchInput
    });
    $('#history').append(button);
    searchHistory.push(searchInput);
    localStorage.setItem("cities", JSON.stringify(searchHistory));
};

$(document).on("click", ".search-history", function (event) {
    searchInput = $(this).attr("data-name");
    getForecast();
});

// render buttons from local storage
function renderButtons() {
    searchHistory = JSON.parse(localStorage.getItem("cities")) || [];
        for (i = 0; i < searchHistory.length; i++) {
            var button = $('<button>').text(searchHistory[i]);
            button.attr({
                class: 'search-history mb-3',
                "data-name": searchHistory[i]
            });
            $('#history').append(button);
        }
};
renderButtons();

// clear button
clearBtn.on("click", function (event) {
    event.preventDefault();
    searchHistory = [];
    localStorage.removeItem("cities");
    $('#history').empty();
});


// MAIN SECTION
function getForecast() {
    todayEl.empty();
    $('#forecast-title').empty();
    forecastEl.empty();

    var geoQueryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchInput + "&limit=5&appid=" + APIkey;

    $.ajax({
        url: geoQueryURL,
        method: "GET"
    }).then(function (response) {

        var lon = response[0].lon.toFixed(2);
        var lat = response[0].lat.toFixed(2);
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&cnt=40&appid=" + APIkey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            var currentDay = $('<div>').attr('class', "card p-4");;

            var currentCity = $('<h2>').text(
                response.city.name + " (" +
                dayjs(response.list[0].dt_txt).format('DD/MM/YY') + ")"
            );

            var currentIcon = $('<img>').attr({
                src: "https://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png",
                height: "75px",
                width: "75px"
            });

            var currentTemp = $('<p>').text("Temp: " + (response.list[0].main.temp_max - 273.15).toFixed(2) + " °C");
            var currentWind = $('<p>').text("Wind: " + response.list[0].wind.speed + " KPH");
            var currentHumidity = $('<p>').text("Humidity: " + response.list[0].main.humidity + "%");
            todayEl.append(currentDay);
            currentDay.append(currentCity, currentIcon, currentTemp, currentWind, currentHumidity);

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {

                var forecastTitle = $('<h3>').text("5-Day forecast: ");
                $('#forecast-title').append(forecastTitle);

                for (var i = 1; i <=5; i++) {

                    var forecastCard = $('<div>').attr('class', "card forecast-card m-3");

                    var date = $('<h4>').text(dayjs(response.list[i].dt_txt).format('DD/MM/YY'));
                    date.attr('class', 'card-title');

                    var forecastIcon = $('<img>').attr({
                        src: "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png",
                        height: "50px",
                        width: "50px"
                    });

                    var temp = $('<p>').text("Temp: " + (response.list[i].main.temp_max - 273.15).toFixed(2) + " °C");
                    var wind = $('<p>').text("Wind: " + response.list[i].wind.speed + " KPH");
                    var humidity = $('<p>').text("Humidity: " + response.list[i].main.humidity + "%");

                    forecastEl.append(forecastCard);
                    forecastCard.append(date, forecastIcon, temp, wind, humidity);
                }

            })
        });
    });
};