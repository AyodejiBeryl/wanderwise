# WanderWise — Coding Conventions

## TypeScript
- Strict mode on both client and server (`tsconfig.json`)
- ESM modules throughout (`"type": "module"` in all package.json files)
- Server imports use `.js` extensions (required for ESM Node.js): `import { errorHandler } from './middleware/errorHandler.js'`
- Shared types imported from `@wanderwise/shared` (workspace alias)
- `as any` used as escape hatch in several places (see CONCERNS.md) — not a convention, a debt item

## Async Patterns
- All controllers and service functions are `async/await`
- Express controllers follow try/catch with `next(error)` for error propagation
- Errors thrown as `ApiError` instances (custom class in `middleware/errorHandler.ts`)
- AI calls wrapped in try/catch with specific 429 rate limit handling

## Error Handling Pattern (server)
```typescript
// Controller pattern — consistent across all controllers
try {
  const result = await someService(data);
  res.json({ success: true, data: result });
} catch (error: any) {
  next(error); // passes to errorHandler middleware
}
```
Global error handler in `server/src/middleware/errorHandler.ts` catches all errors and sends structured JSON responses.

## Environment Variables
- Server: accessed via `process.env.VAR_NAME` with fallbacks (`|| ''` or `|| 'default'`)
- Client: accessed via `import.meta.env.VITE_VAR_NAME` (Vite convention)
- No `.env` files committed — must be set externally

## API Response Shape (server)
Consistent shape across endpoints:
```typescript
{ success: true, data: { ... } }     // success
{ message: "Error description" }      // error (via errorHandler)
```

## Client Data Fetching
- All server state via React Query hooks in `client/src/hooks/`
- Hooks wrap `api.ts` methods and return `{ data, isLoading, error, refetch }` etc.
- Direct `api.*` calls in event handlers (mutations) — not in render

## Component Patterns
- Functional components only (no class components)
- Props typed inline with TypeScript interfaces
- Tailwind for all styling — no inline styles, no CSS modules
- `clsx` + `tailwind-merge` for conditional classes
- `lucide-react` for all icons

## Form Handling
- React Hook Form + Zod for all forms
- Zod schemas defined inline or near the form component
- `@hookform/resolvers/zod` for integration

## Import Organization (client)
- External libraries first, then internal imports
- No enforced import sorting via ESLint (not configured)

## Auth Pattern
- Token read from `localStorage` on every request (via Axios interceptor)
- Protected routes wrapped in `<ProtectedRoute>` component which checks `useAuthStore().isAuthenticated`
- 401 response auto-redirects to `/login` (Axios response interceptor) — except on auth endpoints themselves

## Logging (server)
- Winston logger at `server/src/utils/logger.ts`
- Used via `logger.info()`, `logger.error()`, `logger.warn()`
- HTTP request logging via Morgan middleware
