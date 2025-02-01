<template>
    <div class="weather-dashboard">
        <header class="weather-dashboard-header">
            <h1>Weather Dashboard</h1>
            <div class="search-container">
                <button class="search-containerbtn1">
                    <i class="fas fa-location-arrow" aria-hidden="true"></i>
                </button>
                <input v-model="city" @keyup.enter="fetchWeatherData" placeholder="Search City..." />
                <button @click="fetchWeatherData" class="search-containerbtn2"><i class="fas fa-search"></i></button>
            </div>
        </header>
        <div class="current-weather-layer-cont">
        <main v-if="weatherData">
            <section class="current-weather">
                    <div class="current-weather-div">
                        <h2>Forecast in <strong>{{ city }}</strong></h2>
                        <p>{{ formattedDate }}</p>
                    </div>
                    <div class="weather-container">
                        <div class="weather-summary asda">
                            <div class="row weather-row">
                                <p class="temp"> {{ weatherData.current.temp }}°C</p>
                                <div class="column">
                                    <p class="weather-highlow"><span class="weather-highlow-span">High:</span> 43°C</p>
                                    <p class="weather-highlow"><span class="weather-highlow-span">Low:</span> 15°C</p>
                                </div>
                            </div>
                            <br><br><br>
                            <div class="row">
                                <div class="column text-left width-70">
                                    <p class="description">{{
                                        weatherData.current.weather[0].description }}</p>
                                    <p class="extra-info"> Feels like {{
                                        weatherData.current.feels_like }}°C</p>
                                        
                                </div>
                                <div class="card-svg-item">
                                    <img :src="`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`" alt="Weather Icon">
                                </div>
                            </div>
                        </div>
                        <div class="weather-metrics asda">
                            <p><b>Humidity</b> <span class="weather-metrics-span"> {{ weatherData.current.humidity }}% <i class="fas fa-eye-slash"></i></span></p>
                            <p><b>Wind Speed</b> <span class="weather-metrics-span">{{ weatherData.current.wind_speed }} m/s <i class="fas fa-wind"></i></span></p>
                            <p><b>Pressure</b> <span class="weather-metrics-span">{{ weatherData.current.pressure }} hPa <i class="fas fa-tachometer-alt"></i></span></p>
                            <p><b>Cloudiness</b> <span class="weather-metrics-span">{{ weatherData.current.clouds }} % <i class="fas fa-tachometer-alt"></i></span></p>
                            <p><b>Visibility</b> <span class="weather-metrics-span">{{ weatherData.current.visibility / 1000 }} km <i class="fas fa-eye-slash"></i></span></p>
                        </div>
                        <div class="sun-info">
                            <i class="fas fa-sun"></i> Sunrise <br> {{ formatTime(weatherData.current.sunrise) }}
                            <i class="fas fa-moon"></i> Sunset <br> {{ formatTime(weatherData.current.sunset) }}
                        </div>
                    </div>

                </section>
                <section class="forecast">
                <h3>5-Day Forecast</h3>
                <div class="forecast-container">
                    <div v-for="(day, index) in forecastData" :key="index" class="forecast-item">
                        <p class="forecast-date">{{ new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }) }}</p>
                        <img :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" alt="Forecast Icon">
                        <p class="forecast-temp">{{ day.temp.day }}°C</p>
                        <p class="forecast-desc">Cloud: {{ day.clouds }}%</p>
                    </div>
                </div>
            </section>
            </main>
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
        };
    },
    computed: {
        formattedDate() {
            return new Date().toLocaleString();
        }
    },
    methods: {
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
                this.forecastData = weatherResponse.data.daily.slice(1, 6);
            } catch (error) {
                console.error('Error fetching weather data:', error);
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
        this.fetchWeatherData();
    }
};
</script>

<style scoped>
.weather-dashboard {
    box-sizing: border-box;
    width: auto;
    margin: auto;
    text-align: center;
    padding: 2em;
    background: #1e1e2e;
    color: white;
    border-radius: 10px;
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
.current-weather-layer-cont{
    background: #2E3540;
    border-radius: 10px;
    padding: 1em;
}
.weather-highlow-span {
    font-size: .7em;
}
.weather-metrics-span i{
    font-size: smaller;
}
.search-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}
.description{
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

.search-containerbtn1{
    border-radius: 10px 0 0 10px;
}
.search-containerbtn2{
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
    padding: 1em;
}

.weather-metrics {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: .3em 1em 1em 1em;
}
.weather-metrics p{
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
    background: url(../assets/night-landscape.png);
    border-radius: 10px;
    gap: 1em;
}

.sun-icon {
    width: 40px;
    height: 40px;
}

.forecast-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
}

.forecast-item {
    background: #334155;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    width: 140px;
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

.forecast-icon {
    width: 50px;
    height: 50px;
}

.current-weather-div {
    text-align: left;
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
.text-left{
    text-align: left;
}

.width-70{
    width: 60%;
}
.card-svg-item{
    width: 40%;
    text-align: end;
}
.card-svg-item img{
    width: 80%;
}

</style>