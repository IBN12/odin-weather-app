//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Program: index.js
// Description: The main javascript program for the application.
// Notes:
/** |async|
 * The word "async" before a function means one simple thing: a function always returns a promise. Other values
 * are wrapped in a resolved promise automatically. 
 */

/** |await|
 * await literally suspends the function execution until the promise settles, and then resumes it
 * with the promise result. That doesn't cost any CPU resources, because the JavaScript engine can do other jobs
 * in the meantime: execute other scripts, handle events, etc.
 */

/** |Error Handling|
 * If a promise resolves normally, then 'await promise' returns the result. But in the case of a rejection, it throws
 * the error, just as if there were a throw statement at that line.
 */
//
// Project Assignments: -> Allow the user the ability to search for a specific location and
// toggle displaying the data Fahrenheit and Celsius. Write the functions that hit the API. You're
// going to want functions that can take a location and return the weather data for that location.
// For now, just console.log() the information. 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { LoadDomContent } from "./modules/DOM-Content";
import { SubmitLocationInput } from "./modules/enter-location";
import { TransferForecastData, DisplaySelectedForecastData, ChangeTemperature, DisplayHourlyForecastData } from "./modules/display-data";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// |User Main DOM Content|
const celsiusButton = document.querySelector('.celsius-button');
const celsiusButtonContainer = document.querySelector('.user-main > div:nth-child(2)');
celsiusButtonContainer.classList.add('current'); // Celsius container will be current the container displayed in the grid.

const fahrenheitButton = document.querySelector('.fahrenheit-button');
const fahrenheitButtonContainer = document.querySelector('.user-main > div:nth-child(3)');
fahrenheitButtonContainer.classList.add('hide'); // Hide fahrenheit button by default.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// |Load DOM Content|
LoadDomContent();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// |Weather Is Diplayed Module Station|
// WeatherIsDisplayed() Module: Will contain boolean values to state if the weather is displayed in the selected section or forecast section.
export const ForecastIsDisplayed = (()=>{
    var selectedForecastIsDisplayed = false;
    var hourlyForecastIsDisplayed = false;
    var forecastIsDisplayed = false;
    
    return {hourlyForecastIsDisplayed, selectedForecastIsDisplayed, forecastIsDisplayed};
})();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//|Forecast Data Module|
// ForecastData() Module: Will contain arrays and objects to assist in transfering the forecast data. 
export const ForecastData = (()=>{
    const locationData = {};
    const hourlyForecastDay = {};
    const forecastIcon = [];
    const forecastCondition = [];
    const forecastDay = [];

    return {locationData, hourlyForecastDay, forecastIcon, forecastCondition, forecastDay};
})();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// |User Interface Module Station|
// UIStation(): User Interface module pattern. 
const UIStation = (()=>{
    const locationInputButton = document.querySelector('.user-input-container > form > div:nth-child(2) button');
    locationInputButton.addEventListener('click', e => {
        SubmitLocationInput(e);
        const locationForm = document.querySelector('.user-input-container > form');
        locationForm.reset(); // Resets the form.
    });

    const forecastIcon = document.querySelectorAll('.display-forecast > div > div:nth-child(1) img');
    for (let i = 0; i < forecastIcon.length; i++)
    {
        forecastIcon[i].addEventListener('click', () => {
            // Display the selected forecast data in the selected forecast day section.
            DisplaySelectedForecastData(TransferForecastData.transferLocationData, TransferForecastData.transferForecastDay[i], TransferForecastData.transferForecastCondition[i], TransferForecastData.transferForecastIcon[i]);

            // Reveal the display-selected-foredast-day section.
            const displaySelectedForecastDay = document.querySelector('.display-selected-forecast-day');
            displaySelectedForecastDay.removeAttribute('id');

            // Hourly forecast for the selected forecast day.
            ForecastIsDisplayed.hourlyForecastIsDisplayed = true;
            ForecastData.hourlyForecastDay = Object.assign({}, TransferForecastData.transferHourlyForecast[i]);
            DisplayHourlyForecastData(ForecastData.hourlyForecastDay);

            // Reveal hourly forecast data for the selected forecast day.
            const displayHourlyForecast = document.querySelector('.display-hourly-forecast');
            displayHourlyForecast.removeAttribute('id');

            // Re-enters weather information for the individual weather display section. 
            ForecastIsDisplayed.selectedForecastIsDisplayed = true;
            ForecastData.locationData = Object.assign({}, TransferForecastData.transferLocationData);
            ForecastData.forecastIcon = TransferForecastData.transferForecastIcon[i];
            ForecastData.forecastCondition = TransferForecastData.transferForecastCondition[i];
            ForecastData.forecastDay = TransferForecastData.transferForecastDay[i];
        });
    }

    // Change to celsius
    celsiusButton.addEventListener('click', () => {
        fahrenheitButtonContainer.classList.remove('hide');
        fahrenheitButtonContainer.classList.add('current');

        celsiusButtonContainer.classList.add('hide');
        celsiusButtonContainer.classList.remove('current');

        let celsiusUnit = "&#8451";

        ChangeTemperature(TransferForecastData.transferForecastDay, celsiusUnit);
    });

    // Change to fahrenheit
    fahrenheitButton.addEventListener('click', () => {
        celsiusButtonContainer.classList.remove('hide');
        celsiusButtonContainer.classList.add('current');

        fahrenheitButtonContainer.classList.add('hide');
        fahrenheitButtonContainer.classList.remove('current');

        let fahrenheitUnit = "&#8457";

        ChangeTemperature(TransferForecastData.transferForecastDay, fahrenheitUnit);
    });
})();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
