<template>
    <div class="weather-dashboard">
        <header class="weather-dashboard-header">
            <h1>Időjárás Panel</h1>
            <div class="search-container">
                <button class="search-containerbtn1">
                    <i class="fas fa-location-arrow" aria-hidden="true"></i>
                </button>
                <input v-model="city" @keyup.enter="fetchWeatherData" placeholder="Search City..." />
                <button @click="fetchWeatherData" class="search-containerbtn2"><i class="fas fa-search"></i></button>
            </div>
        </header>
        <div class="cont-container-main">
            <div class="current-weather-layer-cont">
                <main v-if="weatherData">
                    <section class="current-weather">
                        <div class="current-weather-div">
                            <h2>Előrejelzés <strong>{{ city }}</strong> területén</h2>
                            <p>{{ formattedDate }}</p>
                        </div>
                        <div class="weather-container">
                            <div class="weather-summary asda">
                                <div class="row weather-row">
                                    <p class="temp"> {{ weatherData.current.temp }}°C</p>
                                    <div class="column">
                                        <p class="weather-highlow"><span class="weather-highlow-span">Max:</span> 14°C
                                        </p>
                                        <p class="weather-highlow"><span class="weather-highlow-span">Min:</span> 5°C
                                        </p>
                                    </div>
                                </div>
                                <br><br><br>
                                <div class="row">
                                    <div class="column text-left width-70">
                                        <p class="description">{{
                                            weatherData.current.weather[0].description }}</p>
                                        <p class="extra-info"> Hőérzet {{
                                            weatherData.current.feels_like }}°C</p>

                                    </div>
                                    <div class="card-svg-item">
                                        <img :src="`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
                                            alt="Weather Icon">
                                    </div>
                                </div>
                            </div>
                            <div class="weather-metrics asda">
                                <p><b>Páratartalom</b> <span class="weather-metrics-span"> {{ weatherData.current.humidity
                                        }}%
                                        <i class="fas fa-eye-slash"></i></span></p>
                                <p><b>Szélsebesség</b> <span class="weather-metrics-span">{{
                                        weatherData.current.wind_speed }}
                                        m/s <i class="fas fa-wind"></i></span></p>
                                <p><b>Légnyomás</b> <span class="weather-metrics-span">{{ weatherData.current.pressure }}
                                        hPa
                                        <i class="fas fa-tachometer-alt"></i></span></p>
                                <p><b>Felhőzet</b> <span class="weather-metrics-span">{{ weatherData.current.clouds }}
                                        %
                                        <i class="fas fa-tachometer-alt"></i></span></p>
                                <p><b>Láthatóság</b> <span class="weather-metrics-span">{{
                                    weatherData.current.visibility /
                                        1000 }} km <i class="fas fa-eye-slash"></i></span></p>
                            </div>
                            <div class="sun-info">
                                <i class="fas fa-sun"></i> Napkelte  <br> {{ formatTime(weatherData.current.sunrise) }}
                                <i class="fas fa-moon"></i> Napnyugta <br> {{ formatTime(weatherData.current.sunset) }}
                            </div>
                            <div class="sun-info-overlay"></div>
                        </div>

                    </section>
                    <section class="forecast">
                        <div class="forecast-container">
                            <div v-for="(day, index) in forecastData.slice(0, 7)" :key="index" class="forecast-item">
                                <p class="forecast-date">{{ new Date(day.dt * 1000).toLocaleDateString('hu-HU', {
                                    weekday:
                                        'short'
                                }) }}</p>
                                <img :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
                                    alt="Időjárás ikon">
                                <p class="forecast-temp">{{ day.temp.day }}°C</p>
                                <p class="forecast-desc">Felhő: {{ day.clouds }}%</p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <div class="forecast_other_cities">
                <h2>Időjárás más városokban</h2>
                <div v-for="(city, index) in otherCitiesForecast" :key="index" class="city-data-fcs">
                    <div>
                        <strong>{{ city.city }}</strong>
                        <br>
                        <span class="country-code">{{ city.country }}</span>
                    </div>
                    <div class="forecast-icon">
                        <img :src="`https://openweathermap.org/img/wn/${city.icon}@2x.png`" alt="Weather Icon">
                    </div>
                    <div class="forecast-data">
                        <p class="forecast-temp">{{ Math.round(city.temp) }}°C</p>
                        <p class="forecast-desc">{{ city.weather }}</p>
                    </div>
                </div>
            </div>
        </div>
       
    </div>
</template>


<script>
import axios from 'axios';

export default {
    data() {
        return {
            city: 'Halmajugra',
            weatherData: null,
            forecastData: null,
            lat: null,
            lon: null,
            otherCities: ["Bükkábrány", "Budapest", "Eger", "Szolnok", "Nyíregyháza"],
            otherCitiesForecast: [],
            apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY,
        mapX: 4, // OpenWeather Tile X koordináta
        mapY: 2, // OpenWeather Tile Y koordináta
        };
    },
    computed: {
        formattedDate() {
            return new Date().toLocaleString();
        }
    },
    methods: {
        getTileCoords(lat, lon, zoom) {
        const tileSize = 256; // Tile méret pixelben
        const earthCircumference = 40075017; // Föld kerülete méterben
        const initialResolution = earthCircumference / tileSize;
        const originShift = earthCircumference / 2.0;

        // Pixel koordináták
        let mx = lon * originShift / 180.0;
        let my = Math.log(Math.tan((90 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0);
        my = my * originShift / 180.0;

        let res = initialResolution / (1 << zoom);
        let px = (mx + originShift) / res;
        let py = (originShift - my) / res;

        // Tile koordináták
        let xTile = Math.floor(px / tileSize);
        let yTile = Math.floor(py / tileSize);

        return { x: xTile, y: yTile };
    },

    updateMapCoords() {
        const zoom = 5; // Állítható zoom szint
        const coords = this.getTileCoords(47.0, 19.0, zoom); // Magyarország középpontja

        this.mapX = coords.x;
        this.mapY = coords.y;
    },
        async fetchWeatherData() {
            try {
                const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
                const locationResponse = await axios.get(
                    `https://api.openweathermap.org/geo/1.0/direct?q=${this.city}&limit=1&appid=${apiKey}`
                );
                if (locationResponse.data.length === 0) throw new Error('Location not found');
                this.lat = locationResponse.data[0].lat;
                this.lon = locationResponse.data[0].lon;

                const weatherResponse = await axios.get(
                    `https://api.openweathermap.org/data/3.0/onecall?lat=${this.lat}&lon=${this.lon}&exclude=minutely,hourly&units=metric&appid=${apiKey}`
                );
                this.weatherData = weatherResponse.data;
                this.forecastData = weatherResponse.data.daily.slice(1, 8);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        },
        async fetchOtherCitiesWeather() {
            try {
                const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
                const cityRequests = this.otherCities.map(async (city) => {
                    const locationResponse = await axios.get(
                        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
                    );
                    if (locationResponse.data.length === 0) throw new Error(`Location not found: ${city}`);
                    const lat = locationResponse.data[0].lat;
                    const lon = locationResponse.data[0].lon;

                    const weatherResponse = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
                    );

                    return {
                        city: city,
                        country: locationResponse.data[0].country,
                        temp: weatherResponse.data.main.temp,
                        weather: weatherResponse.data.weather[0].description,
                        icon: weatherResponse.data.weather[0].icon
                    };
                });

                this.otherCitiesForecast = await Promise.all(cityRequests);
            } catch (error) {
                console.error("Error fetching other cities weather:", error);
            }
        },
        formatDate(timestamp) {
            return new Date(timestamp * 1000).toLocaleDateString();
        },
        formatTime(timestamp) {
            return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        }
    },
    mounted() {
        this.updateMapCoords();

        this.fetchWeatherData();
        this.fetchOtherCitiesWeather();
    }

};
</script>

<style scoped>
body, html{
    height: 100%;
    margin: 0;
    overflow: hidden; /* Az alapértelmezett görgetést tiltjuk */
}
.weather-dashboard {
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    padding: 1em;
    background: #1e1e2e;
    color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    font-family: 'DM Sans', sans-serif;
}

.weather-dashboard-header {
    display: flex;
    gap: 1em;
    justify-content: space-between;
}

.weather-row {
    justify-content: space-between;
}

.cont-container-main {
    display: grid;
    grid-template-columns: 1.5fr .5fr;
    gap: 1em;
}

.current-weather-layer-cont {
    background: #2E3540;
    border-radius: 10px;
    padding: 1em;
}

.city-data-fcs {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 1em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.city-data-fcs:last-child {
    border-bottom: none;
}


.forecast-icon img {
    height: 100%;
    margin-left: auto;

}

.forecast-temp {
    font-weight: bold;
    font-size: 1.2em;
    color: #ffcc00;
}

.forecast-desc {
    text-transform: capitalize;
}

.weather-highlow-span {
    font-size: .7em;
}

.weather-metrics-span i {
    font-size: smaller;
}

.search-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.description {
    text-transform: capitalize;
}

.search-container input {
    padding: 12px;
    border: none;
    width: 320px;
    background: #1e293b;
    color: white;
}

.search-container button {
    background: #007bff;
    color: white;
    padding: 12px;
    border: none;
    cursor: pointer;
}

.search-containerbtn1 {
    border-radius: 10px 0 0 10px;
}

.search-containerbtn2 {
    border-radius: 0 10px 10px 0;
}


.weather-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 1em 0;
    border-radius: 10px;
    position: relative;
}

.weather-summary {
    background: #242230;
    border-radius: 10px;
    padding: 1.5em;
}

.weather-metrics {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 1.5em;
}

.weather-metrics p {
    padding: .5em 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid white;
}

.temp {
    font-weight: 800;
    font-size: 1.5em;
}

.sun-info {
    position: relative;
    display: flex;
    width: 25%;
    flex-direction: column;
    justify-content: center;
    background-position: center;
    background-size: cover;
    border-radius: 10px;
    gap: 1em;
    z-index: 1;
}


.sun-icon {
    width: 50px;
    height: 50px;
}

.sun-info-overlay {
    position: absolute;
    right: 0;
    top: 0;
    width: 25%;
    border-radius: 10px;
    height: 91%;
    margin-top: 1em;
    background: url(../assets/night-landscape.png);
    background-size: cover;
    filter: brightness(60%);
}

.forecast_other_cities {
    background: #2E3540;
    padding: 1em;
    border-radius: 10px;
}

.forecast-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 1em;
}

.forecast-item {
    background: #334155;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    width: 13%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.forecast-date {
    font-weight: bold;
    color: #f8f8f8;
}

.forecast-temp {
    font-size: 1.3em;
    color: #ffcc00;
}

.forecast-desc {
    font-size: 1em;
}



.current-weather-div {
    text-align: left;
    padding: 1em 0;
}

.row {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.column {
    display: flex;
    flex-direction: column;
}

.asda {
    display: block;
    width: 33%;
}

.text-left {
    text-align: left;
}

.width-70 {
    width: 60%;
}

.card-svg-item {
    width: 40%;
    text-align: end;
}

.card-svg-item img {
    width: 80%;
}
</style>