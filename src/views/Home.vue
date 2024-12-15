<template>
  <main>
    <div class="container mt-5">
      <div class="row justify-content-between align-items-center">
        <div class="col">
          <h1 class="fw-bold">Weather</h1>
        </div>
        <div class="col-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-dasharray="20"
              stroke-dashoffset="20"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path
                d="M6 19v-1c0 -2.21 1.79 -4 4 -4h4c2.21 0 4 1.79 4 4v1"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.2s"
                  values="20;0"
                />
              </path>
              <path
                d="M12 11c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3Z"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.2s"
                  dur="0.2s"
                  values="20;0"
                />
              </path>
            </g>
          </svg>
        </div>
      </div>

      <div class="dropdown search-dropdown">
        <div class="input-group">
          <span class="input-group-text text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7l126.6 126.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208M208 352a144 144 0 1 0 0-288a144 144 0 1 0 0 288"/></svg>
          </span>
          <input
            type="text"
            class="form-control border-start-0"
            :class="suggestions.length || selectedCity || query ? 'border-end-0 ' : ''"
            v-model="query"
            @input="onSearch"
            placeholder="Search for a city"
            aria-haspopup="true"
            aria-expanded="false"
          />
          <span class="input-group-text text-muted border-start-0" v-if="suggestions.length || selectedCity || query" @click="clearQuery">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512"><path fill="currentColor" d="M256 48a208 208 0 1 1 0 416a208 208 0 1 1 0-416m0 464a256 256 0 1 0 0-512a256 256 0 1 0 0 512m-81-337c-9.4 9.4-9.4 24.6 0 33.9l47 47l-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47l47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47l47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47l-47-47c-9.4-9.4-24.6-9.4-33.9 0"/></svg>
          </span>
        </div>

        <div
          class="dropdown-menu show"
          v-if="suggestions.length && !isLoading"
        >
          <!-- <span v-if="isLoading" class="dropdown-item-text">Loading...</span>
          <span v-if="error" class="dropdown-item-text text-danger">{{ error }}</span> -->

          <button
            v-for="(city, index) in suggestions"
            :key="index"
            class="dropdown-item"
            :class="{'border-bottom': index !== suggestions.length - 1}"
            @click="selectCity(city)"
          >
            {{ city.label }}
          </button>
        </div>
      </div>

      <div class="row" v-if="!query && currentLocation">
        <div class="col-12">
          <div class="weather-container bg-dark text-white mt-4 border-0 position-relative overflow-hidden">
            <BackgroundImg :weather-data="currentLocation" />
            <div class="weather-content p-3">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h4 class="fw-bold">My Location</h4>
                  <h6>{{ currentLocation.name }}</h6>
                </div>
                <div>
                  <h1 class="display-1">{{ _gFunc.kelvinToCelsius(currentLocation.main.temp) }} &deg;</h1>
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-end mt-4">
                <p class="mb-0 text-capitalize">{{ currentLocation.weather[0].description }}</p>
                <div>
                  <span>
                    H:{{ _gFunc.kelvinToCelsius(currentLocation.main.temp_max) }}&deg;
                  </span>
                  <span class="ms-2">
                    L:{{ _gFunc.kelvinToCelsius(currentLocation.main.temp_min) }}&deg;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWeatherStore } from '@/stores/weatherStore';
import { fetchCitySuggestions } from '@/services/locationService';
import { fetchWeatherByLatLong } from '@/services/weatherService';
import type { CitySuggestion, Suggestion } from '@/types/location';
import BackgroundImg from './Components/BackgroundImg.vue';

const weatherStore = useWeatherStore();
const router = useRouter();
const query = ref('');
const suggestions = ref<Suggestion[]>([]);
const selectedCity = ref<string>('');
const isLoading = ref(false);
const error = ref('');

onMounted(() => {
  weatherStore.fetchCurrentLocationWeather();
});

const currentLocation = computed(() => weatherStore.currentLocation.weather);

const onSearch = async () => {
  if (!query.value) {
    suggestions.value = [];
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    const response = await fetchCitySuggestions(query.value);

    suggestions.value = response.map((item) => ({
      label: `${item.address.city || item.address.town || item.address.village || item.display_name || item.name}, ${item.address.country}`,
      data: item,
    }));
  } catch (err) {
    error.value = 'Failed to fetch city suggestions.';
    console.error('Error fetching city suggestions:', err);
  } finally {
    isLoading.value = false;
  }
};

const clearQuery = () => {
  query.value = '';
  selectedCity.value = '';
  suggestions.value = [];
}

const selectCity = async (city: { label: string; data: CitySuggestion }) => {
  selectedCity.value = city.label;
  suggestions.value = [];
  query.value = city.label;

  try {
    isLoading.value = true;
    const weatherData = await fetchWeatherByLatLong(city.data.lat, city.data.lon);

    weatherStore.setSelectedLocation({
      name: city.label,
      latitude: Number(city.data.lat), 
      longitude: Number(city.data.lon),
      weather: weatherData,
    });

    router.push({ name: 'weather-details', params: { city: city.label } });

  } catch (err) {
    console.error('Error fetching weather data:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.dropdown-menu.show {
  display: block;
}
</style>



