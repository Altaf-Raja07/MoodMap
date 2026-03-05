// ============================================
// FAVORITES SERVICE - Favorites API calls
// ============================================
import { api } from '../lib/api';

export interface Favorite {
  placeId: string;
  placeName: string;
  savedAt: string;
}

class FavoritesService {
  async getFavorites(): Promise<Favorite[]> {
    const response = await api.get('/favorites');
    return response.data.data;
  }

  async addFavorite(placeData: {
    placeId: string;
    placeName: string;
    address?: string;
    rating?: number;
    priceLevel?: number;
  }): Promise<Favorite> {
    const response = await api.post('/favorites', placeData);
    return response.data.data;
  }

  async removeFavorite(placeId: string) {
    const response = await api.delete(`/favorites/${placeId}`);
    return response.data;
  }

  async isFavorite(placeId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some(fav => fav.placeId === placeId);
  }
}

export default new FavoritesService();
