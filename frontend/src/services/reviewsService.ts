// ============================================
// REVIEWS SERVICE - Reviews API calls
// ============================================
import { api } from '../lib/api';

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  placeId: string;
  placeName: string;
  rating: number;
  review?: string;
  mood?: string;
  photos?: string[];
  helpful: string[];
  reported: boolean;
  createdAt: string;
  updatedAt: string;
}

class ReviewsService {
  async createReview(data: {
    placeId: string;
    placeName: string;
    rating: number;
    review?: string;
    mood?: string;
    photos?: string[];
  }): Promise<Review> {
    const response = await api.post('/reviews', data);
    return response.data.data;
  }

  async getPlaceReviews(placeId: string, page = 1, limit = 10) {
    const response = await api.get(`/reviews/place/${placeId}`, {
      params: { page, limit },
    });
    return response.data;
  }

  async getMyReviews(): Promise<Review[]> {
    const response = await api.get('/reviews/my-reviews');
    return response.data.data;
  }

  async updateReview(reviewId: string, data: {
    rating?: number;
    review?: string;
    mood?: string;
    photos?: string[];
  }): Promise<Review> {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data.data;
  }

  async deleteReview(reviewId: string) {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }

  async markHelpful(reviewId: string) {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  }

  async reportReview(reviewId: string) {
    const response = await api.post(`/reviews/${reviewId}/report`);
    return response.data;
  }
}

export default new ReviewsService();
