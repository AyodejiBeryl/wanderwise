import Groq from 'groq-sdk';
import { z } from 'zod';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

// ── AI response Zod schemas ────────────────────────────────────────────────

const ActivitySchema = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
  category: z.string(),
  location: z.string(),
  address: z.string().optional(),
  startTime: z.string().optional(),
  duration: z.number().optional(),
  estimatedCost: z.number().optional(),
  currency: z.string().optional(),
  safetyNotes: z.string().optional(),
  requiresBooking: z.boolean().default(false),
});

const DaySchema = z.object({
  dayNumber: z.number(),
  theme: z.string().optional().default(''),
  activities: z.array(ActivitySchema),
});

const ItineraryResponseSchema = z.object({
  days: z.array(DaySchema),
});

const SafetySectionSchema = z.object({
  title: z.string(),
  level: z.string(),
  content: z.string(),
  tips: z.array(z.string()),
  resources: z.array(z.string()),
  order: z.number().optional(),
});

const SafetyReportResponseSchema = z.object({
  overallLevel: z.string(),
  summary: z.string(),
  sections: z.array(SafetySectionSchema),
});

const HotelSchema = z.object({
  name: z.string(),
  area: z.string(),
  priceRange: z.string(),
  totalEstimate: z.number(),
  currency: z.string(),
  category: z.string(),
  description: z.string(),
  amenities: z.array(z.string()),
  whyRecommended: z.string(),
  bookingTip: z.string(),
  bookingUrl: z.string().optional(),
});

const HotelSuggestionsResponseSchema = z.object({
  hotels: z.array(HotelSchema),
  generalTips: z.array(z.string()),
});

const FlightSchema = z.object({
  airline: z.string(),
  route: z.string(),
  estimatedPrice: z.number(),
  currency: z.string(),
  duration: z.string(),
  class: z.string(),
  bestBookingTime: z.string(),
  tips: z.string(),
  bookingUrl: z.string().optional(),
});

const FlightSuggestionsResponseSchema = z.object({
  flights: z.array(FlightSchema),
  generalTips: z.array(z.string()),
});

const GroundTransportOptionSchema = z.object({
  mode: z.string(),
  provider: z.string(),
  route: z.string(),
  estimatedPrice: z.number(),
  currency: z.string(),
  duration: z.string(),
  frequency: z.string(),
  tips: z.string(),
  bookingUrl: z.string().optional(),
});

const GroundTransportResponseSchema = z.object({
  nearestAirport: z.string(),
  transportOptions: z.array(GroundTransportOptionSchema),
  generalTips: z.array(z.string()),
});

// ── Trip type for chat concierge ───────────────────────────────────────────

interface ConciergeTrip {
  destination: string;
  country: string;
  city?: string | null;
  departureCity?: string | null;
  startDate: Date | string;
  endDate: Date | string;
  budget: number;
  currency: string;
  numberOfTravelers: number;
  itinerary?: { days?: unknown[] } | null;
  safetyReport?: { overallLevel?: string } | null;
}

const AI_MODEL = 'llama-3.3-70b-versatile';

interface TripContext {
  destination: string;
  country: string;
  city?: string | null;
  departureCity?: string | null;
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
  bookingUrl?: string;
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
  bookingUrl?: string;
}

interface GeneratedFlightSuggestions {
  flights: GeneratedFlightSuggestion[];
  generalTips: string[];
}

function generateFlightBookingUrl(
  origin: string,
  destination: string,
  departDate: Date,
  returnDate: Date
): string {
  const d = new Date(departDate).toISOString().split('T')[0];
  const r = new Date(returnDate).toISOString().split('T')[0];
  const q = encodeURIComponent(`flights from ${origin} to ${destination}`);
  return `https://www.google.com/travel/flights?q=${q}&d=${d}&r=${r}`;
}

function generateHotelBookingUrl(
  hotelName: string,
  destination: string,
  checkin: Date,
  checkout: Date,
  adults: number
): string {
  const ss = encodeURIComponent(`${hotelName} ${destination}`);
  const ci = new Date(checkin).toISOString().split('T')[0];
  const co = new Date(checkout).toISOString().split('T')[0];
  return `https://www.booking.com/searchresults.html?ss=${ss}&checkin=${ci}&checkout=${co}&group_adults=${adults}`;
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
  const result = ItineraryResponseSchema.safeParse(JSON.parse(text));
  if (!result.success) {
    throw new Error('AI returned an unexpected itinerary format. Please try again.');
  }
  return result.data as GeneratedItinerary;
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
  const result = SafetyReportResponseSchema.safeParse(JSON.parse(text));
  if (!result.success) {
    throw new Error('AI returned an unexpected safety report format. Please try again.');
  }
  return result.data as GeneratedSafetyReport;
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
  const result = HotelSuggestionsResponseSchema.safeParse(JSON.parse(text));
  if (!result.success) {
    throw new Error('AI returned an unexpected hotel suggestions format. Please try again.');
  }
  const parsed = result.data as GeneratedHotelSuggestions;

  const destination = trip.city || trip.destination;
  parsed.hotels = parsed.hotels.map((hotel) => ({
    ...hotel,
    bookingUrl: generateHotelBookingUrl(
      hotel.name,
      destination,
      trip.startDate,
      trip.endDate,
      trip.numberOfTravelers
    ),
  }));

  return parsed;
}

interface GeneratedGroundTransportOption {
  mode: string;
  provider: string;
  route: string;
  estimatedPrice: number;
  currency: string;
  duration: string;
  frequency: string;
  tips: string;
  bookingUrl?: string;
}

interface GeneratedGroundTransportSuggestions {
  nearestAirport: string;
  transportOptions: GeneratedGroundTransportOption[];
  generalTips: string[];
}

export async function generateGroundTransportWithAI(
  trip: TripContext
): Promise<GeneratedGroundTransportSuggestions> {
  const destination = trip.city || trip.destination;

  const prompt = `You are an expert local transportation advisor. Suggest ground transportation options for getting from the nearest major airport to ${destination}, ${trip.country}.

Trip Details:
- Destination: ${destination}, ${trip.country}
- Number of Travelers: ${trip.numberOfTravelers}
- Total Trip Budget: ${trip.budget} ${trip.currency}

First, identify the nearest major airport to ${destination}. Then provide 4-5 ground transportation options for getting from that airport to the city center/main area of ${destination}. Include a mix of:
- Public transit (bus, metro, train)
- Airport shuttle or express services
- Taxi / ride-hailing (Uber, Lyft, local equivalents)
- Private transfer options
- Car rental if relevant

Be specific to this destination. Use real service names, routes, and realistic prices.

Respond with this exact JSON structure:
{
  "nearestAirport": "Airport Name (CODE)",
  "transportOptions": [
    {
      "mode": "Train",
      "provider": "Service/Company Name",
      "route": "Airport Station → City Center Station",
      "estimatedPrice": 15,
      "currency": "${trip.currency}",
      "duration": "35 minutes",
      "frequency": "Every 15 minutes",
      "tips": "Specific tip for this option"
    }
  ],
  "generalTips": ["General ground transport tip 1", "General ground transport tip 2"]
}`;

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: 'You are a local transportation expert. Always respond with valid JSON only, no extra text.' },
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
  const result = GroundTransportResponseSchema.safeParse(JSON.parse(text));
  if (!result.success) {
    throw new Error('AI returned an unexpected transport format. Please try again.');
  }
  return result.data as GeneratedGroundTransportSuggestions;
}

export async function generateFlightSuggestionsWithAI(
  trip: TripContext
): Promise<GeneratedFlightSuggestions> {
  const prompt = `You are an expert flight and travel logistics advisor. Suggest flight options for traveling from ${trip.departureCity} to ${trip.destination}, ${trip.country}${trip.city ? ` (${trip.city})` : ''}.

Trip Details:
- Departing From: ${trip.departureCity} (ALL flights MUST depart from here or its nearest airport)
- Travel Dates: ${new Date(trip.startDate).toLocaleDateString()} to ${new Date(trip.endDate).toLocaleDateString()}
- Total Trip Budget: ${trip.budget} ${trip.currency}
- Number of Travelers: ${trip.numberOfTravelers}

IMPORTANT: Every single flight suggestion must originate from ${trip.departureCity} or the nearest major airport to ${trip.departureCity}. Do NOT suggest flights from other cities.

Suggest 3-4 realistic flight options including different airlines and price points. Include both direct and connecting flights if applicable. Mention the specific airport codes.

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
  const flightResult = FlightSuggestionsResponseSchema.safeParse(JSON.parse(text));
  if (!flightResult.success) {
    throw new Error('AI returned an unexpected flights format. Please try again.');
  }
  const parsed = flightResult.data as GeneratedFlightSuggestions;

  const origin = trip.departureCity || 'flights';
  const destination = trip.city || trip.destination;
  parsed.flights = parsed.flights.map((flight) => ({
    ...flight,
    bookingUrl: generateFlightBookingUrl(
      origin,
      destination,
      trip.startDate,
      trip.endDate
    ),
  }));

  return parsed;
}

export async function chatConciergeWithAI(
  trip: ConciergeTrip,
  userMessage: string,
  history: Array<{ role: string; content: string }>
): Promise<string> {
  const dayCount = trip.itinerary?.days?.length || 0;
  const hasItinerary = dayCount > 0;
  const hasSafety = !!trip.safetyReport;

  const systemPrompt = `You are WanderWise Concierge, a friendly and knowledgeable AI travel assistant. You are helping a traveler with their trip.

Trip Details:
- Destination: ${trip.destination}, ${trip.country}${trip.city ? ` (${trip.city})` : ''}
- Departure: ${trip.departureCity || 'Not set'}
- Dates: ${new Date(trip.startDate).toLocaleDateString()} to ${new Date(trip.endDate).toLocaleDateString()}
- Budget: ${trip.budget} ${trip.currency}
- Travelers: ${trip.numberOfTravelers}
${hasItinerary ? `- Has a ${dayCount}-day itinerary generated` : '- No itinerary generated yet'}
${hasSafety ? `- Safety level: ${trip.safetyReport?.overallLevel}` : ''}

You can help with:
- Local restaurant recommendations, hidden gems, must-try foods
- Cultural tips, etiquette, and local customs
- Packing suggestions and what to wear
- Language tips and useful phrases
- Specific questions about activities in their itinerary
- Alternative activity suggestions
- Money-saving tips
- Nightlife, shopping, and entertainment options
- Visa and documentation advice
- Local transportation tips

Keep responses concise, friendly, and specific to their destination. Use bullet points for lists. Don't repeat the trip details back unless asked.`;

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  for (const msg of history) {
    messages.push({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    });
  }

  messages.push({ role: 'user', content: userMessage });

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: AI_MODEL,
      messages,
      temperature: 0.8,
      max_tokens: 1000,
    });
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes('rate_limit')) {
      throw new Error('AI concierge is temporarily rate-limited. Please wait a moment and try again.');
    }
    throw new Error('AI concierge is currently unavailable. Please try again later.');
  }

  return completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response. Please try again.';
}
