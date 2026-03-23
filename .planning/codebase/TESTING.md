# WanderWise — Testing

## Framework
- **Vitest** on both client and server (configured in each workspace's `package.json`)
- Run all tests: `npm run test` (root — runs `vitest` in all workspaces)
- Run per workspace: `npm run test --workspace=client` or `--workspace=server`

## Current State
No test files were found during codebase mapping. Both client and server have Vitest configured as a dev dependency and a `test` script, but no `*.test.ts` or `*.spec.ts` files exist yet.

**Test coverage: 0%**

## What Needs Tests (priority order)
Given the codebase, the highest-value tests to write first:

### Server — Unit Tests
1. **`ai.service.ts`** — Mock Groq SDK, test prompt construction and JSON parsing
2. **`auth.controller.ts`** — Registration, login, duplicate email handling
3. **`auth.ts` middleware** — Valid token, expired token, missing token
4. **`trip.controller.ts`** — CRUD ownership checks (user can only modify their own trips)

### Server — Integration Tests
1. **Auth flow** — Register → login → get `/api/auth/me` → verify user
2. **Trip creation → itinerary generation** — End-to-end with mocked Groq

### Client — Unit Tests
1. **`authStore.ts`** — Login/logout state transitions, localStorage persistence
2. **`api.ts`** — Axios interceptors (token injection, 401 redirect)

### Client — Component Tests
1. **`ProtectedRoute`** — Authenticated vs unauthenticated redirect behavior
2. **`TripCard`** — Renders trip data correctly

## Test Infrastructure Needed
To set up Vitest for integration tests on the server:
```
npm install --save-dev @vitest/coverage-v8 supertest @types/supertest --workspace=server
```

For client component tests:
```
npm install --save-dev @testing-library/react @testing-library/user-event jsdom --workspace=client
```
Add `environment: 'jsdom'` to `vite.config.ts` for client tests.

## CI
No GitHub Actions or CI config file found. No `.github/` directory in the repo.
