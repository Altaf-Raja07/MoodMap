// ============================================
// PLACES SERVICE - Places API calls
// ============================================
import { api } from '../lib/api';

export interface Place {
  placeId: string;
  name: string;
  address: string;
  rating: number;
  priceLevel: number;
  photos: string[];
  types: string[];
  openingHours?: {
    openNow: boolean;
    weekdayText: string[];
  };
  location: {
    lat: number;
    lng: number;
  };
}

class PlacesService {
  async searchByMood(mood: string, location?: string, radius = 5000): Promise<Place[]> {
    const params: any = { mood, radius };
    if (location) {
      const coords = location.split(',').map(c => parseFloat(c.trim()));
      if (coords.length === 2) {
        params.lat = coords[0];
        params.lng = coords[1];
      }
    }
    const response = await api.get('/places/mood', { params });
    return response.data.data;
  }

  async getNearbyPlaces(location: string | { lat: number; lng: number }, radius = 5000, type = 'restaurant'): Promise<Place[]> {
    let lat, lng;
    if (typeof location === 'string') {
      const coords = location.split(',').map(c => parseFloat(c.trim()));
      lat = coords[0];
      lng = coords[1];
    } else {
      lat = location.lat;
      lng = location.lng;
    }
    const response = await api.get('/places/nearby', {
      params: { lat, lng, radius, type },
    });
    return response.data.data;
  }

  async getPlaceDetails(placeId: string): Promise<Place> {
    const response = await api.get(`/places/${placeId}`);
    return response.data.data;
  }

  async searchPlaces(query: string, location?: string, radius = 5000): Promise<Place[]> {
    const params: any = { query, radius };
    if (location) {
      const coords = location.split(',').map(c => parseFloat(c.trim()));
      if (coords.length === 2) {
        params.lat = coords[0];
        params.lng = coords[1];
      }
    }
    const response = await api.get('/places/search', { params });
    return response.data.data;
  }

  async getStreetFood(lat: number, lng: number, radius = 5000): Promise<Place[]> {
    const response = await api.get('/places/street-food', {
      params: { lat, lng, radius },
    });
    return response.data.data;
  }
}

export default new PlacesService();
