<template>
  <div class="windy-dashboard">
    <div class="weather-card">
      <div class="search-container">
        <input type="text" v-model="city" placeholder="Add meg a település nevét" class="search-input">
        <button @click="fetchWeather" class="search-button"><i class="fas fa-search"></i> Keresés</button>
      </div>
      <div class="card-header">
        <h4><i class="fas fa-map-marker-alt"></i> {{ city }} Időjárás</h4>
        <p class="abcd"><i class="fas fa-calendar-day"></i> {{ new Date().toLocaleDateString() }}</p>
      </div>
      <div v-if="weatherData" >
        <div class="main-info windyweather-grid" >
          <p class="temp"><i class="fas fa-thermometer-half"></i> {{ weatherData.main.temp }} °C</p>
          <p><i class="fas fa-sun"></i> Napkelte: {{ new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString() }}</p>
          <p><i class="fas fa-cloud"></i> Felhőzet: {{ weatherData.clouds.all }}%</p>
          <p><i class="fas fa-moon"></i> Napnyugta: {{ new Date(weatherData.sys.sunset * 1000).toLocaleTimeString() }}</p>
        </div>
        <div class="forecast">
          <h5><i class="fas fa-cloud-sun"></i> Órás Felhőzet Előrejelzés</h5>
          <div class="forecast-grid">
            <div v-for="(hour, index) in cloudForecast" :key="index" class="forecast-item">
              <span class="forecast-time"><i class="fas fa-clock"></i> {{ hour.time }}</span>
              <span class="forecast-clouds"><i class="fas fa-cloud"></i> {{ hour.clouds }}%</span>
            </div>
          </div>
        </div>
      </div>
      <p v-else><i class="fas fa-exclamation-triangle"></i> Nincs elérhető időjárás adat.</p>
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
        cloudForecast: [],
        loading: true
      };
    },
    mounted() {
      this.fetchWeather();
    },
    methods: {
      async fetchWeather() {
        this.loading = true;
        try {
          const [current, forecast] = await Promise.all([
            axios.get('https://api.openweathermap.org/data/2.5/weather', {
              params: {
                q: this.city,
                appid: 'd632949fb0a83b586e4353b3163db0f6',
                units: 'metric'
              }
            }),
            axios.get('https://api.openweathermap.org/data/2.5/forecast', {
              params: {
                q: this.city,
                appid: 'd632949fb0a83b586e4353b3163db0f6',
                units: 'metric'
              }
            })
          ]);
  
          this.weatherData = current.data;
          this.cloudForecast = forecast.data.list.slice(0, 6).map(item => ({
            time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            clouds: item.clouds.all
          }));
        } catch (error) {
          console.error('Hiba az időjárás adatok lekérésekor:', error);
          alert('Nem sikerült lekérni az adatokat. Ellenőrizd az API kulcsot vagy a település nevét!');
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .abcd{
    margin-bottom: .4rem;
  }
  .windyweather-grid{
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 1em 0;
    padding: .5em ;
  }
  .windy-dashboard{
    position: absolute;
    top: 1em;
    left: 1em;
    z-index: 500;
  }

  .search-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  .search-input {
    flex: 1;
    padding: 6px;
    border: 1px solid #bbb;
    border-radius: 8px;
  }
  .search-button {
    padding: 6px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .search-button:hover {
    background-color: #0056b3;
  }
  .weather-card {
    max-width: 650px;
    margin: 25px auto;
    padding: 25px;
    border-radius: 15px;
    background: #ffffff;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    font-family: Arial, sans-serif;
    color: #333;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    gap: 1em;
  }
  .main-info p {
    margin: 8px 0;
  }
  .temp {
    font-weight: bold;
    color: #007bff;
  }
  .forecast h3 {
    margin-top: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 8px;
  }
  .forecast-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-top: 15px;
    padding: .5em;
  }
  .forecast-item {
    display: flex;
    flex-direction: column;
    background: #f0f4f8;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transition: transform 0.2s;
  }
  .forecast-item:hover {
    transform: translateY(-5px);
  }
  .forecast-time {
    font-weight: 500;
  }
  .forecast-clouds {
    color: #555;
    margin-top: 5px;
  }

  </style>