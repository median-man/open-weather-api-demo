$(function () {
  // attach form submit listener
  $("#forecast-search-form").on("submit", function (event) {
    event.preventDefault();
    // define function for handling form submit
    var cityInput = $("#city-input");
    var city = cityInput.val().trim();

    if (city !== "") {
      alert(city);
      cityInput.val("");
    }
  });
});
