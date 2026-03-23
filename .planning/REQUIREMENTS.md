# WanderWise — Requirements

## Phase 1: Launch Readiness (Critical Fixes)

**Goal:** Fix the 4 critical bugs that make WanderWise unsafe or broken for real paying users.

**Done when:** All 4 requirements pass. Server starts cleanly with correct env vars, throws on missing JWT_SECRET, Stripe checkout works end-to-end, AI generation never 500s from malformed output, chat concierge is fully typed.

---

### REQ-01 — JWT Fail-Fast on Missing Secret

**Priority:** Critical — Security
**File:** `server/src/index.ts`

The server must refuse to start if `JWT_SECRET` is not set. Currently, `process.env.JWT_SECRET as string` silently becomes the string `"undefined"` if the env var is absent — making all JWTs signed with a predictable, attacker-known secret.

**Acceptance criteria:**
- `process.exit(1)` (or `throw`) before `app.listen()` if `JWT_SECRET` is falsy
- Clear error message: `"FATAL: JWT_SECRET environment variable is not set"`
- Same check for `DATABASE_URL` (prevents silent Prisma connection failures)
- Server starts normally when both vars are set

---

### REQ-02 — Stripe SDK + Checkout Session

**Priority:** Critical — Revenue
**Files:** `server/package.json`, `server/src/controllers/payment.controller.ts` (or new `server/src/services/stripe.service.ts`)

The `stripe` npm package is missing. Routes, Prisma model fields, and client API methods all exist — but any call to `POST /api/payments/create-checkout` throws `Cannot find module 'stripe'` at runtime.

**Acceptance criteria:**
- `stripe` added to `server/package.json` dependencies
- `POST /api/payments/create-checkout` creates a real Stripe Checkout Session and returns `{ url }`
- `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` read from env vars (never hardcoded)
- `STRIPE_SECRET_KEY` included in startup env-var fail-fast check (REQ-01)
- Both `PER_TRIP` and `MONTHLY_SUBSCRIPTION` plan types handled
- Client `createCheckout()` response redirects user to Stripe-hosted checkout page

---

### REQ-03 — Zod Validation on All AI Responses

**Priority:** Critical — Reliability
**File:** `server/src/services/ai.service.ts`

All 5 generation functions (`generateItineraryWithAI`, `generateSafetyReportWithAI`, `generateHotelSuggestionsWithAI`, `generateFlightSuggestionsWithAI`, `generateGroundTransportWithAI`) parse Groq JSON directly into Prisma with `JSON.parse(text)` and no schema validation. A malformed AI response (wrong enum value, missing required field, unexpected structure) causes an unhandled Prisma error that surfaces as a generic 500.

**Acceptance criteria:**
- Zod schema defined for each AI response shape (5 schemas total)
- Each generation function validates parsed JSON against its schema before returning
- On Zod parse failure: throw a typed `AIOutputError` with a user-friendly message (e.g., `"AI returned an unexpected response. Please try again."`)
- Invalid enum values from AI (e.g., unknown `ActivityCategory`) are caught before hitting Prisma
- No `JSON.parse` call remains without Zod validation following it

---

### REQ-04 — Type `trip` Parameter in Chat Concierge

**Priority:** Critical — Code Correctness
**File:** `server/src/services/ai.service.ts:500`

`chatConciergeWithAI(trip: any, ...)` accepts any shape. This suppresses TypeScript errors throughout the call chain and makes the function's contract invisible to callers.

**Acceptance criteria:**
- `trip` parameter typed with a proper interface (inline or imported from Prisma types)
- Interface covers: `destination`, `country`, `city`, `departureCity`, `startDate`, `endDate`, `budget`, `currency`, `numberOfTravelers`, `itinerary` (optional, with `days` count), `safetyReport` (optional, with `overallLevel`)
- No `any` in the function signature or its internal use of `trip` fields
- Existing callers (`chat.controller.ts`) compile without errors after the type change

---

## Phase 2: Hardening (Post-Launch)

Deferred from Phase 1:
- Token refresh / silent re-auth
- Per-user rate limiting on AI generation endpoints
- Resend custom domain (replace `onboarding@resend.dev`)
- Collaborator invite emails
- Chat history persistence (Prisma `ChatMessage` model)
- Enum validation improvements (`as any` coercions)

## Phase 3: Quality

Deferred post-hardening:
- Test suite (Vitest unit + integration)
- GitHub Actions CI/CD
- Pagination on trip listing
