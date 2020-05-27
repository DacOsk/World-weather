const form = document.querySelector('#form');
const city = document.querySelector('#city');
const submit = document.querySelector('#submit');
const responseArea = document.querySelector('.response');
const list = document.querySelector('#cities');
const cityId = document.querySelector('#city-code');

form.addEventListener('submit', e => {
    e.preventDefault();
});

city.addEventListener('keyup', () => {
    let numChar = city.value.length;
    if (numChar >= 3) {
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

city.addEventListener('input', () => {
    let options = list.childNodes;
    options.forEach(option => {
        if (option.value === city.value) {
            cityId.textContent = option.getAttribute('data-value');
        }
    });
});

submit.addEventListener('click', () => {
    let cityName = cleanInput(city.value);
    if (cityName != "" && cityId.textContent === '') {
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

function postData(findCity) {
    const sendData = fetch(
        './script/scrape.php', {
            method: 'POST',
            body: JSON.stringify(findCity)
        }).then(
        response => response.json()
    ).then(
        data => {
            //console.log(data);
            responseArea.appendChild(formatResponse(data));
        }
    );
}

function cleanInput(input) {
    return input
        .trim()
        .replace(/(<([^>]+)>)/gi, "")
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
}

function formatResponse(obj) {
    //console.log(obj);
    const cityName = city.value;
    const currentTemp = obj.current.temp;
    const currentWeatherDescription = obj.current.weather[0].description;
    const currentTempMin = Math.floor(obj.daily[0].temp.min);
    const currentTempMax = Math.floor(obj.daily[0].temp.max);
    const currentWeather = obj.daily[0].weather[0].main;
    const currentPressure = obj.daily[0].pressure;
    const currentIcon = obj.current.weather[0].icon;

    let layout = document.createElement("div");
    layout.textContent = ' ';
    layout.classList.add('flex-row');
    layoutText = document.createElement("p");
    layoutText.innerHTML = `<strong>${cityName}</strong><br>
    Current temperature: ${currentTemp}°C<br>
    Current weather: ${currentWeatherDescription}<br>
    Forecast:<br>
    Temperature: ${currentTempMin} - ${currentTempMax}°C<br>
    Weather: ${currentWeather}, Air pressure: ${currentPressure} hPa`;
    layout.appendChild(layoutText);
    layoutImage = document.createElement("div");
    layoutImage.classList.add('align-center');
    layoutImage.innerHTML = `<img src="http://openweathermap.org/img/w/${currentIcon}.png">`;
    layout.appendChild(layoutImage);
    return layout;
}