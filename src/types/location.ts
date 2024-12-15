export interface CitySuggestion {
    name?: string;
    display_name?: string;
    lat: string;
    lon: string;
    address: {
      city?: string;
      town?: string;
      village?: string;
      country: string;
      state?: string;
    };
}
  
export interface Suggestion {
    label: string;
    data: CitySuggestion;
}

export interface Location {
  name?: string; // Optional for selected locations
  latitude: number | null;
  longitude: number | null;
  weather: any | null;
  forecast?: any; // Optional for selected location
}
  