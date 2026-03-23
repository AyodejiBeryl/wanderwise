# WanderWise — State

## Project Reference

See: `.planning/PROJECT.md` (updated Mar 22, 2026)

**Core value:** Traveler goes from trip idea to complete plan in under 60 seconds.
**Current focus:** Phase 1 — Launch Readiness

## Current Phase

**Phase 1 — Launch Readiness**

- [x] Plan 1-A: JWT fail-fast + env var validation
- [x] Plan 1-B: Stripe SDK + checkout session
- [x] Plan 1-C: Zod validation on AI responses
- [x] Plan 1-D: Type `trip` in chatConciergeWithAI

## Active Decisions

- Fix critical bugs before any new features
- Coarse granularity — 3-5 phases, ship fast
- Parallel execution within phases
- Balanced model profile (Sonnet)

## Codebase Map

Written Mar 22, 2026. See `.planning/codebase/`:
- `STACK.md` — React 18 + Vite / Express + Prisma / Groq / Stripe (broken) / Resend
- `CONCERNS.md` — 17 issues found, 4 critical

## Key Context

- WanderWise is pre-launch, targeting real paying users
- Stripe payment routes exist but SDK not installed — any payment call throws
- JWT_SECRET cast without existence check — silent security vulnerability
- All 5 Groq AI functions parse JSON directly to Prisma without Zod validation
- `chatConciergeWithAI` has `trip: any` parameter

## Session Log

- Mar 22, 2026: Codebase mapped (7 documents), project initialized
- Mar 22, 2026: Phase 1 complete — all 4 critical bugs fixed, TypeScript builds clean
- Next: Add STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY to server .env, smoke-test checkout flow
