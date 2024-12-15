import axios from 'axios'

const API_KEY = 'e9661bab582324852fc5cce0a1d12fb0'; 
const BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';

export const fetchWeatherData = (cityId: number): Promise<any> => {
	return axios.get(`${BASE_URL}?id=${cityId}&appid=${API_KEY}`);
};

export const fetchWeatherDataByCityName = (cityName: string): Promise<any> => {
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
};

export const fetchWeatherByLatLong = (latitude: string, longitude: string): Promise<any> => {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    
};

export const fetchForecastByLatLong = (latitude: string, longitude: string): Promise<any> => {
    return axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
};