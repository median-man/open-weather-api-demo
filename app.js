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

        console.log(data);
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
