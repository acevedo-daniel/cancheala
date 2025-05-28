import { User, Location, Banner, Category } from '../types';
import { MOCK_USERS, MOCK_LOCATIONS, MOCK_CATEGORIES, MOCK_BANNERS } from '../mocks/data';

class ApiService {
  private async request<T>(endpoint: string): Promise<T> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock de respuestas
    switch (endpoint) {
      case '/auth/login':
        return MOCK_USERS[0] as T;
      case '/locations':
        return MOCK_LOCATIONS as T;
      case '/categories':
        return MOCK_CATEGORIES as T;
      case '/banners':
        return MOCK_BANNERS as T;
      default:
        if (endpoint.startsWith('/locations/')) {
          const id = endpoint.split('/').pop();
          return MOCK_LOCATIONS.find(loc => loc.id === id) as T;
        }
        throw new Error(`Endpoint no mockeado: ${endpoint}`);
    }
  }

  // Auth
  async login(email: string, password: string): Promise<User> {
    return this.request<User>('/auth/login');
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout');
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    return this.request<Location[]>('/locations');
  }

  async getLocationById(id: string): Promise<Location> {
    return this.request<Location>(`/locations/${id}`);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  // Banners
  async getBanners(): Promise<Banner[]> {
    return this.request<Banner[]>('/banners');
  }
}

export const api = new ApiService(); 