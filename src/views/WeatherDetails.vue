<template>
    <div>
        <div class="location-details">
            <div class="container pt-5 pb-4" v-if="weather">
                
                <div class="d-flex justify-content-between align-items-center text-white">
                    <router-link to="/" class="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 320 512"><path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256L246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
                    </router-link>
    
                    <p class="mb-0">{{ weather.name }}</p>

                    <div class="dropdown">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="16" data-bs-toggle="dropdown" aria-expanded="false" viewBox="0 0 128 512"><path fill="currentColor" d="M64 360a56 56 0 1 0 0 112a56 56 0 1 0 0-112m0-160a56 56 0 1 0 0 112a56 56 0 1 0 0-112m56-104A56 56 0 1 0 8 96a56 56 0 1 0 112 0"/></svg>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Add</a></li>
                            <li><a class="dropdown-item" href="#">Delete</a></li>
                        </ul>
                    </div>
                </div>

                <div class="text-white text-center pt-4">
                    <p>{{ _gFunc.convertToDate(weather.dt, weather.timezone) }}</p>
                    <img v-if="weather?.weather?.[0]?.icon" :src="`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`">
                    <h5 v-if="weather?.main?.temp">{{ _gFunc.kelvinToCelsius(weather?.main.temp) }} &deg;</h5>
                    <h5 v-if="weather?.weather?.[0]?.description" class="fw-semibold text-capitalize">{{ weather.weather[0].description }}</h5>
                    <p>Last Updated {{  _gFunc.convertToTime(weather.dt, weather.timezone) }}</p>
                </div>
            </div>
        </div>
        
        <div class="container py-4">
            <h5>Hourly Forecast</h5>
            <div class="d-flex align-items-center" style="overflow-y: scroll;">
                <div v-for="(hour, index) in hourlyForecast" :key="index"
                    class="card border-0 mx-2 p-2 text-center" style="background: #F5F5F5; min-width: 6rem;">
                    <img :src="`http://openweathermap.org/img/wn/${hour.icon}@2x.png`" style="filter: brightness(1.3);">
                    <p class="fw-semibold mb-1">{{ hour.temp }} &deg;</p>
                    {{ hour.time }}
                </div>
            </div>

            <h5 class="pt-4">Weekly Forecast</h5>

            <div v-for="(day, index) in weeklyForecast" :key="index"
                class="card border-0 rounded p-3 mb-2" style="background: #D2DFFF;">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <img :src="`http://openweathermap.org/img/wn/${day.hours[0].icon}@2x.png`" 
                            class="rounded-circle p-1"
                            style="height: 50px; width: 50px; background-color: #9AB6FF;">
                        <div class="ms-3">
                            <p class="fw-semibold mb-1">{{ day.day }}</p>
                            <p class="mb-0 text-muted">{{ day.hours[0].main }}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="fw-semibold me-3">{{ day.hours[0].temp }} &deg;C</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 512"><path fill="currentColor" d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9S63.9 115 63.9 128v256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useWeatherStore } from '@/stores/weatherStore';
  
  const route = useRoute();
  const router = useRouter();
  const weatherStore = useWeatherStore();
  const hourlyForecast = ref<any[]>([]);
  const weeklyForecast = ref<any[]>([]);
  
  onMounted(async () => {
    await weatherStore.fetchWeather();
    await weatherStore.fetchForecast();
    processForecasts();
  })

  const selectedLocation = computed(() => weatherStore.selectedLocation);
  const weather = computed(() => weatherStore.selectedLocation?.weather);
  const forecast = computed(() => weatherStore.selectedLocation?.forecast);

  watch(selectedLocation, (newValue) => {
  if (newValue === null) {
    router.push('/');
  }
}, { immediate: true });

const processForecasts = () => {
  const forecastData = forecast.value?.list || [];
  const timezoneOffset = weather.value?.timezone || 0; // Time zone offset in seconds from API

  // Calculate the current day based on location's time zone
  const nowUTC = new Date();
  const localNow = new Date(nowUTC.getTime() + timezoneOffset * 1000);
  const currentDay = localNow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  hourlyForecast.value = forecastData
    .filter((item: any) => {
      const itemDate = new Date((item.dt + timezoneOffset) * 1000);
      return itemDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }) === currentDay;
    })
    .map((item: any) => ({
      time: new Date((item.dt + timezoneOffset) * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      icon: item.weather[0].icon,
      temp: Math.round(item.main.temp - 273.15),
      description: item.weather[0]?.description || '',
      windSpeed: item.wind?.speed || 0,
    }));
    
  const groupedForecast = forecastData.reduce((acc: any, item: any) => {
    const itemDate = new Date((item.dt + timezoneOffset) * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
    //   month: 'long',
    //   day: 'numeric',
    });

    if (!acc[itemDate]) acc[itemDate] = [];
    acc[itemDate].push({
      time: new Date((item.dt + timezoneOffset) * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      main: item.weather[0].main,
      icon: item.weather[0].icon,
      temp: Math.round(item.main.temp - 273.15),
      description: item.weather[0]?.description || '',
      windSpeed: item.wind?.speed || 0,
    });

    return acc;
  }, {});

  weeklyForecast.value = Object.entries(groupedForecast)
    .map(([day, hours]: any) => ({
      day,
      hours,
    }))
    .slice(0, 5);
    console.log('weeklyForecast', weeklyForecast);
};

  const city = route.params.city as string;

  // Get the weather description of the selected city
  const cityWeather = computed(() => selectedLocation.value?.weather?.description || null);
  </script>
  