import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/main.scss'
import * as helpers from '@/helpers/utils';

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties._gFunc = helpers;

app.mount('#app')
