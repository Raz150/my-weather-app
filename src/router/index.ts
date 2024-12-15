import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import WeatherDetails from '../views/WeatherDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/weather/:city',
      name: 'weather-details',
      component: WeatherDetails,
      props: true,
    },
  ]
})

export default router
