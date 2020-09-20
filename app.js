$(function () {
  function showLoader() {
    var spinner = $("<span>").attr({
      class: "spinner-border spinner-border-sm",
      role: "status",
      "aria-hidden": "true",
    });

    var srcreenReaderText = $("<span>")
      .addClass("sr-only")
      .text("Loading weather forecast...");

    $("#get-forecast-button")
      .attr("disabled", true)
      .empty()
      .append(spinner, srcreenReaderText);
  }

  function hideLoader() {
    $("#get-forecast-button")
      .attr("disabled", false)
      .empty()
      .text("Get Forecast");
  }

  function renderDateTime(ts) {
    var date = new Date(ts);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var result = month + "/" + day + "<br>";
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (hours === 0) {
      result += "12";
    } else {
      result += hours % 12;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    result += ":" + minutes;
    if (hours < 12) {
      result += " AM";
    } else {
      result += " PM";
    }
    return result;
  }

  function renderForecast(data) {
    $("#city-name").text(data.city.name);

    var tbody = $("#forecast-table-body").empty();

    var forecastEntry;
    for (var i = 0; i < data.list.length; i += 1) {
      forecastEntry = data.list[i];

      // TODO: adjust times to target city time zone using forecastEntry.dt
      var ts = forecastEntry.dt * 1000;
      var dateCell = $("<td>").append(renderDateTime(ts));
      var weatherIconImg = $("<img>").attr({
        src:
          "http://openweathermap.org/img/wn/" +
          forecastEntry.weather[0].icon +
          ".png",
        alt: forecastEntry.weather[0].description,
      });
      var weatherIconCell = $("<td>").append(weatherIconImg);
      var tempCell = $("<td>").html(
        Math.round(forecastEntry.main.temp) + "&deg; F"
      );
      var humidCell = $("<td>").text(forecastEntry.main.humidity + " %");
      var windCell = $("<td>").html(
        forecastEntry.wind.speed + " mph<br>" + forecastEntry.wind.deg + "&deg;"
      );
      var tr = $("<tr>").append(
        dateCell,
        weatherIconCell,
        tempCell,
        humidCell,
        windCell
      );
      tbody.append(tr);
    }

    $("#forecast-results").removeClass("d-none");
  }

  function fetchCityForecast(city) {
    var openWeatherApiKey = "4c1bfef47318cc529e11b4d57eaf17db";
    var url =
      "https://api.openweathermap.org/data/2.5/forecast?appid=" +
      openWeatherApiKey;
    url += "&q=" + city;
    url += "&units=imperial";

    // display loader and disable submit button in the form
    showLoader();

    $.ajax({
      url: url,
      method: "GET",
    })
      .done(function (data) {
        // enable submit button in form
        hideLoader();
        renderForecast(data);
      })
      .fail(function (request) {
        // TODO: display not found message using something other than an alert
        if (request.status === 404) {
          alert("Could not find forecast for " + city);
        } else {
          alert("Unable to reach Weather Service. Try again later.");
        }
      });
  }

  // attach form submit listener
  $("#forecast-search-form").on("submit", function (event) {
    event.preventDefault();
    var cityInput = $("#city-input");
    var city = cityInput.val().trim();

    // TODO: better validation needed. Only checks for empty input.
    if (city !== "") {
      fetchCityForecast(city);
      cityInput.val("");
    }

    // TODO: Handle input validation error
  });
});
