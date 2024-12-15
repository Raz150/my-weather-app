<template>
    <div>
      <img
        :src="weatherImage"
        :class="weatherClass"
        alt="Weather background"
      />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from "vue";
  import type { WeatherData } from '@/types/types'
  
  export default defineComponent({
    name: "WeatherBackground",
    props: {
      weatherData: {
        type: Object as () => WeatherData,
        required: true
      }
    },
    setup(props) {
      const weatherImages: Record<
        string,
        { day: string; night: string }
      > = {
        clear: {
          day: "/public/images/clear.jpg",
          night: "/public/images/night.jpg"
        },
        clouds: {
          day: "/public/images/cloudy.jpg",
          night: "/public/images/cloudy-night.jpg"
        },
        rain: {
          day: "/public/images/cloudy.jpg",
          night: "/public/images/cloudy-night.jpg"
        },
        drizzle: {
          day: "/public/images/cloudy.jpg",
          night: "/public/images/cloudy-night.jpg"
        },
        thunderstorm: {
          day: "/public/images/thunderstorm.jpg",
          night: "/public/images/thunderstorm.jpg"
        },
        snow: {
          day: "/public/images/snow.jpg",
          night: "/public/images/night.jpg"
        }
      };
  
      const weatherCondition = computed(() =>
        props.weatherData.weather[0]?.main.toLowerCase()
      );
  
      const isDay = computed(() => {
        const { sunrise, sunset } = props.weatherData.sys;
        const currentTime = props.weatherData.dt;
        return currentTime >= sunrise && currentTime <= sunset;
      });
  
      const weatherImage = computed(() => {
        const condition = weatherCondition.value;
        if (!condition) return "/public/images/clear.jpg";
  
        const conditionImages = weatherImages[condition];
        return isDay.value
          ? conditionImages?.day || "/public/images/clear.jpg"
          : conditionImages?.night || "/public/images/night.jpg";
      });
  
      const weatherClass = computed(() => {
        return `weather-background ${weatherCondition.value}`;
      });
  
      return {
        weatherImage,
        weatherClass
      };
    }
  });
  </script>
  