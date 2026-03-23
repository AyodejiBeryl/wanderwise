# WanderWise — Architecture

## Pattern
**Monorepo SPA + REST API** — npm workspaces with three packages:
- `client/` — React SPA (Vite)
- `server/` — Express REST API (Node.js)
- `shared/` — TypeScript types and constants shared between both

In production, server serves the client's compiled `dist/` as static files, making it a single deployable unit (no separate CDN). In development, both run separately (`npm run dev` uses `concurrently`).

## Architectural Layers

### Client
```
Pages (routes)         — client/src/pages/
  └── Components       — client/src/components/
  └── Hooks            — client/src/hooks/       (React Query + business logic)
  └── Stores           — client/src/stores/      (Zustand global state)
  └── Services         — client/src/services/    (HTTP client wrapper)
  └── Utils            — client/src/utils/
  └── Styles           — client/src/styles/
```

### Server
```
Routes                 — server/src/routes/      (Express routers)
  └── Middleware       — server/src/middleware/  (auth, error handler, 404)
  └── Controllers      — server/src/controllers/ (request/response handling)
  └── Services         — server/src/services/   (business logic, AI, email)
  └── Data             — server/src/data/        (static data / seeds)
  └── Utils            — server/src/utils/       (logger)
```

## Data Flow — Main User Journey

1. User registers/logs in → `POST /api/auth/register|login`
2. JWT returned → stored in `localStorage` → attached to all future requests via Axios interceptor
3. User creates trip → `POST /api/trips` → Prisma writes to PostgreSQL
4. User triggers itinerary generation → `POST /api/itineraries/generate`:
   - Controller fetches trip from DB
   - Calls `ai.service.ts:generateItineraryWithAI()` → Groq API (llama-3.3-70b)
   - Parses JSON response → creates Itinerary + Day + Activity records in Prisma
5. Safety report, hotel/flight/transport suggestions follow same pattern
6. Concierge chat → `POST /api/chat` → stateless (history passed in request body each time)

## Entry Points
- **Client:** `client/src/main.tsx` → mounts `<App>` with React Router
- **Client App:** `client/src/App.tsx` → route definitions + `ProtectedRoute` wrapper
- **Server:** `server/src/index.ts` → Express app setup, middleware registration, route mounting
- **Server routes base:** All prefixed `/api/` — e.g., `/api/trips`, `/api/auth`, `/api/itineraries`

## Key Abstractions

**`ApiClient` (`client/src/services/api.ts`):**
Singleton class wrapping Axios. All API calls go through this. Handles auth token injection (request interceptor) and 401 redirect (response interceptor). Every endpoint is a typed method.

**`useAuthStore` (`client/src/stores/authStore.ts`):**
Zustand store holding user/token/isAuthenticated. Persists token to localStorage. Only global store — everything else uses React Query hooks.

**`authenticate` middleware (`server/src/middleware/auth.ts`):**
JWT verification middleware applied to all protected routes. Attaches `req.user = { id, email }` for downstream use.

**`ai.service.ts` (`server/src/services/ai.service.ts`):**
Central AI layer. All 6 Groq-powered generation functions live here. Returns typed interfaces that controllers then persist to Prisma.

**Prisma client (`server/src/services/prisma.ts`):**
Singleton Prisma client instance imported across all controllers.

## Client State Management
- **Auth state:** Zustand (`authStore`) — persisted to localStorage
- **Server data:** React Query hooks (`client/src/hooks/`) — cached, refetched on stale
- **Form state:** React Hook Form (local to each form component)
- **UI state:** React `useState` local to components
