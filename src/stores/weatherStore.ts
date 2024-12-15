import { defineStore } from 'pinia';
import { fetchWeatherByLatLong, fetchForecastByLatLong, fetchWeatherDataByCityName } from '@/services/weatherService';
import type { Location } from '@/types/location'
import type { WeatherData, WeatherState } from '@/types/types';

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    currentLocation: {
      latitude: null,
      longitude: null,
      weather: null,
    } as Location,
    selectedLocation: null as Location | null,
    savedLocations: [] as Array<Location>,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchCurrentLocationWeather() {
      if (!navigator.geolocation) {
        this.error = 'Geolocation is not supported by your browser.';
        return;
      }

      this.loading = true;
      this.error = null;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          this.currentLocation.latitude = latitude;
          this.currentLocation.longitude = longitude;

          try {
            const response = await fetchWeatherByLatLong(latitude.toString(), longitude.toString());
            this.currentLocation.weather = response.data;
            
          } catch (err) {
            this.error = 'Failed to fetch current location weather.';
            console.error(err);
          } finally {
            this.loading = false;
          }
        },
        (error) => {
          this.error = 'Unable to retrieve your location.';
          console.error(error);
          this.loading = false;
        }
      );
    },

    async fetchWeatherByCityName(cityName: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetchWeatherDataByCityName(cityName);
        const { coord, ...weatherData } = response.data;

        this.savedLocations.push({
          name: cityName,
          latitude: coord.lat,
          longitude: coord.lon,
          weather: weatherData,
        });
      } catch (err) {
        this.error = `Failed to fetch weather for city: ${cityName}`;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async fetchWeatherForSelectedLocations() {
      this.loading = true;
      this.error = null;

      try {
        const requests = this.savedLocations.map((location) => {
          if (location.latitude && location.longitude) {
            return fetchWeatherByLatLong(location.latitude.toString(), location.longitude.toString());
          }
        });

        const responses = await Promise.all(requests);
        responses.forEach((response, index) => {
          if (response) {
            this.savedLocations[index].weather = response.data;
          }
        });
      } catch (err) {
        this.error = 'Failed to fetch weather for selected locations.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    addLocation(name: string, lat: number, lon: number) {
      if (!this.savedLocations.some((loc) => loc.name === name)) {
        this.savedLocations.push({
          name,
          latitude: lat,
          longitude: lon,
          weather: null,
        });
      }
    },

    removeLocation(name: string) {
      this.savedLocations = this.savedLocations.filter((loc) => loc.name !== name);
    },

    setSelectedLocation(city: Location) {
      this.selectedLocation = city;
    },

    clearSelectedLocation() {
      this.selectedLocation = null;
    },

    async fetchWeather() {
      // Check if selectedLocation is available in the store
      const { latitude, longitude } = this.selectedLocation || {};
    
      // If no selected location exists, exit the function
      if (!latitude || !longitude) {
        this.error = 'Selected location is not available.';
        return;
      }
    
      this.loading = true;
      this.error = null;
    
      try {
        const response = await fetchWeatherByLatLong(latitude.toString(), longitude.toString());
    
        if (this.selectedLocation) {
          this.selectedLocation.weather = response.data;
        }
        
      } catch (err) {
        this.error = 'Failed to fetch current location weather.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async fetchForecast() {
      // Check if selectedLocation is available in the store
      const { latitude, longitude } = this.selectedLocation || {};
    
      // If no selected location exists, exit the function
      if (!latitude || !longitude) {
        this.error = 'Selected location is not available.';
        return;
      }
    
      this.loading = true;
      this.error = null;
    
      try {
        const forecastResponse = await fetchForecastByLatLong(latitude.toString(), longitude.toString());
    
        if (this.selectedLocation) {
          this.selectedLocation.forecast = forecastResponse.data;
        }
        
      } catch (err) {
        this.error = 'Failed to fetch weather forecast.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  },
});
