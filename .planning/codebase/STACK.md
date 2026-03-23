# WanderWise — Tech Stack

## Runtime & Languages
- **Node.js** ≥18.0.0 (required), **npm** ≥9.0.0
- **TypeScript** 5.3.3 across all workspaces (strict mode, ESM modules)
- Monorepo with npm workspaces: `client`, `server`, `shared`

## Client (`@wanderwise/client`)
- **React** 18.2 + **Vite** 5.0 (build tool, dev server)
- **TypeScript** with `tsc` pre-build check
- **React Router** v6 (client-side routing)
- **Zustand** 4.4 (global state — single store: `authStore.ts`)
- **React Query** v3 (server state / data fetching via hooks)
- **React Hook Form** + **Zod** (form validation)
- **Tailwind CSS** 3.4 + **PostCSS** + **Autoprefixer**
- **lucide-react** (icon library)
- **axios** (HTTP client, wrapped in `ApiClient` class at `client/src/services/api.ts`)
- **date-fns** (date formatting)
- **jsPDF** 4.2 (PDF export)
- **clsx** + **tailwind-merge** (conditional class utilities)
- **Vitest** (unit tests)
- **ESLint** with TypeScript + React Hooks plugins

## Server (`@wanderwise/server`)
- **Express** 4.18 (HTTP framework)
- **Prisma** 5.8 (ORM + migrations)
- **PostgreSQL** (database, via `DATABASE_URL` + `DIRECT_URL` env vars — Supabase-compatible dual URL pattern)
- **bcryptjs** (password hashing)
- **jsonwebtoken** (JWT auth, 7-day expiry)
- **Zod** (request validation)
- **groq-sdk** 0.37 (AI — `llama-3.3-70b-versatile` model)
- **resend** 6.9 (transactional email)
- **helmet** (security headers)
- **cors** (configurable origin allowlist via `CLIENT_URL` env)
- **express-rate-limit** (rate limiting)
- **express-validator** (additional validation)
- **morgan** (HTTP logging)
- **winston** (application logging)
- **tsx** (TypeScript execution for dev with `watch` mode)
- **Vitest** (unit tests)

## Shared (`@wanderwise/shared`)
- TypeScript types and constants only
- `shared/types/` — shared type definitions
- `shared/tsconfig.json` — extended by client/server

## Build & Tooling
- **Husky** (pre-commit hooks)
- **Prettier** (code formatting — all workspaces)
- **concurrently** (run client + server dev together: `npm run dev`)
- Production: `tsc && vite build` (client), `prisma generate && tsc` (server)
- `server/src/index.ts` serves client `dist/` as static in production (same-origin SPA pattern)

## Environment Variables (server)
- `DATABASE_URL` — Prisma primary connection
- `DIRECT_URL` — Prisma direct connection (Supabase pgBouncer pattern)
- `JWT_SECRET` — JWT signing key
- `GROQ_API_KEY` — Groq AI service
- `RESEND_API_KEY` — Email (optional — skips email if not set)
- `CLIENT_URL` — CORS allowlist (comma-separated for multiple origins)
- `PORT` — Server port (default: 3000)
- `NODE_ENV` — Environment flag

## Environment Variables (client)
- `VITE_API_URL` — API base URL (defaults to `/api` for same-origin production)
