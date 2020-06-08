const form = document.querySelector('#form');
const city = document.querySelector('#city');
const submit = document.querySelector('#submit');
const responseArea = document.querySelector('.response');
const list = document.querySelector('#cities');
const cityId = document.querySelector('#city-code');

/**
 * Prevent form from reloading page
 */
form.addEventListener('submit', e => {
    e.preventDefault();
});

/**
 * Populate list of cities from user input
 */
city.addEventListener('keyup', e => {
    const key = e.keyCode;
    let numChar = city.value.length;
    if (numChar >= 3 && key != 13 && key != 38 && key != 40) {
        let cityCheck = {
            city: city.value
        };
        fetch('./script/fill-list.php', {
            method: 'POST',
            body: JSON.stringify(cityCheck)
        }).then(
            response => response.json()
        ).then(
            data => {
                //console.log(data);
                let optionList = document.createElement('span');
                data.forEach(row => {
                    let option = document.createElement('option');
                    option.setAttribute('data-value', row.city_id);
                    option.value = row.city_name + ' ' + row.city_country;
                    optionList.appendChild(option);
                });
                list.innerHTML = optionList.innerHTML;
            }
        );
    }
});

/**
 * Select city from option list
 */
city.addEventListener('input', () => {
    let options = list.childNodes;
    options.forEach(option => {
        if (option.value === city.value) {
            cityId.textContent = option.getAttribute('data-value');
        }
    });
});

/**
 * Prepare data for sending
 */
submit.addEventListener('click', () => {
    let cityName = cleanInput(city.value);
    if (cityName != '' && cityId.textContent === '') {
        responseArea.classList.remove("response-err");
        responseArea.classList.add("response-ok");
        let formData = {
            name: cityName,
            id: 0
        };
        postData(formData);
    } else if (cityId.textContent != '') {
        responseArea.classList.remove("response-err");
        responseArea.classList.add("response-ok");
        let formData = {
            name: cityName,
            id: cityId.textContent
        };
        postData(formData);
    } else {
        responseArea.classList.remove("response-ok");
        responseArea.classList.add("response-err");
        responseArea.innerText = "Enter city name please!";
    }
});

/**
 * Send json data to server
 * @param {object} findCity 
 */
function postData(findCity) {
    fetch(
        './script/scrape.php', {
            method: 'POST',
            body: JSON.stringify(findCity)
        }).then(
        response => response.json()
    ).then(
        data => {
            responseArea.innerHTML = '';
            responseArea.appendChild(formatResponse(data));
            responseArea.appendChild(sevenDaysForecast(data));
        }
    );
}

/**
 * User input cleanup and format
 * @param {string} input 
 */
function cleanInput(input) {
    return input
        .trim()
        .replace(/(<([^>]+)>)/gi, "")
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Current weather display
 * @param obj = server response object
 */
function formatResponse(obj) {
    const cityName = city.value;
    const {
        current: {
            temp: tempC,
            pressure: currentPressure,
            weather: [{
                main: currentWeather,
                description: currentWeatherDescription,
                icon: currentIcon
            }]
        },
        daily: [{
            temp: {
                min: tempMin,
                max: tempMax
            }
        }]
    } = obj;

    const currentTemp = roundTemp(tempC);
    const currentTempMin = roundTemp(tempMin);
    const currentTempMax = roundTemp(tempMax);

    let layout = document.createElement("div");
    layout.textContent = ' ';
    layout.classList.add('flex-row');
    let layoutText = document.createElement("p");
    layoutText.innerHTML = `<span class="city">${cityName}</span><br>
    <span class="temp">${currentTemp}°C</span><br>
    <span class="pressure">${currentPressure}hPa</span><br>
    <span class="weather">${currentWeatherDescription}</span><br><br>
    Forecast:<br>
    ${currentWeather} ${currentTempMin} - ${currentTempMax}°C`;
    layout.appendChild(layoutText);
    let layoutImage = document.createElement("div");
    layoutImage.classList.add('align-center');
    layoutImage.innerHTML = `<img src="http://openweathermap.org/img/wn/${currentIcon}@2x.png">`;
    layout.appendChild(layoutImage);
    return layout;
}

/**
 * Seven days forecast bar format
 * @param obj = server response object
 */
function sevenDaysForecast(obj) {
    const { daily: [, ...forecast] } = obj;

    let sevenDayForecast = document.createElement("div");
    sevenDayForecast.textContent = ' ';
    let forecastBar = document.createElement("div");
    forecastBar.textContent = ' ';
    forecastBar.classList.add('flex-row');
    const forecastTitle = document.createElement("p");
    forecastTitle.classList.add('forecast-title');
    forecastTitle.textContent = '7 day forecast:';
    sevenDayForecast.appendChild(forecastTitle);

    forecast.forEach(day => {
        const {
            temp: {
                min: tMin,
                max: tMax
            },
            weather: [{
                description: weather,
                icon: icon
            }]
        } = day;
        let barItem = document.createElement("div");
        barItem.classList.add('flex-col', 'bar-item');
        barItem.innerHTML = `<div><img src="http://openweathermap.org/img/wn/${icon}@2x.png"></div>
        <p>${weather}</p>
        <p>${roundTemp(tMin)} - ${roundTemp(tMax)}°C</p>`;
        forecastBar.appendChild(barItem);
    });

    sevenDayForecast.appendChild(forecastBar);
    return sevenDayForecast;
}

/**
 * Round temperature to whole number
 */
function roundTemp(temp) {
    return Math.round(temp);
}