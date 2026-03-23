# WanderWise — External Integrations

## AI — Groq
- **SDK:** `groq-sdk` 0.37
- **Model:** `llama-3.3-70b-versatile` (hardcoded in `server/src/services/ai.service.ts:6`)
- **Usage:** 5 distinct AI generation functions, all in `ai.service.ts`:
  - `generateItineraryWithAI` — day-by-day trip itinerary
  - `generateSafetyReportWithAI` — personalized safety report with traveler profile
  - `generateHotelSuggestionsWithAI` — 4-5 hotel suggestions with Booking.com deep links
  - `generateFlightSuggestionsWithAI` — 3-4 flight options with Google Flights deep links
  - `generateGroundTransportWithAI` — airport-to-city transport options
  - `chatConciergeWithAI` — multi-turn trip concierge chat
- **Response format:** All generation calls use `response_format: { type: 'json_object' }` — structured JSON output
- **Error handling:** Catches 429 rate limit and surfaces user-friendly message; other errors surface as "unavailable"

## Database — PostgreSQL (via Supabase)
- **ORM:** Prisma 5.8
- **Schema:** `server/prisma/schema.prisma`
- **Connection:** Dual URL pattern (`DATABASE_URL` + `DIRECT_URL`) — indicates Supabase with pgBouncer connection pooling
- **Key models:** User, SafetyProfile, Trip, TripCollaborator, Itinerary, Day, Activity, SafetyReport, SafetySection, Payment
- **Migrations:** `prisma migrate dev` | Push: `prisma db push` | Seed: `tsx prisma/seed.ts`

## Email — Resend
- **SDK:** `resend` 6.9
- **Used in:** `server/src/services/email.service.ts`
- **Currently implemented:** Welcome email on registration only
- **From address:** `onboarding@resend.dev` (Resend sandbox domain — not a custom domain yet)
- **Graceful degradation:** If `RESEND_API_KEY` is not set, email is silently skipped (logged as warn)

## Payments — Stripe (partial)
- **Route:** `server/src/routes/payment.routes.ts`
- **Schema fields:** `stripePaymentId`, `stripeCustomerId` on Payment model
- **API endpoint:** `POST /api/payments/create-checkout`
- **Status:** Stripe SDK not in `package.json` — payment route exists but Stripe integration appears incomplete or missing the SDK

## Booking Deep Links (no API, URL generation)
- **Google Flights:** Built in `ai.service.ts:generateFlightBookingUrl()` — constructs `google.com/travel/flights` URL
- **Booking.com:** Built in `ai.service.ts:generateHotelBookingUrl()` — constructs `booking.com/searchresults.html` URL
- Not real API calls — URL templates only

## Weather
- **Route:** `server/src/routes/weather.routes.ts`
- **Controller:** `server/src/controllers/weather.controller.ts`
- **External API:** Unknown — source not read; likely OpenWeatherMap or similar (not in package.json as named SDK)

## Auth — Custom JWT (no OAuth provider)
- Self-hosted: bcryptjs password hashing + jsonwebtoken signing
- Token stored in `localStorage` on client, sent as `Authorization: Bearer` header
- 7-day expiry (`expiresIn: '7d'`)
- No OAuth/social login (Google, GitHub, etc.)

## Deployment
- **render.yaml** present — configured for Render.com deployment
- Server serves client build in production (single service, no separate CDN)
