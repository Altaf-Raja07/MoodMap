// ============================================
// AUTH SERVICE - Authentication API calls
// ============================================
import { api } from '../lib/api';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  preferences?: {
    favoriteMoods?: string[];
    dietaryRestrictions?: string[];
    budgetRange?: string;
  };
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

class AuthService {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      this.setAuth(response.data.token, response.data.user);
    }
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      this.setAuth(response.data.token, response.data.user);
    }
    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, password: string) {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    if (response.data.token) {
      this.setAuth(response.data.token, response.data.user);
    }
    return response.data;
  }

  async verifyEmail(token: string) {
    const response = await api.post(`/auth/verify-email/${token}`);
    return response.data;
  }

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data.data;
  }

  async updateProfile(data: { name?: string; email?: string }) {
    const response = await api.put('/auth/profile', data);
    const updatedUser = response.data.data;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  async resendVerification() {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  }

  async updatePreferences(preferences: {
    favoriteMoods?: string[];
    dietaryRestrictions?: string[];
    budgetRange?: string;
  }) {
    const response = await api.put('/auth/preferences', preferences);
    return response.data;
  }

  async getSearchHistory() {
    const response = await api.get('/auth/history');
    return response.data.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  setAuth(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.getUser();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
