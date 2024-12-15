import axios from 'axios';
import type { CitySuggestion } from '@/types/location';


export const fetchCitySuggestions = async (query: string, limit: number = 5): Promise<CitySuggestion[]> => {
  const BASE_URL = 'https://nominatim.openstreetmap.org/search';
  const params = {
    q: query,
    format: 'json',
    addressdetails: 1,
    limit,
  };

  try {
    const response = await axios.get<CitySuggestion[]>(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    throw error;
  }
};
