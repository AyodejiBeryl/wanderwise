# WanderWise — Roadmap

## Phase 1: Launch Readiness ← CURRENT

**Goal:** Fix the 4 critical bugs before real users hit them.
**Status:** Not started

### Plans

| Plan | Description | Depends On |
|---|---|---|
| 1-A | JWT fail-fast + env var validation on startup | — |
| 1-B | Install Stripe SDK + implement checkout session | 1-A (needs STRIPE_SECRET_KEY in fail-fast) |
| 1-C | Zod schemas for all 5 AI response shapes | — |
| 1-D | Type `trip` parameter in `chatConciergeWithAI` | — |

Plans 1-A, 1-C, and 1-D are independent and can run in parallel.
Plan 1-B depends on 1-A (Stripe key added to startup check).

**Phase complete when:** All 4 plans done, server starts cleanly, `npm run build` passes with no type errors, manual smoke test of checkout flow succeeds.

---

## Phase 2: Hardening

**Goal:** Close the gaps that would frustrate or lose users in the first weeks after launch.

| Plan | Description |
|---|---|
| 2-A | Token refresh — silent session extension, no hard redirect on expiry |
| 2-B | Per-user AI rate limiting (3 generations/hour per user) |
| 2-C | Resend custom domain — replace `onboarding@resend.dev` with verified domain |
| 2-D | Collaborator invite emails — send Resend email when collaborator added |
| 2-E | Chat history persistence — `ChatMessage` Prisma model, history survives refresh |

---

## Phase 3: Quality

**Goal:** Make the codebase safe to grow.

| Plan | Description |
|---|---|
| 3-A | Test suite foundation — Vitest unit tests for auth, AI service, trip controller |
| 3-B | GitHub Actions CI — lint + type-check + tests on every PR |
| 3-C | Pagination on trip listing — cursor-based, handles growing trip collections |
| 3-D | Remove remaining `as any` coercions in controllers |
