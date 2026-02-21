import axios, { AxiosInstance, AxiosError } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
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

  // Suggestions endpoints
  async generateHotelSuggestions(data: { tripId: string }) {
    const response = await this.client.post('/suggestions/hotels/generate', data);
    return response.data;
  }

  async generateFlightSuggestions(data: { tripId: string }) {
    const response = await this.client.post('/suggestions/flights/generate', data);
    return response.data;
  }

  async getHotelSuggestions(tripId: string) {
    const response = await this.client.get(`/suggestions/hotels/${tripId}`);
    return response.data;
  }

  async getFlightSuggestions(tripId: string) {
    const response = await this.client.get(`/suggestions/flights/${tripId}`);
    return response.data;
  }

  async generateGroundTransportSuggestions(data: { tripId: string }) {
    const response = await this.client.post('/suggestions/transport/generate', data);
    return response.data;
  }

  async getGroundTransportSuggestions(tripId: string) {
    const response = await this.client.get(`/suggestions/transport/${tripId}`);
    return response.data;
  }

  // Weather endpoints
  async getWeather(tripId: string) {
    const response = await this.client.get(`/weather/${tripId}`);
    return response.data;
  }

  // Collaborator endpoints
  async inviteCollaborator(tripId: string, data: { email: string; role: string }) {
    const response = await this.client.post(`/collaborators/${tripId}/invite`, data);
    return response.data;
  }

  async getCollaborators(tripId: string) {
    const response = await this.client.get(`/collaborators/${tripId}`);
    return response.data;
  }

  async removeCollaborator(tripId: string, collaboratorId: string) {
    const response = await this.client.delete(`/collaborators/${tripId}/${collaboratorId}`);
    return response.data;
  }

  async getSharedTrips() {
    const response = await this.client.get('/collaborators/shared');
    return response.data;
  }

  // Template endpoints
  async getTemplates() {
    const response = await this.client.get('/templates');
    return response.data;
  }

  async getTemplate(id: string) {
    const response = await this.client.get(`/templates/${id}`);
    return response.data;
  }

  // Chat endpoints
  async chatWithConcierge(data: { tripId: string; message: string; history: Array<{ role: string; content: string }> }) {
    const response = await this.client.post('/chat', data);
    return response.data;
  }

  // Payment endpoints
  async createCheckout(data: { planType: string; tripId?: string }) {
    const response = await this.client.post('/payments/create-checkout', data);
    return response.data;
  }
}

export default new ApiClient();
