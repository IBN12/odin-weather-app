//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Program: display-data.js
// Description: All weather data for specific locations will be displayed from this module.
// Notes: N/A
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { ForecastIsDisplayed, ForecastData } from "../index.js";
import format from "date-fns/format";

// Days: Days of the week
const Days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday", 
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

// Time: Hourly time for the day
const Time = {
    0: "12:00 AM",
    3: "3:00 AM",
    6: "6:00 AM",
    9: "9:00 AM",
    12: "12:00 PM",
    15: "3:00 PM",
    18: "6:00 PM",
    21: "9:00 PM"
}

// CurrentTempUnitModule(): Will contain the current temperature unit.
const CurrentTempUnitModule = (() => {
    var temperatureUnit = "&#8457"; 
    const setTemperatureUnit = (temp) => {
        temperatureUnit = temp;
    }

    const  getTemperatureUnit = () => {
        return temperatureUnit;
    }

    return {setTemperatureUnit, getTemperatureUnit};
})();

// TransferForecastData() Module: Will contain arrays and objects for transfering the forecast data anywhere in the application. 
export const TransferForecastData = (() => {
    const transferForecastDay = [];
    const transferForecastCondition = [];
    const transferHourlyForecast = [];
    const transferForecastIcon = {};
    const transferLocationData = {};

    return {transferForecastDay, transferForecastCondition, transferHourlyForecast, transferForecastIcon, transferLocationData};
})();

// CurrentLocationInfoIsDisplayed() Module: Boolean value will prove if the location info section is hidden or not.
export const CurrentLocationInfoIsDisplayed = (() => {
    const locationInfoIsDisplayed = false;

    return {locationInfoIsDisplayed};
})();

// LoadDisplayContent(): Loads content for each display section using a thenable promise object.
export function LoadDisplayContent(weatherData){
    const forecastDayArray = [];
    const forecastConditionArray = [];
    const forecastTimeArray = [];
    
    weatherData.then(function(data){
        const forecastLocation = Object.assign({}, data.location);
        const forecast = Object.assign({}, data.forecast);

        // Grab each day from the forcast day array.
        forecast.forecastday.forEach(obj => {
            forecastDayArray.push(Object.assign({}, obj.day));
        });

        // Grab the hourly forecast for each day.
        forecast.forecastday.forEach(obj => {
            forecastTimeArray.push(Object.assign({}, obj.hour));
        });

        // Grab each weather condition from the data forecast day array.
        forecastDayArray.forEach(obj => {
            forecastConditionArray.push(Object.assign({}, obj.condition));
        });

        TransferForecastData.transferHourlyForecast = forecastTimeArray;

        DisplayCurrentLocationInfo(forecastLocation);

        DisplayForecastData(forecastDayArray, forecastConditionArray, forecast, forecastLocation);
    });
}

// DisplayCurrentLocationInfo(): Function will display location info from the user search.
function DisplayCurrentLocationInfo(locationInfo){
    const displayCurrentLocationInfo = document.querySelector('.current-location-info');
    const main = document.querySelector('.main');

    CurrentLocationInfoIsDisplayed.locationInfoIsDisplayed = true;
    if (main.hasAttribute('id'))
    {
        main.removeAttribute('id'); 
    }

    displayCurrentLocationInfo.childNodes[0].childNodes[1].textContent = locationInfo.name;
    displayCurrentLocationInfo.childNodes[1].childNodes[1].textContent = locationInfo.region;
    displayCurrentLocationInfo.childNodes[2].childNodes[1].textContent = locationInfo.country; 

    const date = new Date();
    const displayDate = format(new Date(date.getFullYear(), date.getMonth(), date.getDate()), 'MMM dd yyyy');

    for (const key in Days){
        if (parseInt(key) === date.getDay())
        {
            displayCurrentLocationInfo.childNodes[3].childNodes[1].textContent = `${Days[key]} ${displayDate}`;
        }
    }
}

// DisplayForecastData(): Function will display all the forecast days.
async function DisplayForecastData(forecastDay, forecastCondition, forecast, forecastLocation){
    const displayForecast = document.querySelector('.display-forecast');
    const forecastIcons = document.querySelectorAll('.display-forecast > div > div:nth-child(1) > img');
    const forecastDays = document.querySelectorAll('.display-forecast > div > div:nth-child(2)');
    const forecastConditions = document.querySelectorAll('.display-forecast > div > div:nth-child(3) > div:nth-child(1)');
    const celsiusButtonContainer = document.querySelector('.user-main > div:nth-child(2)');
    const fahrenheitButtonContainer = document.querySelector('.user-main > div:nth-child(3');

    ForecastIsDisplayed.forecastIsDisplayed = true;
    if (displayForecast.hasAttribute('id'))
    {
        displayForecast.removeAttribute('id');
    }


    // Fetch the forecast icons from each forecast day in the forecast condition object and return it as an array of responses.
    let index = 0;
    const forecastIconResponses = await Promise.all(
        forecastCondition.map(item => fetch(`https:${item.icon}`))
    );

    // Display the each forecast icon response in the forecast section. 
    for (const item of forecastIcons)
    {
        item.src = forecastIconResponses[index].url;
        index++;
    }

    // Search for the appropriate day of the week and display it in the forecast section.
    index = 0;
    forecast.forecastday.forEach(obj => {
        const forecastDate = new Date(obj.date);
        for(const key in Days)
        {
            if (forecastDate.getDay() === parseInt(key))
            {
                forecastDays[index].textContent = Days[key];
            }
        }
        index++;
    });

    index = 0;
    // Display the forecast condition in the forecast section. 
    forecastCondition.forEach((item, e) => {
        forecastConditions[index].textContent = item.text;
        index++;
    });

    // Copy all of the forecast parameters into a transfer module in order to transfer the data. 
    TransferForecastData.transferForecastDay = forecastDay;
    TransferForecastData.transferForecastCondition = forecastCondition;
    TransferForecastData.transferForecastIcon = Object.assign({}, forecastIconResponses);
    TransferForecastData.transferLocationData = Object.assign({}, forecastLocation);

    // Check whether or not the celsius unit or fahrenheit unit is being displayed with the temperature data. 
    if (celsiusButtonContainer.classList.contains('current'))
    {
        let fahrenheitUnit = "&#8457"; // fehrenheit html code
        ChangeTemperature(forecastDay, fahrenheitUnit);
    }
    else if (fahrenheitButtonContainer.classList.contains('current'))
    {
        let celsiusUnit = "&#8451"; // celsius html code 
        ChangeTemperature(forecastDay, celsiusUnit);
    }
}

// DisplayHourlyForecastData(): Will display the hourly forecast for each day that is selected.
export async function DisplayHourlyForecastData(hourlyForecastDay){
    const displayHourlyForecastData = document.querySelector('.display-hourly-forecast');
    const forecastHourlyTime = document.querySelectorAll('.display-hourly-forecast > div > div:nth-child(1)');
    const forecastHourlyTemperature = document.querySelectorAll('.display-hourly-forecast > div > div:nth-child(2)');
    const forecastHourlyIcon = document.querySelectorAll('.display-hourly-forecast > div > div:nth-child(3) img');

    if (displayHourlyForecastData.hasAttribute('id'))
    {
        displayHourlyForecastData.removeAttribute('id');
    }


    let militaryTimeArray = [];
    // Collect the military times from the object.
    for (const key in hourlyForecastDay)
    {
        militaryTimeArray.push(hourlyForecastDay[key].time.slice(11, 13));
    }

    let index = 0;
    let standardTimeArray = [];
    // Convert military times into standard times.
    for (const key in Time)
    {
        if (militaryTimeArray[index].startsWith("0"))
        {
            if (index === parseInt(key))
            {
                standardTimeArray.push(Time[key]);
            }
        }
        else if (index === parseInt(key))
        {
            standardTimeArray.push(Time[key]);
        }
        index = index + 3;
    }

    index = 0;
    // Display each standard time for the selected forecast day in the hourly forecast section.
    forecastHourlyTime.forEach(timeSlot => {
        timeSlot.textContent = standardTimeArray[index];
        index++;
    });

    index = 0;
    // Display the temperatures for the selected forecast day in the hourly forecast section.
    forecastHourlyTemperature.forEach(tempSlot => {
        tempSlot.innerHTML = `${DisplayHourlyForecastTemperature(hourlyForecastDay[index])} ${CurrentTempUnitModule.getTemperatureUnit()}`;
        index += 3;
    });

    index = 0;
    let hourlyConditionArray = [];
    // Grab the hourly condition for each forecast day.
    for (const key in hourlyForecastDay)
    {
        hourlyConditionArray.push(Object.assign({}, hourlyForecastDay[key].condition));
    }

    // Fetch the icon properties and return it as an array of responses.
    const hourlyIcon = await Promise.all(
        hourlyConditionArray.map(item => fetch(`https:${item.icon}`))
    );

    // Display the hourly icon properties for the selected forecast day in the hourly forecast section. 
    forecastHourlyIcon.forEach(iconSlot => {
        iconSlot.src = hourlyIcon[index].url;
        index += 3;
    });
}

// DisplaySelectedForecastData(): Will display the selected forecast day in the selected forecast section.
export function DisplaySelectedForecastData(forecastLocation, forecastDay, forecastCondition, forecastIcon){
    const displaySelectedForecastDay = document.querySelector('.display-selected-forecast-day');
    const conditionImage = document.querySelector('.display-selected-forecast-day > div:nth-child(1) img');

    if (displaySelectedForecastDay.hasAttribute('id'))
    {
        displaySelectedForecastDay.removeAttribute('id');
    }
 
    conditionImage.src = forecastIcon.url; 
    displaySelectedForecastDay.childNodes[1].childNodes[1].textContent = forecastLocation.name;
    displaySelectedForecastDay.childNodes[2].childNodes[1].textContent = forecastLocation.region;
    displaySelectedForecastDay.childNodes[3].childNodes[1].textContent = forecastLocation.country;
    displaySelectedForecastDay.childNodes[4].childNodes[1].innerHTML = `${DisplayTemperature(forecastDay)} ${CurrentTempUnitModule.getTemperatureUnit()}`;
    displaySelectedForecastDay.childNodes[5].childNodes[1].textContent =`${forecastDay.avghumidity}%`;
    displaySelectedForecastDay.childNodes[6].childNodes[1].textContent = `${forecastDay.totalprecip_in} in`;
    displaySelectedForecastDay.childNodes[7].childNodes[1].textContent = `${forecastDay.maxwind_mph} mph`;
    displaySelectedForecastDay.childNodes[8].childNodes[1].textContent = forecastCondition.text;
}

// TemperatureForecastData(): Displays the temperature for each forecast day. 
export function ChangeTemperature(dataForecastDay, tempUnit){
    const temperatureContainer = document.querySelectorAll('.display-forecast > div > div:nth-child(4) > div');

    let index = 0;

    CurrentTempUnitModule.setTemperatureUnit(tempUnit);

    // displays temperature in either fahrenhiet or celsius. (&#8457 -> Fahrenheit | &#8451 -> Celsius)
    if (tempUnit === '&#8457')
    {
        dataForecastDay.forEach(tempItem => {
            temperatureContainer[index].innerHTML = `${tempItem.maxtemp_f} ${tempUnit}`;
            index++;
        });

        // If the user clicked on any of weather icons in the forecast section to view the data for that day. 
        if (ForecastIsDisplayed.selectedForecastIsDisplayed === true)
        {
            DisplaySelectedForecastData(ForecastData.locationData, ForecastData.forecastDay, ForecastData.forecastCondition, ForecastData.forecastIcon);
        }

        if (ForecastIsDisplayed.hourlyForecastIsDisplayed === true)
        {
            DisplayHourlyForecastData(ForecastData.hourlyForecastDay);
        }
    }
    else if (tempUnit === '&#8451')
    {
        dataForecastDay.forEach(tempItem => {
            temperatureContainer[index].innerHTML = `${tempItem.maxtemp_c} ${tempUnit}`;
            index++;
        });

        if (ForecastIsDisplayed.selectedForecastIsDisplayed === true)
        {
            DisplaySelectedForecastData(ForecastData.locationData, ForecastData.forecastDay, ForecastData.forecastCondition, ForecastData.forecastIcon);
        }

        if (ForecastIsDisplayed.hourlyForecastIsDisplayed === true)
        {
            DisplayHourlyForecastData(ForecastData.hourlyForecastDay);
        }
    }
}

// DsiplayTemperatureWeatherData(): ...
function DisplayTemperature(dataForecastDay){
    if (CurrentTempUnitModule.getTemperatureUnit() === '&#8457')
    {
        return dataForecastDay.maxtemp_f;
    }
    else if (CurrentTempUnitModule.getTemperatureUnit() === '&#8451')
    {
        return dataForecastDay.maxtemp_c;
    }
}

// DisplayHourlyForecastTemperatureData(): ...
function DisplayHourlyForecastTemperature(hourlyForecast){
    if (CurrentTempUnitModule.getTemperatureUnit() === '&#8457')
    {
        return hourlyForecast.temp_f;
    }
    else if (CurrentTempUnitModule.getTemperatureUnit() === '&#8451')
    {
        return hourlyForecast.temp_c;
    }
}
