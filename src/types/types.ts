export interface WeatherCondition {
    main: string;
  }
  
export interface SysData {
    sunrise: number;
    sunset: number;
}
  
export interface WeatherData {
    weather: WeatherCondition[];
    sys: SysData;
    dt: number;
}

export interface WeatherState {
    selectedLocation: Location | null;
}
