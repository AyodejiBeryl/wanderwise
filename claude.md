# WanderWise - Complete Project Documentation

**Last Updated:** February 5, 2026  
**Project Type:** Full-Stack Travel Planning SaaS  
**Status:** Development Environment Ready - Feature Implementation Phase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Business Context](#business-context)
3. [Technical Architecture](#technical-architecture)
4. [Development Environment Setup](#development-environment-setup)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Frontend Architecture](#frontend-architecture)
9. [Backend Architecture](#backend-architecture)
10. [Implementation Roadmap](#implementation-roadmap)
11. [Code Examples](#code-examples)
12. [Development Workflow](#development-workflow)
13. [Common Tasks](#common-tasks)
14. [Troubleshooting](#troubleshooting)
15. [Deployment Guide](#deployment-guide)

---

## Project Overview

### What is WanderWise?

WanderWise is an AI-powered travel planning SaaS platform that generates personalized itineraries with a **safety-first approach** for diverse travelers. Unlike generic travel planners, WanderWise addresses the unique safety and hospitality concerns faced by:

- LGBTQ+ travelers
- Solo female travelers
- Travelers with accessibility needs
- Religious minorities
- People from various backgrounds traveling to foreign countries

### Key Features

1. **AI-Generated Itineraries**
   - Day-by-day travel plans optimized for budget and preferences
   - Activity recommendations with timing and cost estimates
   - Route optimization and scheduling

2. **Safety-First Reports**
   - Personalized safety assessments based on user profile
   - Location-specific safety considerations
   - Resources and emergency contacts
   - Cultural sensitivity tips

3. **Budget Management**
   - Cost tracking per activity
   - Budget optimization
   - Currency conversion

4. **User Profiles**
   - Safety preference profiles
   - Travel style preferences
   - Dietary restrictions
   - Language barriers

### Technology Transition

**From:** Bubble.io no-code platform  
**To:** Full-stack coded solution (React + Node.js + PostgreSQL)

**Reasons for Transition:**
- Greater control over features and UI/UX
- Better performance and scalability
- Advanced AI integration capabilities
- Custom backend logic for complex workflows
- Professional deployment options
- Cost efficiency at scale

---

## Business Context

### Market Research Findings

From initial survey (8 respondents):
- **87%** have never used AI for travel planning
- **75%** willing to beta test
- **50%** struggle with budget management
- **50%** find booking activities challenging
- **50%** have difficulty creating day-by-day plans

### Critical Gap Identified

Existing AI travel tools don't adequately address safety and hospitality concerns that travelers from various backgrounds face when visiting foreign countries. WanderWise fills this gap.

### Pricing Strategy

**Per-Trip Model:**
- Basic: $8 per trip
- Standard: $15 per trip
- Premium: $25 per trip

**Monthly Subscription:**
- Unlimited trips
- $29-49/month

### Target Audience

Primary:
- Safety-conscious travelers
- First-time international travelers
- Solo travelers
- Minority groups traveling internationally

Secondary:
- Budget-conscious travelers
- Time-constrained professionals
- Families planning international trips

---

## Technical Architecture

### Technology Stack

#### Frontend
```
React 18.2.0          - UI framework
TypeScript 5.3.3      - Type safety
Vite 5.0.11           - Build tool & dev server
React Router 6.21.1   - Client-side routing
React Query 3.39.3    - Server state management
Zustand 4.4.7         - Client state management
Tailwind CSS 3.4.1    - Styling
React Hook Form 7.49.3 - Form handling
Zod 3.22.4            - Schema validation
Axios 1.6.5           - HTTP client
Lucide React 0.303.0  - Icons
```

#### Backend
```
Node.js 18+           - Runtime
Express 4.18.2        - Web framework
TypeScript 5.3.3      - Type safety
Prisma 5.8.1          - ORM
PostgreSQL            - Database
JWT                   - Authentication
Bcrypt                - Password hashing
Winston 3.11.0        - Logging
Helmet 7.1.0          - Security headers
CORS 2.8.5            - Cross-origin requests
Express Rate Limit    - Rate limiting
OpenAI 4.24.1         - AI integration
Stripe 14.12.0        - Payments
```

#### Development Tools
```
Docker                - Containerization
Docker Compose        - Multi-container apps
Prettier              - Code formatting
ESLint                - Linting
Husky                 - Git hooks
Concurrently          - Parallel scripts
tsx                   - TypeScript execution
```

### Architecture Patterns

**Monorepo Structure:**
- Single repository with multiple packages
- Shared types between frontend and backend
- Centralized dependency management
- Workspace-based organization

**API Design:**
- RESTful endpoints
- JWT-based authentication
- Structured error responses
- Consistent response format

**Database Design:**
- Normalized relational schema
- Cascading deletes for data integrity
- Enums for constrained values
- Proper indexing for performance

**Security:**
- JWT tokens with expiration
- Bcrypt password hashing
- Rate limiting on endpoints
- Helmet security headers
- CORS protection
- Input validation with Zod

---

## Development Environment Setup

### Prerequisites

**Required:**
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL 15+
- Git

**API Keys Needed:**
- OpenAI API key (for AI features)
- Stripe keys (for payments)
- Google Places API key (optional, for location features)

### Quick Setup (5 Minutes)

```bash
# 1. Navigate to project
cd wanderwise

# 2. Install all dependencies
npm install

# 3. Create PostgreSQL database
createdb wanderwise
# Or: psql -U postgres -c "CREATE DATABASE wanderwise;"

# 4. Setup server environment
cd server
cp .env.example .env
# Edit .env with your configuration

# 5. Setup client environment
cd ../client
cp .env.example .env
# Edit .env with your configuration

# 6. Run database migrations
cd ../server
npm run db:generate
npm run db:migrate

# 7. Start development servers
cd ..
npm run dev
```

### Environment Variables

#### Server (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/wanderwise?schema=public"

# Server
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Google Places API (Optional)
GOOGLE_PLACES_API_KEY=your-google-places-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Client (.env)
```env
# API
VITE_API_URL=http://localhost:3000/api

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Google Maps (Optional)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Docker Setup (Alternative)

```bash
# Start all services with Docker
docker-compose up

# Services will be available at:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:3000
# - Database: localhost:5432
```

### Verifying Setup

```bash
# Check frontend
curl http://localhost:5173

# Check backend health
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}

# Check database
cd server
npm run db:studio
# Opens Prisma Studio GUI at http://localhost:5555
```

---

## Project Structure

### Complete Directory Tree

```
wanderwise/
│
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Layout.tsx           # Main layout wrapper
│   │   │   ├── Navbar.tsx           # Navigation bar
│   │   │   └── ProtectedRoute.tsx   # Auth route guard
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── LandingPage.tsx      # Public landing page
│   │   │   ├── LoginPage.tsx        # Login form
│   │   │   ├── RegisterPage.tsx     # Registration form
│   │   │   ├── DashboardPage.tsx    # User dashboard
│   │   │   ├── OnboardingPage.tsx   # Trip creation wizard
│   │   │   ├── TripDetailPage.tsx   # Trip details view
│   │   │   └── ProfilePage.tsx      # User profile
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   # To be created
│   │   │
│   │   ├── services/                # API service functions
│   │   │   └── api.ts               # Axios API client
│   │   │
│   │   ├── utils/                   # Utility functions
│   │   │   # To be created
│   │   │
│   │   ├── assets/                  # Static assets
│   │   │   # Images, fonts, etc.
│   │   │
│   │   ├── styles/                  # Global styles
│   │   │   └── index.css            # Tailwind + custom CSS
│   │   │
│   │   ├── App.tsx                  # Main app component
│   │   └── main.tsx                 # Entry point
│   │
│   ├── public/                      # Static public files
│   │   # Favicon, robots.txt, etc.
│   │
│   ├── .env.example                 # Environment template
│   ├── index.html                   # HTML template
│   ├── package.json                 # Dependencies
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── tsconfig.json                # TypeScript config
│   ├── tsconfig.node.json           # Node TypeScript config
│   └── vite.config.ts               # Vite configuration
│
├── server/                          # Backend Node.js application
│   ├── src/
│   │   ├── controllers/             # Request handlers
│   │   │   # To be implemented
│   │   │
│   │   ├── models/                  # Business logic models
│   │   │   # To be implemented
│   │   │
│   │   ├── routes/                  # API route definitions
│   │   │   ├── auth.routes.ts       # Auth endpoints
│   │   │   ├── trip.routes.ts       # Trip CRUD
│   │   │   ├── itinerary.routes.ts  # Itinerary generation
│   │   │   ├── safety.routes.ts     # Safety reports
│   │   │   ├── payment.routes.ts    # Stripe integration
│   │   │   └── user.routes.ts       # User management
│   │   │
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.ts              # JWT authentication
│   │   │   ├── errorHandler.ts      # Error handling
│   │   │   └── notFound.ts          # 404 handler
│   │   │
│   │   ├── services/                # Business logic services
│   │   │   # To be implemented
│   │   │   # - aiService.ts         # OpenAI integration
│   │   │   # - stripeService.ts     # Payment processing
│   │   │   # - emailService.ts      # Email notifications
│   │   │
│   │   ├── config/                  # Configuration files
│   │   │   # To be created
│   │   │
│   │   ├── utils/                   # Utility functions
│   │   │   └── logger.ts            # Winston logger
│   │   │
│   │   └── index.ts                 # Server entry point
│   │
│   ├── prisma/                      # Prisma ORM
│   │   ├── schema.prisma            # Database schema
│   │   └── seed.ts                  # Database seeding
│   │       # To be created
│   │
│   ├── tests/                       # Test files
│   │   # To be created
│   │
│   ├── logs/                        # Log files (git ignored)
│   │
│   ├── .env.example                 # Environment template
│   ├── package.json                 # Dependencies
│   └── tsconfig.json                # TypeScript config
│
├── shared/                          # Shared code between client/server
│   ├── types/                       # TypeScript type definitions
│   │   └── index.ts                 # All shared types
│   │
│   ├── constants/                   # Shared constants
│   │   # To be created
│   │
│   ├── package.json                 # Dependencies
│   └── tsconfig.json                # TypeScript config
│
├── .gitignore                       # Git ignore rules
├── docker-compose.yml               # Docker services
├── package.json                     # Root workspace config
├── README.md                        # Project README
├── QUICKSTART.md                    # Quick start guide
├── PROJECT_SUMMARY.md               # Project summary
└── claude.md                        # This file - complete documentation
```

### File Count Summary

- **Total Files:** 40+ configuration and source files
- **React Components:** 10 (7 pages + 3 layout components)
- **API Routes:** 6 modules
- **Middleware:** 3 files
- **Configuration Files:** 12+ (package.json, tsconfig, etc.)

---

## Database Schema

### Complete Prisma Schema

The database uses **PostgreSQL** with **Prisma ORM**. Here's the complete schema:

#### Core Entities

**1. User**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  firstName     String?
  lastName      String?
  phone         String?
  profileImage  String?
  
  // Relationships
  safetyProfile SafetyProfile?
  trips         Trip[]
  payments      Payment[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@map("users")
}
```

**Purpose:** User accounts and authentication  
**Key Fields:**
- `id`: Unique identifier (CUID)
- `email`: Unique email for login
- `password`: Bcrypt hashed password
- `safetyProfile`: One-to-one relationship with safety preferences

**2. SafetyProfile**
```prisma
model SafetyProfile {
  id                    String   @id @default(cuid())
  userId                String   @unique
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Safety concerns
  isLGBTQ               Boolean  @default(false)
  isSoloFemale          Boolean  @default(false)
  hasAccessibilityNeeds Boolean  @default(false)
  religiousMinority     Boolean  @default(false)
  dietaryRestrictions   String[]
  languageBarriers      String[]
  
  // Travel preferences
  preferredBudgetLevel  String?
  travelStyle           String?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@map("safety_profiles")
}
```

**Purpose:** User's safety concerns and travel preferences  
**Key Fields:**
- Boolean flags for specific safety concerns
- Array fields for dietary restrictions and language barriers
- Cascade delete when user is deleted

**3. Trip**
```prisma
model Trip {
  id                String      @id @default(cuid())
  userId            String
  user              User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Trip details
  destination       String
  country           String
  city              String?
  startDate         DateTime
  endDate           DateTime
  budget            Float
  currency          String      @default("USD")
  numberOfTravelers Int         @default(1)
  
  // Status
  status            TripStatus  @default(DRAFT)
  
  // AI-generated content
  itinerary         Itinerary?
  safetyReport      SafetyReport?
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  
  @@map("trips")
}

enum TripStatus {
  DRAFT
  PLANNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

**Purpose:** Trip metadata and status  
**Key Fields:**
- Date range and destination
- Budget and currency
- Status tracking through lifecycle
- One-to-one with Itinerary and SafetyReport

**4. Itinerary**
```prisma
model Itinerary {
  id              String      @id @default(cuid())
  tripId          String      @unique
  trip            Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  // Itinerary content
  days            Day[]
  
  // AI generation metadata
  aiModel         String?
  generatedAt     DateTime    @default(now())
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@map("itineraries")
}
```

**Purpose:** Container for AI-generated trip plans  
**Key Fields:**
- `days`: One-to-many relationship with Day entities
- `aiModel`: Track which AI model generated the itinerary
- `generatedAt`: Timestamp of generation

**5. Day**
```prisma
model Day {
  id              String      @id @default(cuid())
  itineraryId     String
  itinerary       Itinerary   @relation(fields: [itineraryId], references: [id], onDelete: Cascade)
  
  dayNumber       Int
  date            DateTime
  theme           String?     // e.g., "Temple Hopping", "Beach Day"
  
  // Activities for this day
  activities      Activity[]
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@unique([itineraryId, dayNumber])
  @@map("days")
}
```

**Purpose:** Individual day in itinerary  
**Key Fields:**
- `dayNumber`: Sequential day number
- `theme`: Optional theme for the day
- `activities`: One-to-many with Activity
- Unique constraint on `itineraryId + dayNumber`

**6. Activity**
```prisma
model Activity {
  id              String          @id @default(cuid())
  dayId           String
  day             Day             @relation(fields: [dayId], references: [id], onDelete: Cascade)
  
  // Activity details
  name            String
  description     String?
  category        ActivityCategory
  location        String
  address         String?
  latitude        Float?
  longitude       Float?
  
  // Timing
  startTime       String?         // e.g., "9:00 AM"
  duration        Int?            // in minutes
  
  // Cost
  estimatedCost   Float?
  currency        String          @default("USD")
  
  // Booking info
  bookingUrl      String?
  requiresBooking Boolean         @default(false)
  
  // Order in the day
  order           Int
  
  // Safety notes
  safetyNotes     String?
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@map("activities")
}

enum ActivityCategory {
  DINING
  SIGHTSEEING
  ADVENTURE
  CULTURAL
  ENTERTAINMENT
  SHOPPING
  RELAXATION
  NIGHTLIFE
}
```

**Purpose:** Specific activities in the itinerary  
**Key Fields:**
- Categorized activities with location data
- Optional geolocation for maps
- Cost tracking
- Booking information
- `order`: Sequence within the day

**7. SafetyReport**
```prisma
model SafetyReport {
  id              String          @id @default(cuid())
  tripId          String          @unique
  trip            Trip            @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  // Overall safety assessment
  overallLevel    SafetyLevel
  summary         String
  
  // Detailed safety information
  sections        SafetySection[]
  
  // AI generation metadata
  aiModel         String?
  generatedAt     DateTime        @default(now())
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@map("safety_reports")
}

enum SafetyLevel {
  LOW
  MODERATE
  HIGH
  CRITICAL
}
```

**Purpose:** AI-generated safety assessment  
**Key Fields:**
- `overallLevel`: Summary safety level
- `sections`: One-to-many with detailed sections
- Tracks AI model and generation time

**8. SafetySection**
```prisma
model SafetySection {
  id              String          @id @default(cuid())
  safetyReportId  String
  safetyReport    SafetyReport    @relation(fields: [safetyReportId], references: [id], onDelete: Cascade)
  
  title           String          // e.g., "LGBTQ+ Considerations"
  level           SafetyLevel
  content         String
  tips            String[]
  resources       String[]        // URLs or contact info
  
  order           Int
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@map("safety_sections")
}
```

**Purpose:** Detailed safety information by category  
**Key Fields:**
- `title`: Section topic (e.g., "Solo Female Travel")
- `tips`: Array of actionable tips
- `resources`: Emergency contacts, websites
- `order`: Display sequence

**9. Payment**
```prisma
model Payment {
  id              String          @id @default(cuid())
  userId          String
  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Payment details
  amount          Float
  currency        String          @default("USD")
  planType        PlanType
  
  // Stripe integration
  stripePaymentId String?
  stripeCustomerId String?
  
  // Status
  status          String          // succeeded, pending, failed
  
  // Metadata
  metadata        Json?
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@map("payments")
}

enum PlanType {
  PER_TRIP
  MONTHLY_SUBSCRIPTION
}
```

**Purpose:** Payment transaction records  
**Key Fields:**
- Stripe integration fields
- Payment status tracking
- Flexible metadata JSON field

### Database Relationships

```
User (1) ──────── (1) SafetyProfile
  │
  ├── (1:Many) ──── Trip
  │                   │
  │                   ├── (1:1) ──── Itinerary
  │                   │               │
  │                   │               └── (1:Many) ──── Day
  │                   │                                 │
  │                   │                                 └── (1:Many) ──── Activity
  │                   │
  │                   └── (1:1) ──── SafetyReport
  │                                   │
  │                                   └── (1:Many) ──── SafetySection
  │
  └── (1:Many) ──── Payment
```

### Database Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Create a new migration
npm run db:migrate

# Push schema changes without migration (dev only)
npm run db:push

# Open Prisma Studio (GUI)
npm run db:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### Endpoints

#### Authentication Routes

**POST /api/auth/register**
```typescript
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**POST /api/auth/login**
```typescript
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Response
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**GET /api/auth/me** (Protected)
```typescript
// Headers
Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**POST /api/auth/logout** (Protected)
```typescript
// Response
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Trip Routes (All Protected)

**GET /api/trips**
```typescript
// Get all trips for authenticated user
// Response
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": "clxxx...",
        "destination": "Tokyo, Japan",
        "startDate": "2026-06-01T00:00:00.000Z",
        "endDate": "2026-06-10T00:00:00.000Z",
        "budget": 3000,
        "status": "PLANNED"
      }
    ]
  }
}
```

**POST /api/trips**
```typescript
// Request
{
  "destination": "Tokyo, Japan",
  "country": "Japan",
  "city": "Tokyo",
  "startDate": "2026-06-01",
  "endDate": "2026-06-10",
  "budget": 3000,
  "currency": "USD",
  "numberOfTravelers": 2
}

// Response
{
  "success": true,
  "data": {
    "trip": {
      "id": "clxxx...",
      "destination": "Tokyo, Japan",
      "status": "DRAFT",
      ...
    }
  }
}
```

**GET /api/trips/:id**
```typescript
// Get single trip with full details
// Response includes itinerary and safety report if available
{
  "success": true,
  "data": {
    "trip": {
      "id": "clxxx...",
      "destination": "Tokyo, Japan",
      "itinerary": { ... },
      "safetyReport": { ... }
    }
  }
}
```

**PATCH /api/trips/:id**
```typescript
// Request - update any trip field
{
  "budget": 3500,
  "status": "PLANNED"
}

// Response
{
  "success": true,
  "data": {
    "trip": { ... }
  }
}
```

**DELETE /api/trips/:id**
```typescript
// Response
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

#### Itinerary Routes (Protected)

**POST /api/itineraries/generate**
```typescript
// Request
{
  "tripId": "clxxx...",
  "preferences": {
    "activities": ["CULTURAL", "DINING", "SIGHTSEEING"],
    "pacePreference": "moderate",
    "includeDowntime": true
  }
}

// Response
{
  "success": true,
  "data": {
    "itinerary": {
      "id": "clxxx...",
      "tripId": "clxxx...",
      "days": [
        {
          "dayNumber": 1,
          "date": "2026-06-01",
          "theme": "Arrival & Tokyo Exploration",
          "activities": [
            {
              "name": "Visit Senso-ji Temple",
              "category": "CULTURAL",
              "startTime": "10:00 AM",
              "duration": 120,
              "estimatedCost": 0,
              "location": "Asakusa, Tokyo"
            }
          ]
        }
      ]
    }
  }
}
```

**GET /api/itineraries/:tripId**
```typescript
// Get existing itinerary for a trip
// Response same as generate
```

#### Safety Routes (Protected)

**POST /api/safety/generate**
```typescript
// Request
{
  "tripId": "clxxx...",
  "safetyProfileId": "clxxx..." // Optional, uses user's profile if not provided
}

// Response
{
  "success": true,
  "data": {
    "safetyReport": {
      "id": "clxxx...",
      "tripId": "clxxx...",
      "overallLevel": "MODERATE",
      "summary": "Tokyo is generally very safe for international travelers...",
      "sections": [
        {
          "title": "LGBTQ+ Considerations",
          "level": "MODERATE",
          "content": "Japan has made progress...",
          "tips": [
            "PDA is generally not common in Japanese culture",
            "Tokyo has several LGBTQ+ friendly districts"
          ],
          "resources": [
            "https://tokyolgbtq.com",
            "Embassy contact: +81-..."
          ]
        }
      ]
    }
  }
}
```

**GET /api/safety/:tripId**
```typescript
// Get existing safety report for a trip
```

#### Payment Routes

**POST /api/payments/create-checkout** (Protected)
```typescript
// Request
{
  "planType": "PER_TRIP",
  "tripId": "clxxx..." // Required for PER_TRIP
}

// Response
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/pay/cs_test_..."
  }
}
```

**POST /api/payments/webhook**
```typescript
// Stripe webhook endpoint
// Handles payment confirmation events
// No authentication required (verified by Stripe signature)
```

#### User Routes (Protected)

**GET /api/users/profile**
```typescript
// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "safetyProfile": {
        "isLGBTQ": true,
        "isSoloFemale": false,
        ...
      }
    }
  }
}
```

**PATCH /api/users/profile**
```typescript
// Request
{
  "firstName": "Jane",
  "phone": "+1-555-0123"
}

// Response
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

**POST /api/users/safety-profile**
```typescript
// Request
{
  "isLGBTQ": true,
  "isSoloFemale": true,
  "dietaryRestrictions": ["vegetarian", "gluten-free"],
  "preferredBudgetLevel": "moderate"
}

// Response
{
  "success": true,
  "data": {
    "safetyProfile": { ... }
  }
}
```

### Error Codes

```
200 - OK
201 - Created
400 - Bad Request (validation error)
401 - Unauthorized (missing or invalid token)
403 - Forbidden (insufficient permissions)
404 - Not Found
429 - Too Many Requests (rate limit exceeded)
500 - Internal Server Error
```

---

## Frontend Architecture

### Component Structure

#### Pages
1. **LandingPage** - Public marketing page
   - Hero section with CTA
   - Feature highlights
   - Pricing preview

2. **LoginPage** - User authentication
   - Email/password form
   - Link to registration
   - "Forgot password" flow

3. **RegisterPage** - New user signup
   - User details form
   - Email verification
   - Redirect to onboarding

4. **DashboardPage** - User's trip overview
   - Trip list/grid
   - Quick stats
   - Create new trip button

5. **OnboardingPage** - Trip creation wizard
   - Multi-step form
   - Destination selection
   - Date picker
   - Budget input
   - Traveler preferences

6. **TripDetailPage** - Individual trip view
   - Itinerary display
   - Safety report
   - Edit capabilities
   - Payment status

7. **ProfilePage** - User settings
   - Personal information
   - Safety profile
   - Payment history
   - Subscription management

#### Reusable Components (To Build)

```typescript
// Form Components
<Input />
<Select />
<DatePicker />
<Checkbox />
<Radio />

// Display Components
<Card />
<Badge />
<Avatar />
<Spinner />
<Alert />

// Layout Components
<Modal />
<Drawer />
<Tabs />
<Accordion />

// Trip-Specific Components
<TripCard />
<ItineraryDay />
<ActivityCard />
<SafetyAlert />
<BudgetTracker />
```

### State Management

#### Zustand Stores (To Implement)

```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

// tripStore.ts
interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  fetchTrips: () => Promise<void>;
  createTrip: (data: CreateTripData) => Promise<Trip>;
  updateTrip: (id: string, data: Partial<Trip>) => Promise<Trip>;
  deleteTrip: (id: string) => Promise<void>;
}

// uiStore.ts
interface UIState {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
```

### React Query Hooks (To Implement)

```typescript
// useAuth.ts
export const useLogin = () => {
  return useMutation((credentials) => api.login(credentials));
};

// useTrips.ts
export const useTrips = () => {
  return useQuery('trips', () => api.getTrips());
};

export const useTrip = (id: string) => {
  return useQuery(['trip', id], () => api.getTrip(id));
};

export const useCreateTrip = () => {
  return useMutation((data) => api.createTrip(data));
};

// useItinerary.ts
export const useGenerateItinerary = () => {
  return useMutation((data) => api.generateItinerary(data));
};
```

### Routing Structure

```typescript
// App.tsx
<Routes>
  {/* Public routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    <Route element={<Layout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/trips/:id" element={<TripDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
  </Route>

  {/* 404 */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### Styling Conventions

**Tailwind Classes:**
```css
/* Buttons */
.btn-primary    - Primary action button
.btn-secondary  - Secondary action button

/* Inputs */
.input-field    - Standard text input

/* Cards */
.card           - Content card with shadow

/* Colors */
primary-50 through primary-900
secondary-50 through secondary-900
```

**Custom Components:**
- Use Tailwind utility classes
- Extract repeated patterns to component classes
- Keep inline styles minimal
- Use CSS modules for complex components

---

## Backend Architecture

### Project Organization

```
server/src/
├── controllers/     # Handle HTTP requests/responses
├── services/        # Business logic
├── models/          # Data access layer (if needed beyond Prisma)
├── routes/          # Route definitions
├── middleware/      # Express middleware
├── utils/           # Utility functions
└── config/          # Configuration
```

### Controller Pattern

```typescript
// controllers/trip.controller.ts
export const createTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const tripData = req.body;
    
    // Validation
    const validatedData = createTripSchema.parse(tripData);
    
    // Business logic
    const trip = await tripService.createTrip(userId, validatedData);
    
    // Response
    res.status(201).json({
      success: true,
      data: { trip }
    });
  } catch (error) {
    next(error);
  }
};
```

### Service Pattern

```typescript
// services/trip.service.ts
export class TripService {
  async createTrip(userId: string, data: CreateTripData): Promise<Trip> {
    // Create trip in database
    const trip = await prisma.trip.create({
      data: {
        userId,
        ...data,
        status: 'DRAFT'
      }
    });
    
    return trip;
  }
  
  async getUserTrips(userId: string): Promise<Trip[]> {
    return prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const tripService = new TripService();
```

### AI Service (To Implement)

```typescript
// services/ai.service.ts
import OpenAI from 'openai';

export class AIService {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async generateItinerary(trip: Trip, preferences?: any): Promise<ItineraryData> {
    const prompt = this.buildItineraryPrompt(trip, preferences);
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are an expert travel planner...' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });
    
    // Parse and structure the response
    const itineraryData = JSON.parse(response.choices[0].message.content);
    
    return itineraryData;
  }
  
  async generateSafetyReport(trip: Trip, safetyProfile?: SafetyProfile): Promise<SafetyReportData> {
    // Similar pattern for safety report generation
  }
  
  private buildItineraryPrompt(trip: Trip, preferences?: any): string {
    return `
      Generate a detailed ${this.calculateDays(trip)} day itinerary for:
      Destination: ${trip.destination}
      Budget: $${trip.budget} ${trip.currency}
      Travelers: ${trip.numberOfTravelers}
      Dates: ${trip.startDate} to ${trip.endDate}
      
      Preferences: ${JSON.stringify(preferences)}
      
      Include:
      - Day-by-day activities with times
      - Cost estimates for each activity
      - Location details
      - Safety considerations
      
      Return as JSON with structure:
      {
        "days": [
          {
            "dayNumber": 1,
            "theme": "...",
            "activities": [...]
          }
        ]
      }
    `;
  }
}

export const aiService = new AIService();
```

### Stripe Service (To Implement)

```typescript
// services/stripe.service.ts
import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;
  
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16'
    });
  }
  
  async createCheckoutSession(userId: string, planType: PlanType, tripId?: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planType === 'PER_TRIP' ? 'Trip Plan' : 'Monthly Subscription',
            },
            unit_amount: this.getPriceAmount(planType),
          },
          quantity: 1,
        },
      ],
      mode: planType === 'PER_TRIP' ? 'payment' : 'subscription',
      success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      client_reference_id: userId,
      metadata: {
        userId,
        planType,
        tripId: tripId || '',
      },
    });
    
    return session;
  }
  
  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
      // Handle other events
    }
  }
  
  private getPriceAmount(planType: PlanType): number {
    return planType === 'PER_TRIP' ? 1500 : 2900; // cents
  }
}

export const stripeService = new StripeService();
```

### Error Handling

```typescript
// middleware/errorHandler.ts

// Custom error class
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';
  
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path
  });
  
  // Send response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Usage in controllers
throw new ApiError(404, 'Trip not found');
```

### Validation with Zod

```typescript
// utils/validation.ts
import { z } from 'zod';

export const createTripSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  budget: z.number().positive('Budget must be positive'),
  currency: z.string().length(3).default('USD'),
  numberOfTravelers: z.number().int().positive().default(1)
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  { message: 'End date must be after start date' }
);

// Usage in controller
const validatedData = createTripSchema.parse(req.body);
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)

**Days 1-2: Authentication**
- [ ] Implement user registration
  - Hash passwords with bcrypt
  - Generate JWT tokens
  - Store in database
- [ ] Implement login
  - Verify credentials
  - Return JWT token
- [ ] Build login/register forms
  - Form validation
  - Error handling
  - Loading states

**Days 3-4: Trip Management**
- [ ] Implement trip CRUD operations
  - Create trip controller
  - Database operations
  - Input validation
- [ ] Build trip creation form
  - Multi-step wizard
  - Date picker integration
  - Budget calculator
- [ ] Build trip dashboard
  - Display user's trips
  - Trip cards with status
  - Filter and sort

**Days 5-7: User Profile**
- [ ] Implement user profile endpoints
  - Get/update user data
  - Safety profile management
- [ ] Build profile page
  - Personal info form
  - Safety preferences
  - Avatar upload

### Phase 2: AI Integration (Week 2)

**Days 1-3: Itinerary Generation**
- [ ] Implement OpenAI integration
  - Set up OpenAI client
  - Design prompt engineering
  - Parse AI responses
- [ ] Create itinerary service
  - Generate structured itineraries
  - Store in database
  - Handle errors
- [ ] Build itinerary display
  - Day-by-day view
  - Activity cards
  - Timeline view
  - Map integration (optional)

**Days 4-5: Safety Reports**
- [ ] Implement safety report generation
  - Personalized prompts based on user profile
  - Structure safety data
  - Store reports
- [ ] Build safety report display
  - Safety level indicators
  - Sectioned information
  - Resource links
  - Downloadable PDF (optional)

**Days 6-7: AI Optimization**
- [ ] Improve prompt engineering
  - Test different models
  - Optimize token usage
  - Cache common responses
- [ ] Add regeneration features
  - Allow users to regenerate itineraries
  - Preference adjustments
  - Feedback loop

### Phase 3: Payments (Week 3)

**Days 1-2: Stripe Integration**
- [ ] Set up Stripe
  - Configure products and prices
  - Set up webhook endpoint
  - Test with test keys
- [ ] Implement checkout flow
  - Create checkout sessions
  - Handle success/cancel
  - Store payment records

**Days 3-4: Payment UI**
- [ ] Build pricing page
  - Plan comparison
  - Feature lists
  - CTA buttons
- [ ] Build payment flow
  - Redirect to Stripe
  - Success confirmation
  - Email receipts

**Days 5-7: Subscription Management**
- [ ] Implement subscription logic
  - Track active subscriptions
  - Usage limits
  - Renewal handling
- [ ] Build subscription UI
  - Current plan display
  - Upgrade/downgrade
  - Cancel subscription
  - Payment history

### Phase 4: Polish & Features (Week 4)

**Days 1-2: UX Improvements**
- [ ] Add loading states
- [ ] Add empty states
- [ ] Improve error messages
- [ ] Add success notifications
- [ ] Mobile responsiveness

**Days 3-4: Additional Features**
- [ ] Trip sharing (optional)
- [ ] Export itinerary (PDF)
- [ ] Email notifications
- [ ] Activity booking links
- [ ] Budget tracking

**Days 5-7: Testing & Bug Fixes**
- [ ] Write unit tests
- [ ] Integration tests
- [ ] End-to-end tests
- [ ] Fix bugs
- [ ] Performance optimization

---

## Code Examples

### Authentication Implementation

#### Backend: Auth Controller

```typescript
// server/src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      throw new ApiError(400, 'Email already registered');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.status(201).json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};
```

#### Frontend: Login Form

```typescript
// client/src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await api.login(data.email, data.password);
      
      // Store token
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to WanderWise</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className="input-field"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="input-field"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-primary-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
```

### Trip Creation Example

#### Backend: Trip Controller

```typescript
// server/src/controllers/trip.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createTripSchema = z.object({
  destination: z.string().min(1),
  country: z.string().min(1),
  city: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  budget: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  numberOfTravelers: z.number().int().positive().default(1)
});

export const createTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const validatedData = createTripSchema.parse(req.body);
    
    const trip = await prisma.trip.create({
      data: {
        userId,
        ...validatedData,
        status: 'DRAFT'
      }
    });
    
    res.status(201).json({
      success: true,
      data: { trip }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserTrips = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    
    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        itinerary: {
          select: {
            id: true,
            generatedAt: true
          }
        },
        safetyReport: {
          select: {
            id: true,
            overallLevel: true
          }
        }
      }
    });
    
    res.json({
      success: true,
      data: { trips }
    });
  } catch (error) {
    next(error);
  }
};
```

#### Frontend: Trip Creation Form

```typescript
// client/src/pages/OnboardingPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';

const tripSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.number().positive('Budget must be positive'),
  currency: z.string().default('USD'),
  numberOfTravelers: z.number().int().positive().default(1)
});

type TripFormData = z.infer<typeof tripSchema>;

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      currency: 'USD',
      numberOfTravelers: 1
    }
  });
  
  const onSubmit = async (data: TripFormData) => {
    try {
      setIsLoading(true);
      
      const response = await api.createTrip({
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString()
      });
      
      const tripId = response.data.trip.id;
      
      // Redirect to trip detail page
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Plan Your Trip</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <input
              {...register('destination')}
              className="input-field"
              placeholder="e.g., Tokyo, Japan"
            />
            {errors.destination && (
              <p className="text-red-600 text-sm mt-1">{errors.destination.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              {...register('country')}
              className="input-field"
              placeholder="e.g., Japan"
            />
            {errors.country && (
              <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              {...register('startDate')}
              className="input-field"
            />
            {errors.startDate && (
              <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              {...register('endDate')}
              className="input-field"
            />
            {errors.endDate && (
              <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Budget</label>
            <input
              type="number"
              {...register('budget', { valueAsNumber: true })}
              className="input-field"
              placeholder="3000"
            />
            {errors.budget && (
              <p className="text-red-600 text-sm mt-1">{errors.budget.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Number of Travelers</label>
            <input
              type="number"
              {...register('numberOfTravelers', { valueAsNumber: true })}
              className="input-field"
              min="1"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? 'Creating Trip...' : 'Create Trip'}
        </button>
      </form>
    </div>
  );
};

export default OnboardingPage;
```

---

## Development Workflow

### Daily Development Routine

1. **Start Development Servers**
```bash
npm run dev
```

2. **Check for Database Changes**
```bash
cd server
npm run db:studio  # Visual database browser
```

3. **Make Code Changes**
- Frontend: Edit files in `client/src/`
- Backend: Edit files in `server/src/`
- Hot reload handles updates automatically

4. **Test Changes**
- Frontend: Check browser at http://localhost:5173
- Backend: Test API with Postman or curl
- Database: Use Prisma Studio

5. **Commit Changes**
```bash
git add .
git commit -m "Description of changes"
git push
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/trip-creation

# Make changes and commit
git add .
git commit -m "Implement trip creation form"

# Push to remote
git push origin feature/trip-creation

# Merge to main (after review)
git checkout main
git merge feature/trip-creation
git push origin main
```

### Code Review Checklist

Before committing:
- [ ] Code follows TypeScript best practices
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Types properly defined
- [ ] Comments added for complex logic
- [ ] No sensitive data hardcoded
- [ ] Environment variables used correctly

---

## Common Tasks

### Adding a New API Endpoint

1. **Define Route**
```typescript
// server/src/routes/trip.routes.ts
router.post('/trips/:id/duplicate', authenticate, duplicateTrip);
```

2. **Create Controller**
```typescript
// server/src/controllers/trip.controller.ts
export const duplicateTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tripId = req.params.id;
    const userId = req.user!.id;
    
    // Implementation
    const duplicatedTrip = await tripService.duplicateTrip(userId, tripId);
    
    res.status(201).json({
      success: true,
      data: { trip: duplicatedTrip }
    });
  } catch (error) {
    next(error);
  }
};
```

3. **Add to Service**
```typescript
// server/src/services/trip.service.ts
async duplicateTrip(userId: string, tripId: string): Promise<Trip> {
  // Business logic
}
```

4. **Update Frontend API Client**
```typescript
// client/src/services/api.ts
async duplicateTrip(id: string) {
  const response = await this.client.post(`/trips/${id}/duplicate`);
  return response.data;
}
```

### Adding a New Database Model

1. **Update Prisma Schema**
```prisma
// server/prisma/schema.prisma
model TripNote {
  id        String   @id @default(cuid())
  tripId    String
  trip      Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  content   String
  createdAt DateTime @default(now())
  
  @@map("trip_notes")
}

model Trip {
  // ... existing fields
  notes     TripNote[]
}
```

2. **Generate Migration**
```bash
cd server
npm run db:migrate
# Enter migration name: "add_trip_notes"
```

3. **Update Types**
```typescript
// shared/types/index.ts
export interface TripNote {
  id: string;
  tripId: string;
  content: string;
  createdAt: Date;
}
```

### Adding a New React Component

1. **Create Component File**
```typescript
// client/src/components/TripCard.tsx
import { Trip } from '@shared/types';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
}

export const TripCard = ({ trip, onClick }: TripCardProps) => {
  return (
    <div className="card cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <h3 className="text-xl font-semibold">{trip.destination}</h3>
      <p className="text-gray-600">
        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
      </p>
      <p className="text-lg font-medium text-primary-600">
        ${trip.budget} {trip.currency}
      </p>
    </div>
  );
};
```

2. **Export from Index** (if creating component library)
```typescript
// client/src/components/index.ts
export { TripCard } from './TripCard';
export { Navbar } from './Navbar';
// ... other exports
```

3. **Use in Page**
```typescript
// client/src/pages/DashboardPage.tsx
import { TripCard } from '../components/TripCard';

const DashboardPage = () => {
  const { data: trips } = useTrips();
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {trips?.map(trip => (
        <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}`)} />
      ))}
    </div>
  );
};
```

---

## Troubleshooting

### Database Issues

**Problem:** "Cannot connect to database"
```bash
# Solution 1: Check PostgreSQL is running
brew services list  # macOS
sudo service postgresql status  # Linux

# Solution 2: Verify DATABASE_URL
cd server
cat .env | grep DATABASE_URL

# Solution 3: Test connection
psql -U your_username -d wanderwise
```

**Problem:** "Migration failed"
```bash
# Reset database (WARNING: deletes all data)
cd server
npx prisma migrate reset

# Or manually drop and recreate
dropdb wanderwise
createdb wanderwise
npm run db:migrate
```

**Problem:** "Prisma Client out of sync"
```bash
# Regenerate Prisma Client
cd server
npm run db:generate
```

### Port Conflicts

**Problem:** "Port 3000 already in use"
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in server/.env
PORT=3001
```

### Node Modules Issues

**Problem:** "Cannot find module" or dependency errors
```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf shared/node_modules shared/package-lock.json

npm install
```

### Build Errors

**Problem:** TypeScript errors
```bash
# Check TypeScript config
cat tsconfig.json

# Clear TypeScript cache
rm -rf node_modules/.cache

# Rebuild
npm run build
```

### API Errors

**Problem:** 401 Unauthorized
- Check JWT token is being sent
- Verify token hasn't expired
- Check JWT_SECRET matches between environments

**Problem:** CORS errors
- Verify CLIENT_URL in server/.env
- Check CORS middleware configuration
- Ensure credentials: true in both client and server

**Problem:** 500 Internal Server Error
- Check server logs
- Verify environment variables
- Check database connection
- Look for stack trace in Winston logs

### Frontend Issues

**Problem:** "White screen" or app not loading
```bash
# Check browser console for errors
# Verify API is running
curl http://localhost:3000/health

# Check Vite config
cat client/vite.config.ts

# Restart dev server
npm run dev:client
```

**Problem:** Hot reload not working
```bash
# Check Vite is watching files
# Verify file is inside src/ directory
# Restart Vite
```

---

## Deployment Guide

### Environment Setup

#### Production Environment Variables

**Server:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@production-db:5432/wanderwise
JWT_SECRET=<generate-strong-secret>
OPENAI_API_KEY=<production-key>
STRIPE_SECRET_KEY=<production-key>
STRIPE_WEBHOOK_SECRET=<production-webhook-secret>
CLIENT_URL=https://wanderwise.com
```

**Client:**
```env
VITE_API_URL=https://api.wanderwise.com
VITE_STRIPE_PUBLISHABLE_KEY=<production-publishable-key>
```

### Deployment Options

#### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

```bash
# 1. Build application
npm run build

# 2. Copy files to server
scp -r dist/ user@server:/var/www/wanderwise/

# 3. Set up nginx
# /etc/nginx/sites-available/wanderwise
server {
  listen 80;
  server_name wanderwise.com;
  
  location / {
    root /var/www/wanderwise/client/dist;
    try_files $uri $uri/ /index.html;
  }
  
  location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

# 4. Start server with PM2
pm2 start server/dist/index.js --name wanderwise-api
pm2 save
pm2 startup
```

#### Option 2: Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

#### Option 3: Platform as a Service

**Heroku:**
```bash
# Create apps
heroku create wanderwise-api
heroku create wanderwise-web

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Deploy
git push heroku main
```

**Vercel (Frontend) + Railway (Backend):**
- Frontend: Connect GitHub repo to Vercel
- Backend: Connect GitHub repo to Railway
- Add environment variables in dashboards

#### Option 4: Serverless (AWS Lambda + S3)

- Frontend: Deploy to S3 + CloudFront
- Backend: Deploy as Lambda functions with API Gateway
- Database: RDS PostgreSQL

### Post-Deployment Checklist

- [ ] SSL certificate configured (Let's Encrypt)
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Stripe webhook configured
- [ ] Domain DNS configured
- [ ] Monitoring set up (e.g., Sentry, LogRocket)
- [ ] Backup strategy implemented
- [ ] Load testing performed
- [ ] Security audit completed

---

## Additional Resources

### Documentation Links

- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org
- **Prisma:** https://www.prisma.io/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **OpenAI API:** https://platform.openai.com/docs
- **Stripe:** https://stripe.com/docs

### Learning Resources

- **React Query:** https://tanstack.com/query/latest
- **Zustand:** https://github.com/pmndrs/zustand
- **Zod:** https://zod.dev
- **Express:** https://expressjs.com

### Tools

- **Postman:** API testing
- **Prisma Studio:** Database GUI
- **TablePlus:** Database client
- **VS Code Extensions:**
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense
  - TypeScript

---

## Project Metrics

**Current Status:**
- ✅ Development environment: 100% complete
- ✅ Database schema: 100% complete
- ✅ API structure: 100% complete
- ✅ Frontend structure: 100% complete
- 🚧 Feature implementation: 0% complete

**Lines of Code:** ~2,000+ (configuration and structure)

**Estimated Completion Time:**
- Phase 1 (Foundation): 1 week
- Phase 2 (AI Integration): 1 week
- Phase 3 (Payments): 1 week
- Phase 4 (Polish): 1 week
- **Total:** 4 weeks to MVP

---

## Future Enhancements

### Short-term (3-6 months)
- Mobile app (React Native)
- Trip collaboration (invite others)
- Real-time updates (WebSocket)
- Advanced filters and search
- Itinerary templates
- Activity booking integration

### Long-term (6-12 months)
- Social features (trip sharing)
- Travel blog integration
- Photo gallery and memories
- Expense tracking
- Multi-language support
- Partnership with travel services

---

## Contact & Support

**Project Owner:** Beryl / Zelos IT Solutions LLC  
**Location:** Dallas, Texas, US  
**GitHub:** [Repository link when created]

For questions or issues during development, refer to this documentation or the README.md file.

---

**END OF DOCUMENTATION**

This document contains everything needed to continue developing WanderWise. Keep it as a reference for future development sessions.
