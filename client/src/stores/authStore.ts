import { create } from 'zustand';
import api from '../services/api';

function tokenExpiresWithin24h(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresAt = payload.exp * 1000;
    return expiresAt - Date.now() < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
  safetyProfile?: {
    id: string;
    isLGBTQ: boolean;
    isSoloFemale: boolean;
    hasAccessibilityNeeds: boolean;
    religiousMinority: boolean;
    dietaryRestrictions: string[];
    languageBarriers: string[];
    preferredBudgetLevel?: string;
    travelStyle?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  initialize: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token, isAuthenticated: true });
      // Silently refresh if token is within 24h of expiry
      if (tokenExpiresWithin24h(token)) {
        try {
          const response = await api.refreshToken();
          const newToken = response.data.token;
          localStorage.setItem('token', newToken);
          set({ token: newToken });
        } catch {
          // Refresh failed — token is still valid for now, continue
        }
      }
      get().fetchCurrentUser();
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.login(email, password);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.register(data);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchCurrentUser: async () => {
    try {
      const response = await api.getCurrentUser();
      set({ user: response.data.user });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));
