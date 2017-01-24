// Get the user's position
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
		var lat = position.coords.latitude;
		var long = position.coords.longitude;

		//Dark Sky API key (unfortunately can't hide the api key)
		var apiKey = "API_KEY";

		//Dark Sky URL
		var weatherURL = "https://api.darksky.net/forecast/";

		//Cross-Origin URL to allow use on Chrome
		var corsURL = "https://cors-anywhere.herokuapp.com/";

		//Full Weather Forecast URL
		var fullURL = corsURL + weatherURL + apiKey + "/" + lat + "," + long + "?daily";

		// Show fahrenheit by default
		// ...tempChange was the old variable, but it was defined inside of a for loop
		var usingFahrenheit = true;

		// Create an array to calculate between scales once and flip as a user wants
		var temperatures = {
			fahrenheit: [],
			celsius: []
		};

		function insertData(array) {
			// Use ternary operator here to assign F or C symbol to tempSymbol
			var tempSymbol = usingFahrenheit ? "&deg;F" : "&deg;C";

			return $.each(array, function(index, value) {
				$('.temp' + index).html(value + tempSymbol);
			});
		}

		$('#convertTemp').click(function() {
			// invert our usingFahrenheit flag
			usingFahrenheit = !usingFahrenheit;

			if (usingFahrenheit) {
				insertData(temperatures.fahrenheit);
			} else {
				insertData(temperatures.celsius);
			}
		});

		// jQuery JSON call to pull in temperature and icon information
		// This only gets called once, on page load
		// ...so we can assume the following:
		// - the data should be display in fahrenheit (the default)
		$.getJSON(fullURL, function(json) {
			// Display weather information

			var fahrenheitTemp;
			var celsiusTemp;
			var tempData;
			var icon;
			var desc;
			var dayName;
			var dayNum;

			// Set up the loop to go through the daily array
			for (i = 0; i < json.daily.data.length; i++) {
				// Format temp data
				fahrenheitTemp = Math.round(json.daily.data[i].apparentTemperatureMax);
				celsiusTemp = Math.round((fahrenheitTemp - 32) / 1.8);

				// Store data in temperatures object
				temperatures.fahrenheit.push(fahrenheitTemp);
				temperatures.celsius.push(celsiusTemp);

				//Retrieve icon data and display on page
				icon = json.daily.data[i].icon;
				$('.icon' + i).html("<i class='wi wi-forecast-io-" + icon + "'></i>");

				//Retrieve summary data and display on page
				desc = json.daily.data[i].summary;
				$('.desc' + i).html(desc);

				//Set up day name and display on page
				dayName = moment().add(i, "day").format("ddd");
				$('.day' + i).html(dayName);

				//Set up day date and display on page
				dayNum = moment().add(i, "day").format("D");
				$('.date' + i).html(dayNum);
			}

			// // display temp data on page
			insertData(temperatures.fahrenheit);
		});

		//Variables to get user's location using Google Maps API
		//Make sure to read Google Maps API Policies
		//https://developers.google.com/maps/documentation/geocoding/policies
		//Key
		var otherAPIKey = "API_KEY";
		//console.log(otherAPIKey);

		//Google Maps URL
		var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
		//console.log(googleURL);

		//Full URL to query address using coordinates
		var addressURL = googleURL + lat + "," + long + "&key=" + otherAPIKey;
		//console.log(addressURL);

		//Holds location of user
		var location;

		//jQuery JSON call to pull in address information
		//Using "for" loop to go through object array
		$.getJSON(addressURL, function(json) {
			for (i = 0; i < json.results.length; i++) {
				location = json.results[1].formatted_address;
				//console.log(location);

				//Display User's location
				$('.location').html(location);
			}
		});

		//Display the current month using Moment.js
		var month = moment().format('M');
		$('#monthNum').html(month);

		//Display the year using Moment.js
		var year = moment().format('YYYY');
		$('#year').html(year);

		//Display current time using Moment.js
		var dateTimeString = moment().format("LT");
		$(".time").html(dateTimeString);

	});
}
