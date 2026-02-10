import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface TripContext {
  destination: string;
  country: string;
  city?: string | null;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  numberOfTravelers: number;
}

interface SafetyProfileContext {
  isLGBTQ: boolean;
  isSoloFemale: boolean;
  hasAccessibilityNeeds: boolean;
  religiousMinority: boolean;
  dietaryRestrictions: string[];
  languageBarriers: string[];
  preferredBudgetLevel?: string | null;
  travelStyle?: string | null;
}

interface ActivityPreferences {
  activities?: string[];
  pacePreference?: string;
  includeDowntime?: boolean;
}

interface GeneratedActivity {
  name: string;
  description: string;
  category: string;
  location: string;
  address?: string;
  startTime: string;
  duration: number;
  estimatedCost: number;
  currency: string;
  safetyNotes?: string;
  requiresBooking: boolean;
}

interface GeneratedDay {
  dayNumber: number;
  theme: string;
  activities: GeneratedActivity[];
}

interface GeneratedItinerary {
  days: GeneratedDay[];
}

interface GeneratedSafetySection {
  title: string;
  level: string;
  content: string;
  tips: string[];
  resources: string[];
}

interface GeneratedSafetyReport {
  overallLevel: string;
  summary: string;
  sections: GeneratedSafetySection[];
}

function getDayCount(start: Date, end: Date): number {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export async function generateItineraryWithAI(
  trip: TripContext,
  preferences?: ActivityPreferences
): Promise<GeneratedItinerary> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.8,
    },
  });

  const dayCount = getDayCount(trip.startDate, trip.endDate);
  const budgetPerDay = (trip.budget / dayCount).toFixed(0);

  const prompt = `You are an expert travel planner. Create a detailed ${dayCount}-day itinerary for a trip to ${trip.destination}, ${trip.country}${trip.city ? ` (${trip.city})` : ''}.

Trip Details:
- Dates: ${new Date(trip.startDate).toLocaleDateString()} to ${new Date(trip.endDate).toLocaleDateString()}
- Total Budget: ${trip.budget} ${trip.currency} (~${budgetPerDay} ${trip.currency}/day)
- Number of Travelers: ${trip.numberOfTravelers}
${preferences?.pacePreference ? `- Pace: ${preferences.pacePreference}` : ''}
${preferences?.activities?.length ? `- Preferred Activities: ${preferences.activities.join(', ')}` : ''}
${preferences?.includeDowntime ? '- Include downtime/rest periods' : ''}

Create a realistic, day-by-day itinerary. Each day should have 3-5 activities. Keep total estimated costs within the daily budget.

Valid activity categories: DINING, SIGHTSEEING, ADVENTURE, CULTURAL, ENTERTAINMENT, SHOPPING, RELAXATION, NIGHTLIFE

Respond with this exact JSON structure:
{
  "days": [
    {
      "dayNumber": 1,
      "theme": "Arrival & City Exploration",
      "activities": [
        {
          "name": "Activity Name",
          "description": "Brief description of the activity",
          "category": "SIGHTSEEING",
          "location": "Place name",
          "address": "Full address if known",
          "startTime": "9:00 AM",
          "duration": 120,
          "estimatedCost": 25.00,
          "currency": "${trip.currency}",
          "safetyNotes": "Any relevant safety tips",
          "requiresBooking": false
        }
      ]
    }
  ]
}`;

  let result;
  try {
    result = await model.generateContent(prompt);
  } catch (error: any) {
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error('AI service is temporarily rate-limited. Please wait a minute and try again.');
    }
    throw new Error('AI service is currently unavailable. Please try again later.');
  }
  const text = result.response.text();

  const parsed: GeneratedItinerary = JSON.parse(text);
  return parsed;
}

export async function generateSafetyReportWithAI(
  trip: TripContext,
  safetyProfile?: SafetyProfileContext | null
): Promise<GeneratedSafetyReport> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const profileDetails = safetyProfile
    ? `
Traveler Safety Profile:
${safetyProfile.isLGBTQ ? '- LGBTQ+ traveler' : ''}
${safetyProfile.isSoloFemale ? '- Solo female traveler' : ''}
${safetyProfile.hasAccessibilityNeeds ? '- Has accessibility needs' : ''}
${safetyProfile.religiousMinority ? '- Religious minority' : ''}
${safetyProfile.dietaryRestrictions?.length ? `- Dietary restrictions: ${safetyProfile.dietaryRestrictions.join(', ')}` : ''}
${safetyProfile.languageBarriers?.length ? `- Language concerns: ${safetyProfile.languageBarriers.join(', ')}` : ''}
`.trim()
    : 'No specific safety profile provided. Give general safety advice.';

  const prompt = `You are a travel safety expert providing personalized safety reports. Create a comprehensive safety report for traveling to ${trip.destination}, ${trip.country}${trip.city ? ` (${trip.city})` : ''}.

Trip Dates: ${new Date(trip.startDate).toLocaleDateString()} to ${new Date(trip.endDate).toLocaleDateString()}
Number of Travelers: ${trip.numberOfTravelers}

${profileDetails}

Create a thorough, honest, and helpful safety report. Be specific about the destination. Include local emergency contacts and useful resources where possible.

Valid safety levels: LOW, MODERATE, HIGH, CRITICAL

Include relevant sections based on the traveler's profile. Always include "General Safety" and "Health & Medical" sections. Only include LGBTQ+, Solo Female, Accessibility, or Religious sections if they are relevant to the traveler's profile.

Respond with this exact JSON structure:
{
  "overallLevel": "MODERATE",
  "summary": "Brief overall safety assessment for this destination",
  "sections": [
    {
      "title": "General Safety",
      "level": "MODERATE",
      "content": "Detailed safety information for this specific topic",
      "tips": ["Specific tip 1", "Specific tip 2", "Specific tip 3"],
      "resources": ["Emergency: 911", "Tourist Police: +XX XXX XXX"]
    }
  ]
}`;

  let result;
  try {
    result = await model.generateContent(prompt);
  } catch (error: any) {
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error('AI service is temporarily rate-limited. Please wait a minute and try again.');
    }
    throw new Error('AI service is currently unavailable. Please try again later.');
  }
  const text = result.response.text();

  const parsed: GeneratedSafetyReport = JSON.parse(text);
  return parsed;
}
