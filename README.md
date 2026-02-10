# WanderWise - AI-Powered Travel Planning Platform

A full-stack travel planning application with AI-generated itineraries and safety-first features for diverse travelers.

## 🌟 Features

- **AI-Powered Itineraries**: Generate personalized day-by-day travel plans
- **Safety-First Approach**: Comprehensive safety reports tailored to your needs
- **Budget Management**: Plan trips within your budget constraints
- **Multi-day Planning**: Create detailed itineraries for trips of any length
- **Activity Recommendations**: Discover attractions, dining, and experiences
- **User Authentication**: Secure account management
- **Payment Integration**: Stripe-powered payment processing

## 🏗️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- React Router (routing)
- React Query (data fetching)
- Zustand (state management)
- Tailwind CSS (styling)
- React Hook Form + Zod (forms & validation)

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- JWT authentication
- OpenAI API integration
- Stripe payment processing

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database
- OpenAI API key
- Stripe account (for payments)

## 🚀 Getting Started

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm install --workspaces
```

### 2. Database Setup

```bash
# Create a PostgreSQL database
createdb wanderwise

# Update server/.env with your database URL
DATABASE_URL="postgresql://username:password@localhost:5432/wanderwise?schema=public"

# Generate Prisma Client and run migrations
cd server
npm run db:generate
npm run db:migrate
```

### 3. Environment Variables

#### Server (.env)
Copy `server/.env.example` to `server/.env` and fill in:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
CLIENT_URL="http://localhost:5173"
```

#### Client (.env)
Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL="http://localhost:3000/api"
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 4. Run Development Servers

```bash
# Run both client and server concurrently
npm run dev

# Or run individually:
npm run dev:client  # Frontend on http://localhost:5173
npm run dev:server  # Backend on http://localhost:3000
```

## 📁 Project Structure

```
wanderwise/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Utility functions
│   │   ├── styles/        # Global styles
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models (Prisma)
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   ├── config/        # Configuration files
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Server entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
│
├── shared/                # Shared types and utilities
│   ├── types/            # TypeScript types
│   └── constants/        # Shared constants
│
└── package.json          # Root workspace config
```

## 🔧 Development Workflow

### Database Migrations

```bash
# Create a new migration
cd server
npm run db:migrate

# Push schema changes without migrations (dev only)
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed the database
npm run db:seed
```

### Building for Production

```bash
# Build all workspaces
npm run build

# Start production server
npm start
```

### Code Quality

```bash
# Run linters
npm run lint

# Format code
npm run format
```

## 🗄️ Database Schema

The application uses the following main entities:

- **User**: User accounts and authentication
- **SafetyProfile**: User's safety preferences and concerns
- **Trip**: Trip details and metadata
- **Itinerary**: AI-generated trip plans
- **Day**: Individual days in an itinerary
- **Activity**: Specific activities and experiences
- **SafetyReport**: Safety information for destinations
- **Payment**: Payment transactions

See `server/prisma/schema.prisma` for the complete schema.

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Trips
- `GET /api/trips` - Get all user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip by ID
- `PATCH /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Itineraries
- `POST /api/itineraries/generate` - Generate AI itinerary
- `GET /api/itineraries/:tripId` - Get trip itinerary

### Safety
- `POST /api/safety/generate` - Generate safety report
- `GET /api/safety/:tripId` - Get safety report

### Payments
- `POST /api/payments/create-checkout` - Create Stripe checkout
- `POST /api/payments/webhook` - Stripe webhook handler

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update profile
- `POST /api/users/safety-profile` - Update safety profile

## 🎨 Frontend Components (To Be Implemented)

Key components to build:
- Trip creation form
- Itinerary display
- Activity cards
- Safety report viewer
- Payment checkout
- User profile editor

## 🤖 AI Integration

The application uses OpenAI's API to:
- Generate personalized itineraries based on user preferences
- Create safety reports tailored to user concerns
- Provide activity recommendations
- Optimize routes and schedules

## 💳 Payment Integration

Stripe integration for:
- Per-trip payments ($8-25 per trip)
- Monthly subscriptions
- Secure checkout flow
- Webhook handling for payment confirmation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Helmet.js security headers
- CORS protection
- Input validation with Zod
- SQL injection protection via Prisma

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile devices

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Port Already in Use
- Change PORT in server/.env
- Update VITE_API_URL in client/.env

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is private and proprietary.

## 👥 Team

Built by the WanderWise development team.

## 🚧 Roadmap

- [ ] Implement authentication controllers
- [ ] Build AI itinerary generation service
- [ ] Create safety report generation
- [ ] Integrate Stripe payments
- [ ] Add Google Places API integration
- [ ] Build trip sharing features
- [ ] Add collaborative trip planning
- [ ] Mobile app development

## 📞 Support

For issues or questions, please open an issue in the repository.
