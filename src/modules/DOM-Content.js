//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Program: DOM-Content.js
// Description: This is the Document Object Model content for all nodes in the DOM.
// Notes: N/A
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// CreateImageContent(): Will create image elements for any of the display containers.
const CreateDisplayImages = (() => {
    const CreateForecastImages = (items, displayContainer, index) =>{
        for(let i = 0; i < items; i++)
        {
            const forecastImages = document.createElement('img');
            displayContainer.childNodes[i].childNodes[index].appendChild(forecastImages);
        }
    }

    const CreateImageItems = (items, initialIndex, displayContainer) =>{
        for(let i = initialIndex; i < items; i++)
        {
            const imageItems = document.createElement('img');
            displayContainer.childNodes[i].appendChild(imageItems);
        }
    }
    return {CreateForecastImages, CreateImageItems};
})();

// CreateDisplayItems(): Will create content items for any of the display containers. 
const CreateDisplayItems = (() => {
    const CreateMainItems = (items, displayContainer) =>{
        for (let i = 0; i < items; i++)
        {
            const contentItems = document.createElement('div');
            displayContainer.appendChild(contentItems);
        }
    }

    const CreateChildrenItems = (items, initialIndex, displayContainer, childrenItemAmount) =>{
        for (let i = initialIndex; i < items; i++)
        {
            for (let j = 0; j < childrenItemAmount; j++)
            {
                const childrenItems = document.createElement('div');
                displayContainer.childNodes[i].appendChild(childrenItems);
            }
        }
    }

    const CreateConditionItems = (items, initialIndex, displayContainer) => {
        for (let i = initialIndex; i < items; i++)
        {
            for (let j = 0; j < 1; j++)
            {
                const tempAndConditionItems = document.createElement('div');
                displayContainer.childNodes[i].childNodes[2].appendChild(tempAndConditionItems);
            }
        }
    }

    const CreateTemperatureItems = (items, initialIndex, displayContainer) => {
        for(let i = initialIndex; i < items; i++)
        {
            for (let j = 0; j < 1; j++)
            {
                const temperatueItems = document.createElement('div');
                displayContainer.childNodes[i].childNodes[3].appendChild(temperatueItems);
            }
        }
    }
    
    return {CreateMainItems, CreateChildrenItems, CreateConditionItems, CreateTemperatureItems};
})();

// LoadDomContent(): Will load all the DOM Content for the application.
export function LoadDomContent(){
    SelectedForecastDayDOM();

    ForecastDOM();

    HourlyForecastDOM();

    CurrentLocationInfoDOM();
}

// ForecastDOM: Contians all the DOM content for displaying each forecast day.
function ForecastDOM(){
    const displayForecast = document.querySelector('.display-forecast');

    // Create the main items inside of display-forecast section.
    CreateDisplayItems.CreateMainItems(3, displayForecast);

    // Create the children items inside each main item in the display-forcast section
    CreateDisplayItems.CreateChildrenItems(3, 0, displayForecast, 4);

    // Create image items inside each child item to contain the weather icon for the day.
    CreateDisplayImages.CreateForecastImages(3, displayForecast, 0);

    // Create a forecast condition item inside each child item to contain the weather condition for the day.
    CreateDisplayItems.CreateConditionItems(3, 0, displayForecast);

    // Create a forecast temperature item for each child item to contain the temperature for the day.
    CreateDisplayItems.CreateTemperatureItems(3, 0, displayForecast);

    // Hide the forecast data by default.
    displayForecast.setAttribute('id', 'hide-display');
}

// SelectedForecastDayDisplayDom(): Will contain all the DOM content for displaying the weather data.
function SelectedForecastDayDOM(){
    const displaySelectedForecastDay = document.querySelector('.display-selected-forecast-day');

    // Create the main items inside the display-selected-forecast-day section.
    CreateDisplayItems.CreateMainItems(9, displaySelectedForecastDay);

    // Create an image item and append it to one of the main items in the display-selected-forecast-day section.
    CreateDisplayImages.CreateImageItems(1, 0, displaySelectedForecastDay);

    // Create children items and append it to the rest of the main items in the display-selected-forecast-day section.
    CreateDisplayItems.CreateChildrenItems(9, 1, displaySelectedForecastDay, 2);

    // Default label content for the children items.
    displaySelectedForecastDay.childNodes[1].childNodes[0].textContent = "Name:";
    displaySelectedForecastDay.childNodes[2].childNodes[0].textContent = "Region:";
    displaySelectedForecastDay.childNodes[3].childNodes[0].textContent = "Country:";
    displaySelectedForecastDay.childNodes[4].childNodes[0].textContent = "Temperature:";
    displaySelectedForecastDay.childNodes[5].childNodes[0].textContent = "Humidity:";
    displaySelectedForecastDay.childNodes[6].childNodes[0].textContent = "Precipitation:";
    displaySelectedForecastDay.childNodes[7].childNodes[0].textContent = "Wind:";
    displaySelectedForecastDay.childNodes[8].childNodes[0].textContent = "Condition:";

    // Hide display-selected-forecast-day section by default. 
    displaySelectedForecastDay.setAttribute('id', 'hide-display');
}

// HourlyForecastDOM(): Will contain DOM content for each forecast days hourly timeline.
function HourlyForecastDOM(){
    const displayHourlyForecast = document.querySelector('.display-hourly-forecast');

    // Architectural GUI: Time | Temperature | Icon

    // Create the main items for the hourly forecast section.
    CreateDisplayItems.CreateMainItems(8,displayHourlyForecast);
    
    // Create the children items that will hold the forecast hour, temperature, and icon.
    CreateDisplayItems.CreateChildrenItems(8, 0,displayHourlyForecast, 3);

    // Create image items that will contain the forecast icon.
    CreateDisplayImages.CreateForecastImages(8,displayHourlyForecast, 2);

    // Hide the hourly forecast by default.
   displayHourlyForecast.setAttribute('id', 'hide-display');
}

// DOMCurrentLocationInfo(): Displays the date and location info about the user search in the user-main container.
function CurrentLocationInfoDOM(){
    const currentLocationInfo = document.querySelector('.current-location-info');
    const userMain = document.querySelector('.user-main');

    // Create the main items in the current location info container. 
    CreateDisplayItems.CreateMainItems(4, currentLocationInfo);

    // Create the children items that will hold the  for each child item in the location info container.
    CreateDisplayItems.CreateChildrenItems(4, 0, currentLocationInfo, 2);

    // Default label content.
    currentLocationInfo.childNodes[0].childNodes[0].textContent = 'City:';
    currentLocationInfo.childNodes[1].childNodes[0].textContent = 'Region:';
    currentLocationInfo.childNodes[2].childNodes[0].textContent = 'Country:';
    currentLocationInfo.childNodes[3].childNodes[0].textContent = 'Date:';

    // Hide the user main container by default.
    userMain.setAttribute('id', 'hide-display');
}
