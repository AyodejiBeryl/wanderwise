# WanderWise — Directory Structure

## Top-Level
```
wanderwise/
├── client/                  # React SPA (@wanderwise/client)
├── server/                  # Express API (@wanderwise/server)
├── shared/                  # Shared types (@wanderwise/shared)
├── package.json             # Root workspace config + scripts
├── docker-compose.yml       # Local dev Docker (likely PostgreSQL)
├── render.yaml              # Render.com deployment config
├── .planning/               # GSD planning documents (codebase maps, phases)
└── node_modules/            # Hoisted workspace dependencies
```

## Client Structure
```
client/
├── src/
│   ├── main.tsx             # React entry point — mounts App
│   ├── App.tsx              # Router + route definitions + ProtectedRoute
│   ├── vite-env.d.ts        # Vite env type declarations
│   ├── pages/               # Route-level page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TripDetailPage.tsx
│   │   ├── TemplatesPage.tsx
│   │   └── ProfilePage.tsx
│   ├── components/          # Shared UI components
│   │   ├── Layout.tsx       # Page shell (nav + outlet)
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── TripCard.tsx
│   │   ├── TripChat.tsx     # Concierge chat UI
│   │   ├── TripCollaborators.tsx
│   │   └── TripWeather.tsx
│   ├── hooks/               # React Query data hooks
│   │   ├── useTrips.ts
│   │   ├── useItinerary.ts
│   │   ├── useSafety.ts
│   │   └── useSuggestions.ts
│   ├── stores/              # Zustand global state
│   │   └── authStore.ts     # Auth state + actions
│   ├── services/            # HTTP layer
│   │   └── api.ts           # Axios ApiClient singleton
│   ├── utils/               # Utility functions
│   └── styles/              # Global CSS / Tailwind base
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## Server Structure
```
server/
├── src/
│   ├── index.ts             # Express app + middleware + route mounting
│   ├── routes/              # Express router definitions
│   │   ├── auth.routes.ts
│   │   ├── trip.routes.ts
│   │   ├── itinerary.routes.ts
│   │   ├── safety.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── user.routes.ts
│   │   ├── suggestions.routes.ts
│   │   ├── chat.routes.ts
│   │   ├── templates.routes.ts
│   │   ├── collaborator.routes.ts
│   │   └── weather.routes.ts
│   ├── controllers/         # Request handlers (thin — delegate to services)
│   │   ├── auth.controller.ts
│   │   ├── trip.controller.ts
│   │   ├── itinerary.controller.ts
│   │   ├── safety.controller.ts
│   │   ├── collaborator.controller.ts
│   │   ├── suggestions.controller.ts
│   │   ├── chat.controller.ts
│   │   └── weather.controller.ts
│   ├── services/            # Business logic
│   │   ├── ai.service.ts    # All Groq AI generation functions
│   │   ├── email.service.ts # Resend email service
│   │   └── prisma.ts        # Prisma client singleton
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication
│   │   ├── errorHandler.ts  # Global error handler
│   │   └── notFound.ts      # 404 handler
│   ├── data/                # Static data (templates, seeds)
│   └── utils/
│       └── logger.ts        # Winston logger
├── prisma/
│   ├── schema.prisma        # Database schema (source of truth)
│   └── seed.ts              # Database seed script
├── package.json
└── tsconfig.json
```

## Shared Structure
```
shared/
├── types/                   # Shared TypeScript interfaces
│   └── index.ts
├── package.json
└── tsconfig.json
```

## Naming Conventions
- **Files:** `kebab-case.type.ts` — e.g., `auth.controller.ts`, `trip.routes.ts`
- **Components:** PascalCase — e.g., `TripCard.tsx`, `DashboardPage.tsx`
- **Hooks:** `use` prefix camelCase — e.g., `useTrips.ts`, `useItinerary.ts`
- **Stores:** `camelCase` + `Store` suffix — e.g., `authStore.ts`
- **Services:** `camelCase.service.ts`
- **Enums (Prisma):** PascalCase — `TripStatus`, `SafetyLevel`, `ActivityCategory`, `PlanType`
- **DB tables:** snake_case via `@@map()` — e.g., `@@map("trip_collaborators")`
