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
    let layout = document.createElement("div");
    layout.textContent = ' ';
    layout.classList.add('flex-row');
    layoutText = document.createElement("p");
    layoutText.innerHTML = `<strong>${city.value}</strong><br>
    Current temperature: ${obj.current.temp}°C<br>
    Current weather: ${obj.current.weather[0].description}<br>
    Forecast:<br>
    Temperature: ${Math.floor(obj.daily[0].temp.min)} - ${Math.floor(obj.daily[0].temp.max)}°C<br>
    Weather: ${obj.daily[0].weather[0].main}, Air pressure: ${obj.daily[0].pressure} hPa`;
    layout.appendChild(layoutText);
    layoutImage = document.createElement("div");
    layoutImage.classList.add('align-center');
    layoutImage.innerHTML = `<img src="http://openweathermap.org/img/w/${obj.current.weather[0].icon}.png">`;
    layout.appendChild(layoutImage);
    return layout;
}