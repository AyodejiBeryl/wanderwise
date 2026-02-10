import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Trip schemas
export const createTripSchema = z
  .object({
    destination: z.string().min(1, 'Destination is required'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().optional(),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    budget: z.number().positive('Budget must be positive'),
    currency: z.string().length(3).default('USD'),
    numberOfTravelers: z.number().int().positive().default(1),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const updateTripSchema = z.object({
  destination: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  city: z.string().optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  budget: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  numberOfTravelers: z.number().int().positive().optional(),
  status: z
    .enum(['DRAFT', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .optional(),
});

// Itinerary schemas
export const generateItinerarySchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  preferences: z
    .object({
      activities: z
        .array(
          z.enum([
            'DINING',
            'SIGHTSEEING',
            'ADVENTURE',
            'CULTURAL',
            'ENTERTAINMENT',
            'SHOPPING',
            'RELAXATION',
            'NIGHTLIFE',
          ])
        )
        .optional(),
      pacePreference: z.enum(['relaxed', 'moderate', 'packed']).optional(),
      includeDowntime: z.boolean().optional(),
    })
    .optional(),
});

// Safety schemas
export const generateSafetyReportSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
});

// User/Profile schemas
export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
});

export const safetyProfileSchema = z.object({
  isLGBTQ: z.boolean().default(false),
  isSoloFemale: z.boolean().default(false),
  hasAccessibilityNeeds: z.boolean().default(false),
  religiousMinority: z.boolean().default(false),
  dietaryRestrictions: z.array(z.string()).default([]),
  languageBarriers: z.array(z.string()).default([]),
  preferredBudgetLevel: z
    .enum(['budget', 'moderate', 'luxury'])
    .optional()
    .nullable(),
  travelStyle: z
    .enum(['adventurous', 'relaxed', 'cultural', 'mixed'])
    .optional()
    .nullable(),
});
