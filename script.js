windSpeed = document.querySelector("#windSpeed");
humidity = document.querySelector(".humidity");
weather = document.querySelector(".weather");
desc = document.querySelector(".desc");
API = "8cf5ac5621c8d0266298a149e49d7514";
const setWeatherDetails = (data) => {
  // console.log(data);
  desc.innerHTML = data.weather[0].description;
  weather.innerHTML = Math.round(data.main.temp - 273.15) + "°c";
  humidity.innerHTML = data.main.humidity + "%";
  windSpeed.innerHTML = data.wind.speed + "km/h";
  switch (data.weather[0].main) {
    case "Clouds":
      weatherIcon.src = "Images/clouds.png";
      break;
    case "Clear":
      weatherIcon.src = "Images/sun.png";
      break;
    case "Rain":
      weatherIcon.src = "Images/rainy.png";
      break;
    case "Mist":
      weatherIcon.src = "Images/mist.png";
      break;
    case "Snow":
      weatherIcon.src = "Images/snow.png";
      break;
    case "Haze":
      weatherIcon.src = "Images/haze.png";
      break;
  }
};

const callAPI = (id, city) => {
  const cityNameDisplay = document.getElementById("cityNameDisplay");
  const cityNameInput = document.getElementById("searchInput");
  const cityName = cityNameInput.value;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${id}`
  )
    .then((response) => {
      if (!response.ok) {
        alert("Check spelling of City and try again or Something Went Wrong!");
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      cityNameDisplay.textContent = `${cityName}`;
      setWeatherDetails(data);
    })
    .catch((error) => console.log(error));
};
searchButton.addEventListener("click", (e) => {
  if (searchInput.value == "") {
    alert("Please Enter City Name.");
  } else {
    callAPI(API, "Delhi");
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    // searchButton.click();
    callAPI(API, "Delhi");
  }
});

searchButton.click();

//current location feature
const currentLocationButton = document.getElementById("currentLocationButton");

currentLocationButton.addEventListener("click", () => {
  getCurrentLocation();
});

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Call the API with the obtained coordinates
        callAPIWithCoordinates(latitude, longitude);
      },
      (error) => {
        console.error(error);
        alert(
          "Unable to retrieve your location. Please enter a city name manually."
        );
      }
    );
  } else {
    alert(
      "Geolocation is not supported by your browser. Please enter a city name manually."
    );
  }
};

const callAPIWithCoordinates = (latitude, longitude) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API}`
  )
    .then((response) => {
      if (!response.ok) {
        alert("Something Went Wrong!");
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // the displayed city name
      cityNameDisplay.textContent = `Weather in Your Location`;
      //the value of the input box to the current location
      searchInput.value = data.name;
      //the weather details
      setWeatherDetails(data);
    })
    .catch((error) => console.log(error));
};
