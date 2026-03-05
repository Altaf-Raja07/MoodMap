// ============================================
// ANALYTICS SERVICE - Analytics API calls
// ============================================
import { api } from '../lib/api';

export interface UserStats {
  totalSearches: number;
  totalFavorites: number;
  totalReviews: number;
  accountAge: number;
  lastLogin: string;
  isEmailVerified: boolean;
  preferredMoods: { mood: string; count: number }[];
  averageRatingGiven: string;
}

export interface TrendingPlace {
  placeId: string;
  placeName: string;
  reviewCount: number;
  avgRating: string;
}

class AnalyticsService {
  async getMyStats(): Promise<UserStats> {
    const response = await api.get('/analytics/me');
    return response.data.data;
  }

  async getPopularMoods() {
    const response = await api.get('/analytics/popular-moods');
    return response.data.data;
  }

  async getTrendingPlaces(limit = 10): Promise<TrendingPlace[]> {
    const response = await api.get('/analytics/trending', {
      params: { limit },
    });
    return response.data.data;
  }

  async getPlatformStats() {
    const response = await api.get('/analytics/platform');
    return response.data.data;
  }
}

export default new AnalyticsService();
