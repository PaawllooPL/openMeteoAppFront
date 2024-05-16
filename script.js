const text = document.getElementById("message-text");
const box = document.getElementById("message-box");

window.onload = () => {
    //asking user for location
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        //if user share location then button is active
        document.getElementById("check-weather-button").style.display="block";
        document.getElementById("check-weather-button")
            .addEventListener('click', async () => {                
                text.innerText = "Loading weather data...";
                box.style.display = "flex";
                const weatherData = await LoadWeekWeatherData(50, 20);
                const tableHead = document.getElementById("weather-table-head");
                const tableBody = document.getElementById("weather-table-body");
                tableHead.innerHTML = "";
                tableBody.innerHTML = "";
                PopulateTable(tableHead, tableBody, weatherData);
                text.innerText = "";
                box.style.display = "none";
            });
    }, () => {
        text.innerText = "Declined location service. Allow or refresh.";
        box.style.display = "flex";
    });
}

//dark mode
document.getElementById("dark-mode-button")
    .addEventListener('click', function () {
        //top page
        document.getElementById("top-bar").classList.toggle("background-dark-gray");
        document.getElementById("top-bar").classList.toggle("bg-light");
        document.getElementById("top-bar-header").classList.toggle("text-light");
        //button
        this.classList.toggle("btn-secondary");
        this.classList.toggle("btn-dark");
        //document body
        document.body.classList.toggle("bg-dark");
        //table
        document.getElementById("weather-table").classList.toggle("table-dark");
        //check weather field
        document.getElementById("check-weather-header").classList.toggle("text-light");


    });



async function LoadWeekWeatherData(latitude, longitude) {
    const baseApiUrl = "https://openmeteoapp.onrender.com/api/v1/weather/7days?";
    const weatherData = await fetch(baseApiUrl + `latitude=${latitude}&longitude=${longitude}`).then(res => res.json());
    return weatherData;
}

function PopulateTable(tableHead, tableBody, weatherData) {
    //date
    let tr_date = document.createElement("tr");
    let td_date_header = document.createElement("td");
    td_date_header.innerText = "Date";
    tr_date.appendChild(td_date_header);

    for (let date of weatherData.date) {
        let td_date = document.createElement("td");
        td_date.innerText = date.replaceAll("-", "/");
        tr_date.appendChild(td_date);
    }
    tableHead.appendChild(tr_date);

    //max temp
    let tr_maxTemp = document.createElement("tr");
    let td_maxTemp_header = document.createElement("td");
    td_maxTemp_header.innerText = "Max temperature (C)";
    tr_maxTemp.appendChild(td_maxTemp_header);

    for (let maxTemp of weatherData.max_temp) {
        let td_maxTemp = document.createElement("td");
        td_maxTemp.innerText = maxTemp;
        tr_maxTemp.appendChild(td_maxTemp);
    }
    tableBody.appendChild(tr_maxTemp);

    //min temp
    let tr_minTemp = document.createElement("tr");
    let td_minTemp_header = document.createElement("td");
    td_minTemp_header.innerText = "Min temperature (C)";
    tr_minTemp.appendChild(td_minTemp_header);

    for (let minTemp of weatherData.min_temp) {
        let td_minTemp = document.createElement("td");
        td_minTemp.innerText = minTemp;
        tr_minTemp.appendChild(td_minTemp);
    }
    tableBody.appendChild(tr_minTemp);

    //generated energy
    let tr_generatedEnergy = document.createElement("tr");
    let td_generatedEnergy_header = document.createElement("td");
    td_generatedEnergy_header.innerText = "Generated Energy (Kwh)";
    tr_generatedEnergy.appendChild(td_generatedEnergy_header);

    for (let generatedEnergy of weatherData.generated_energy) {
        let td_generatedEnergy = document.createElement("td");
        td_generatedEnergy.innerText = generatedEnergy;
        tr_generatedEnergy.appendChild(td_generatedEnergy);
    }
    tableBody.appendChild(tr_generatedEnergy);

    //weather
    let tr_weather = document.createElement("tr");
    let td_weather_header = document.createElement("td");
    td_weather_header.innerText = "Weather";
    tr_weather.appendChild(td_weather_header);

    for (let weatherCode of weatherData.weather_code) {
        let td_weather = document.createElement("td");
        //function to return HTML code with weather icon path
        td_weather.innerHTML = AssignIconInnerHTMLBasedOnWeather(weatherCode);
        tr_weather.appendChild(td_weather);
    }
    tableBody.appendChild(tr_weather);
}

function AssignIconInnerHTMLBasedOnWeather(weatherCode) {
    if (weatherCode == 0)
        return "";
    if (weatherCode < 4)
        return `<img class="icon" src="./photos/cloud-sun-solid.svg"/>`;

    if (weatherCode == 45 || weatherCode == 48)
        return `<img class="icon" src="./photos/smog-solid.svg"/>`;

    if (weatherCode == 51 || weatherCode == 53 || weatherCode == 55)
        return `Drizzle`;

    if (weatherCode == 56 || weatherCode == 57)
        return `Freezing Drizzle`;

    if (weatherCode == 61 || weatherCode == 63 || weatherCode == 65)
        return `<img class="icon" src="./photos/cloud-rain-solid.svg"/>`;

    if (weatherCode == 66 || weatherCode == 67)
        return `Freezing Rain`;

    if (weatherCode == 71 || weatherCode == 73 || weatherCode == 75)
        return `<img class="icon" src="./photos/snowflake-regular.svg"/>`;

    if (weatherCode == 77)
        return `<img class="icon" src="./photos/snowflake-regular.svg"/>`;

    if (weatherCode == 80 || weatherCode == 81 || weatherCode == 82)
        return `<img class="icon" src="./photos/cloud-showers-water-solid.svg"/>`;

    if (weatherCode == 85 || weatherCode == 86)
        return `<img class="icon" src="./photos/snowflake-regular.svg"/>`;

    if (weatherCode == 95)
        return `<img class="icon" src="./photos/cloud-showers-water-solid.svg"/>`;

    if (weatherCode == 96 || weatherCode == 99)
        return `<img class="icon" src="./photos/.svg"/>`;

    return "No data";
}