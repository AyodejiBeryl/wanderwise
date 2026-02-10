// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafetyProfile {
  id: string;
  userId: string;
  isLGBTQ: boolean;
  isSoloFemale: boolean;
  hasAccessibilityNeeds: boolean;
  religiousMinority: boolean;
  dietaryRestrictions: string[];
  languageBarriers: string[];
  preferredBudgetLevel?: string;
  travelStyle?: string;
}

// Trip Types
export enum TripStatus {
  DRAFT = 'DRAFT',
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  country: string;
  city?: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  numberOfTravelers: number;
  status: TripStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Itinerary Types
export enum ActivityCategory {
  DINING = 'DINING',
  SIGHTSEEING = 'SIGHTSEEING',
  ADVENTURE = 'ADVENTURE',
  CULTURAL = 'CULTURAL',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SHOPPING = 'SHOPPING',
  RELAXATION = 'RELAXATION',
  NIGHTLIFE = 'NIGHTLIFE',
}

export interface Activity {
  id: string;
  dayId: string;
  name: string;
  description?: string;
  category: ActivityCategory;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  startTime?: string;
  duration?: number;
  estimatedCost?: number;
  currency: string;
  bookingUrl?: string;
  requiresBooking: boolean;
  order: number;
  safetyNotes?: string;
}

export interface Day {
  id: string;
  itineraryId: string;
  dayNumber: number;
  date: Date;
  theme?: string;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  tripId: string;
  days: Day[];
  aiModel?: string;
  generatedAt: Date;
}

// Safety Types
export enum SafetyLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface SafetySection {
  id: string;
  safetyReportId: string;
  title: string;
  level: SafetyLevel;
  content: string;
  tips: string[];
  resources: string[];
  order: number;
}

export interface SafetyReport {
  id: string;
  tripId: string;
  overallLevel: SafetyLevel;
  summary: string;
  sections: SafetySection[];
  aiModel?: string;
  generatedAt: Date;
}

// Payment Types
export enum PlanType {
  PER_TRIP = 'PER_TRIP',
  MONTHLY_SUBSCRIPTION = 'MONTHLY_SUBSCRIPTION',
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  planType: PlanType;
  stripePaymentId?: string;
  stripeCustomerId?: string;
  status: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateTripRequest {
  destination: string;
  country: string;
  city?: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency?: string;
  numberOfTravelers?: number;
}

export interface GenerateItineraryRequest {
  tripId: string;
  preferences?: {
    activities?: ActivityCategory[];
    pacePreference?: 'relaxed' | 'moderate' | 'packed';
    includeDowntime?: boolean;
  };
}

export interface GenerateSafetyReportRequest {
  tripId: string;
  safetyProfileId?: string;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
