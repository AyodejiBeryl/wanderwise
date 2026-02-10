import axios, { AxiosInstance, AxiosError } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          const url = error.config?.url || '';
          // Don't redirect on auth endpoints — let the form show the error
          if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(data: { email: string; password: string; firstName?: string; lastName?: string }) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async logout() {
    const response = await this.client.post('/auth/logout');
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Trip endpoints
  async getTrips() {
    const response = await this.client.get('/trips');
    return response.data;
  }

  async getTrip(id: string) {
    const response = await this.client.get(`/trips/${id}`);
    return response.data;
  }

  async createTrip(data: any) {
    const response = await this.client.post('/trips', data);
    return response.data;
  }

  async updateTrip(id: string, data: any) {
    const response = await this.client.patch(`/trips/${id}`, data);
    return response.data;
  }

  async deleteTrip(id: string) {
    const response = await this.client.delete(`/trips/${id}`);
    return response.data;
  }

  // Itinerary endpoints
  async generateItinerary(data: { tripId: string; preferences?: any }) {
    const response = await this.client.post('/itineraries/generate', data);
    return response.data;
  }

  async getItinerary(tripId: string) {
    const response = await this.client.get(`/itineraries/${tripId}`);
    return response.data;
  }

  // Safety endpoints
  async generateSafetyReport(data: { tripId: string; safetyProfileId?: string }) {
    const response = await this.client.post('/safety/generate', data);
    return response.data;
  }

  async getSafetyReport(tripId: string) {
    const response = await this.client.get(`/safety/${tripId}`);
    return response.data;
  }

  // User endpoints
  async getUserProfile() {
    const response = await this.client.get('/users/profile');
    return response.data;
  }

  async updateUserProfile(data: any) {
    const response = await this.client.patch('/users/profile', data);
    return response.data;
  }

  async updateSafetyProfile(data: any) {
    const response = await this.client.post('/users/safety-profile', data);
    return response.data;
  }

  // Payment endpoints
  async createCheckout(data: { planType: string; tripId?: string }) {
    const response = await this.client.post('/payments/create-checkout', data);
    return response.data;
  }
}

export default new ApiClient();
