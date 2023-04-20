//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Program: enter-location.js
// Description: Module will allow the user to enter a location for the application.
// Notes: N/A
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { FetchWeatherData } from "./weather-data";
import { LoadDisplayContent, CurrentLocationInfoIsDisplayed } from "./display-data";
import { ForecastIsDisplayed } from "../index.js";

// LocationInput(): Location Input factory function will collect the user input for the location.
const LocationInput = () => {
    const locationInput = document.querySelector('#user-location').value;
    
    return {locationInput};
}

// SubmitLocationInput(): The form input will be submitted here.
export function SubmitLocationInput(e) {
    e.preventDefault();
    const displaySelectedForecastDay = document.querySelector('.display-selected-forecast-day');
    const displayForecast = document.querySelector('.display-forecast');
    const displayHourlyForecastData = document.querySelector('.display-hourly-forecast');
    const forecastHourlyTime = document.querySelectorAll('.display-hourly-forecast > div > div:nth-child(1)');
    const forecastHourlyTemperature = document.querySelectorAll('.display-hourly-forecast > div > div:nth-child(2)');
    const forecastHourlyIcon = document.querySelectorAll('.display-hourly-forecast > div > div:nth-child(3)');
    const currentLocationInfo = document.querySelector('.current-location-info');
    const userMainContainer = document.querySelector('.user-main');
    const main = document.querySelector('.main');
    const errorInputMessage = document.querySelector('.error-input-message');

    const userLocationInput = LocationInput();

    const weatherData = FetchWeatherData(userLocationInput.locationInput);

    // Remove all of the weather data from the display weather data container (display-data-container).
    if (ForecastIsDisplayed.selectedForecastIsDisplayed === true)
    {
        displaySelectedForecastDay.childNodes[0].removeChild(document.querySelector('.display-selected-forecast-day > div:nth-child(1) img[src]'));
        displaySelectedForecastDay.childNodes[1].childNodes[1].textContent = "";
        displaySelectedForecastDay.childNodes[2].childNodes[1].textContent = "";
        displaySelectedForecastDay.childNodes[3].childNodes[1].textContent = "";
        displaySelectedForecastDay.childNodes[4].childNodes[1].textContent = "";
        displaySelectedForecastDay.childNodes[5].childNodes[1].textContent = "";
        displaySelectedForecastDay.childNodes[6].childNodes[1].textContent = "";
        displaySelectedForecastDay.childNodes[7].childNodes[1].textContent = "";
        displaySelectedForecastDay.childNodes[8].childNodes[1].textContent = "";

        const conditionIcon = document.createElement('img');
        displaySelectedForecastDay.childNodes[0].appendChild(conditionIcon);
        ForecastIsDisplayed.selectedForecastIsDisplayed = false;
        displaySelectedForecastDay.setAttribute('id', 'hide-display');
    }

    // Remove all the hourly forecast data from the display hourly forecast section (display-hourly-forecast).
    if (ForecastIsDisplayed.hourlyForecastIsDisplayed === true)
    {
        for (let i = 0; i < forecastHourlyTime.length; i++)
        {
            forecastHourlyTime[i].textContent = "";
        }

        for (let i = 0; i < forecastHourlyTime.length; i++)
        {
            forecastHourlyTemperature[i].innerHTML = "";
        }

        for (let i = 0; i < forecastHourlyIcon.length; i++)
        {
            forecastHourlyIcon[i].removeChild(document.querySelector('.display-hourly-forecast > div > div:nth-child(3) img[src]'));
            const hourlyForecastIcon = document.createElement('img');
            forecastHourlyIcon[i].appendChild(hourlyForecastIcon);
        }

        ForecastIsDisplayed.hourlyForecastIsDisplayed = false;
        displayHourlyForecastData.setAttribute('id', 'hide-display');
    }

    // Remove location and date data from the current-location-info container.
    for (let i = 0; i < 4; i++)
    {
        currentLocationInfo.childNodes[i].childNodes[1].textContent = "";
    }

    weatherData.then(function(data){
        for (const key of Object.entries(data))
        {
            if (key[0] === "error")
            {
                // Display an error message for the user.
                errorInputMessage.textContent = key[1].message;

                // Close the current location info section if it was displayed while the location input error occurred. 
                if (CurrentLocationInfoIsDisplayed.locationInfoIsDisplayed === true)
                {
                    main.setAttribute('id', 'hide-display');
                    CurrentLocationInfoIsDisplayed.locationInfoIsDisplayed = false
                }

                // Close the forecast section if it was displayed while the location input error occurred.
                if (ForecastIsDisplayed.forecastIsDisplayed === true)
                {
                    displayForecast.setAttribute('id', 'hide-display');
                    console.log('The forecast was displayed: ', ForecastIsDisplayed.forecastIsDisplayed);
                    ForecastIsDisplayed.forecastIsDisplayed = false;
                }

                // Close the selected forecast section if it was displayed while the location input error occurred.
                displaySelectedForecastDay.setAttribute('id', 'hide-display');
                 
                // Close the hourly forecast section if it was displayed while the location input error occurred.
                displayHourlyForecastData.setAttribute('id', 'hide-display');

            }
            else if (key[0] === "location" || key[1] === "current")
            {
                errorInputMessage.textContent = "";
                userMainContainer.removeAttribute('id');
                displayForecast.removeAttribute('id');
                LoadDisplayContent(weatherData);
            }
        }
    });
}