# WanderWise — Concerns & Tech Debt

## Critical

### 1. Stripe integration is incomplete
- `payment.routes.ts` and `payment.controller.ts` exist
- Prisma Payment model has `stripePaymentId` and `stripeCustomerId` fields
- `api.ts` has `createCheckout()` method
- **But:** `stripe` package is NOT in `server/package.json`
- The payment flow is wired up on the surface but broken at runtime — any call to `/api/payments/create-checkout` will fail
- **Fix needed:** Add `stripe` SDK and implement the checkout session creation

### 2. JWT secret falls back to `undefined`
- `server/src/middleware/auth.ts:28`: `jwt.verify(token, process.env.JWT_SECRET as string)`
- If `JWT_SECRET` is not set, `process.env.JWT_SECRET` is `undefined`, cast to string becomes `"undefined"`
- This means the server starts and "works" with a predictable secret — all JWTs signed in this state are compromised
- **Fix needed:** Fail fast on startup if `JWT_SECRET` is not set

### 3. No token refresh mechanism
- JWT tokens expire after 7 days
- No refresh token endpoint or silent refresh logic on the client
- When a token expires, the user is hard-redirected to `/login` via the Axios interceptor
- All in-progress work (form data, unsaved trip edits) is lost
- **Fix needed:** Add refresh token rotation or extend session on activity

### 4. `chatConciergeWithAI` uses `trip: any`
- `server/src/services/ai.service.ts:500`: `trip: any` parameter
- No type safety on the chat concierge input — any malformed trip object silently produces a bad prompt
- **Fix needed:** Replace `any` with the proper Prisma `Trip` type with included relations

---

## High Priority

### 5. AI responses are not validated before DB write
- All AI generation functions parse Groq JSON with `JSON.parse(text)` and immediately return
- No Zod validation of the AI response shape before it hits Prisma
- A malformed AI response (wrong enum value, missing required field) causes a runtime Prisma error that surfaces as a 500
- Affected: all 5 generation functions in `ai.service.ts`
- **Fix needed:** Add Zod schemas to validate AI output before writing to DB

### 6. `as any` enum coercions in controllers
- `itinerary.controller.ts:71-72`: ActivityCategory cast with `as any`
- `safety.controller.ts:68,76`: SafetyLevel cast with `as any`
- These bypass TypeScript's enum safety — an invalid AI-returned string silently becomes an invalid Prisma enum value
- Related to concern #5 — root cause is missing AI output validation

### 7. `expiresIn: '7d' as any` in auth controller
- `auth.controller.ts:48,93`: JWT options cast with `as any` to silence a TypeScript error
- The type error being suppressed indicates a version mismatch between `@types/jsonwebtoken` and usage
- **Fix needed:** Use proper `SignOptions` type or update types package

### 8. Resend "from" uses sandbox domain
- `email.service.ts:23`: `from: 'WanderWise <onboarding@resend.dev>'`
- Resend sandbox domain only delivers to verified emails in test mode
- For production, needs a custom verified domain (e.g., `noreply@wanderwise.app`)

### 9. No rate limiting on AI endpoints
- `express-rate-limit` is installed but only general rate limiting is configured
- The AI generation endpoints (itinerary, safety, hotels, flights, transport) each make expensive Groq API calls
- A single user could trigger all 5 generation endpoints rapidly and exhaust the Groq quota
- **Fix needed:** Per-user rate limiting on generation endpoints (e.g., 3 per hour per user)

---

## Medium Priority

### 10. Token stored in localStorage (XSS risk)
- `authStore.ts:46`: `localStorage.getItem('token')`
- JWT in localStorage is accessible to any JavaScript on the page — XSS vulnerability
- Helmet is configured but CSP is disabled in development
- **Acceptable tradeoff** for an SPA without `httpOnly` cookie infrastructure, but worth noting

### 11. Collaborator invite accepts any email without verification
- `collaborator.controller.ts`: Invites are created with `status: 'pending'`
- No email is sent to the invitee to notify them or prompt acceptance
- `email.service.ts` only implements `sendWelcomeEmail` — no invite email exists
- **Fix needed:** Send invite email via Resend when collaborator is added

### 12. Weather controller source unknown
- `weather.routes.ts` and `weather.controller.ts` exist and are mounted
- The weather integration's external API is not visible from package.json (no weather SDK listed)
- Could be using a free public API via axios with no SDK, or could be incomplete
- **Needs investigation:** Read `weather.controller.ts` to verify it works

### 13. No pagination on trip listing
- `trip.controller.ts:15`: `prisma.trip.findMany(...)` — no `take`/`skip`
- As a user accumulates trips, this query returns all trips every time
- **Fix needed:** Add cursor-based or offset pagination before scaling

### 14. Static template data location unclear
- `server/src/data/` directory exists (referenced by `templates.routes.ts`)
- Templates appear to be static JSON/TS data, not DB-backed
- No migration or seed path for templates — unclear how they get updated

---

## Low Priority

### 15. No CI/CD pipeline
- No `.github/` directory — no GitHub Actions
- Deployments are manual or via Render.com's auto-deploy on push
- **No automated test runs** on PR (also no tests yet — see TESTING.md)

### 16. `docker-compose.yml` purpose unclear
- File exists at root but contents not read
- Likely provides a local PostgreSQL container for development
- No README documentation on how to use it

### 17. Concierge chat history is client-managed (no persistence)
- Chat history is passed in the request body on every message
- No `ChatMessage` model in Prisma schema
- History is lost on page refresh
- **By design or oversight?** — worth clarifying before building on top of it
