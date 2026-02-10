import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

const AI_MODEL = 'llama-3.3-70b-versatile';

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

interface GeneratedHotelSuggestion {
  name: string;
  area: string;
  priceRange: string;
  totalEstimate: number;
  currency: string;
  category: string;
  description: string;
  amenities: string[];
  whyRecommended: string;
  bookingTip: string;
}

interface GeneratedHotelSuggestions {
  hotels: GeneratedHotelSuggestion[];
  generalTips: string[];
}

interface GeneratedFlightSuggestion {
  airline: string;
  route: string;
  estimatedPrice: number;
  currency: string;
  duration: string;
  class: string;
  bestBookingTime: string;
  tips: string;
}

interface GeneratedFlightSuggestions {
  flights: GeneratedFlightSuggestion[];
  generalTips: string[];
}

function getDayCount(start: Date, end: Date): number {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export async function generateItineraryWithAI(
  trip: TripContext,
  preferences?: ActivityPreferences
): Promise<GeneratedItinerary> {
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

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: 'You are a travel planning assistant. Always respond with valid JSON only, no extra text.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 4096,
    });
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes('rate_limit')) {
      throw new Error('AI service is temporarily rate-limited. Please wait a minute and try again.');
    }
    throw new Error('AI service is currently unavailable. Please try again later.');
  }

  const text = completion.choices[0]?.message?.content || '';
  const parsed: GeneratedItinerary = JSON.parse(text);
  return parsed;
}

export async function generateSafetyReportWithAI(
  trip: TripContext,
  safetyProfile?: SafetyProfileContext | null
): Promise<GeneratedSafetyReport> {
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

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: 'You are a travel safety expert. Always respond with valid JSON only, no extra text.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4096,
    });
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes('rate_limit')) {
      throw new Error('AI service is temporarily rate-limited. Please wait a minute and try again.');
    }
    throw new Error('AI service is currently unavailable. Please try again later.');
  }

  const text = completion.choices[0]?.message?.content || '';
  const parsed: GeneratedSafetyReport = JSON.parse(text);
  return parsed;
}

export async function generateHotelSuggestionsWithAI(
  trip: TripContext
): Promise<GeneratedHotelSuggestions> {
  const dayCount = getDayCount(trip.startDate, trip.endDate);
  const budgetPerNight = (trip.budget * 0.35 / dayCount).toFixed(0);

  const prompt = `You are an expert travel accommodation advisor. Suggest 4-5 hotels/accommodations for a trip to ${trip.destination}, ${trip.country}${trip.city ? ` (${trip.city})` : ''}.

Trip Details:
- Dates: ${new Date(trip.startDate).toLocaleDateString()} to ${new Date(trip.endDate).toLocaleDateString()} (${dayCount} nights)
- Total Budget: ${trip.budget} ${trip.currency} (approx ${budgetPerNight} ${trip.currency}/night for accommodation)
- Number of Travelers: ${trip.numberOfTravelers}

Provide a mix of budget levels (budget, mid-range, upscale) that fit within the traveler's overall budget. Include real neighborhood/area names. Be specific to this destination.

Respond with this exact JSON structure:
{
  "hotels": [
    {
      "name": "Hotel/Accommodation Name",
      "area": "Neighborhood or area name",
      "priceRange": "$80-120/night",
      "totalEstimate": 400,
      "currency": "${trip.currency}",
      "category": "mid-range",
      "description": "Brief description of the property and what makes it good",
      "amenities": ["WiFi", "Pool", "Breakfast", "Airport Shuttle"],
      "whyRecommended": "Why this is a good choice for this trip",
      "bookingTip": "Specific booking advice"
    }
  ],
  "generalTips": ["General accommodation tip 1", "General accommodation tip 2"]
}`;

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: 'You are a travel accommodation expert. Always respond with valid JSON only, no extra text.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 3000,
    });
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes('rate_limit')) {
      throw new Error('AI service is temporarily rate-limited. Please wait a minute and try again.');
    }
    throw new Error('AI service is currently unavailable. Please try again later.');
  }

  const text = completion.choices[0]?.message?.content || '';
  const parsed: GeneratedHotelSuggestions = JSON.parse(text);
  return parsed;
}

export async function generateFlightSuggestionsWithAI(
  trip: TripContext
): Promise<GeneratedFlightSuggestions> {
  const prompt = `You are an expert flight and travel logistics advisor. Suggest flight options for traveling to ${trip.destination}, ${trip.country}${trip.city ? ` (${trip.city})` : ''}.

Trip Details:
- Travel Dates: ${new Date(trip.startDate).toLocaleDateString()} to ${new Date(trip.endDate).toLocaleDateString()}
- Total Trip Budget: ${trip.budget} ${trip.currency}
- Number of Travelers: ${trip.numberOfTravelers}

Suggest 3-4 realistic flight options including different airlines and price points. Include both direct and connecting flights if applicable. Mention the main airports. Be specific to this destination.

Respond with this exact JSON structure:
{
  "flights": [
    {
      "airline": "Airline Name",
      "route": "Origin Airport → Destination Airport (Direct/1 Stop)",
      "estimatedPrice": 450,
      "currency": "${trip.currency}",
      "duration": "7h 30m",
      "class": "Economy",
      "bestBookingTime": "6-8 weeks before departure",
      "tips": "Specific tip for this flight option"
    }
  ],
  "generalTips": ["Use Google Flights or Skyscanner for price tracking", "Consider nearby airports for cheaper fares"]
}`;

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: 'You are a flight booking expert. Always respond with valid JSON only, no extra text.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 3000,
    });
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes('rate_limit')) {
      throw new Error('AI service is temporarily rate-limited. Please wait a minute and try again.');
    }
    throw new Error('AI service is currently unavailable. Please try again later.');
  }

  const text = completion.choices[0]?.message?.content || '';
  const parsed: GeneratedFlightSuggestions = JSON.parse(text);
  return parsed;
}
