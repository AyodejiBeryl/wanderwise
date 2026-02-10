# WanderWise - Quick Start Guide

## Prerequisites Checklist

Before you begin, make sure you have:
- ✅ Node.js v18+ installed (`node --version`)
- ✅ npm v9+ installed (`npm --version`)
- ✅ PostgreSQL installed and running
- ✅ OpenAI API key
- ✅ Stripe account (for payments)

## Setup in 5 Minutes

### 1. Install Dependencies (1 min)

```bash
cd wanderwise
npm install
```

### 2. Setup Database (2 min)

```bash
# Create database
createdb wanderwise

# Or using PostgreSQL CLI
psql -U postgres
CREATE DATABASE wanderwise;
\q

# Setup environment
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/wanderwise?schema=public"
JWT_SECRET="your-super-secret-key-min-32-chars"
OPENAI_API_KEY="sk-your-openai-key"
```

```bash
# Run migrations
npm run db:migrate
```

### 3. Setup Frontend (1 min)

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL="http://localhost:3000/api"
```

### 4. Start Development (1 min)

```bash
# From root directory
cd ..
npm run dev
```

Visit:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000/health

## Using Docker (Alternative)

If you prefer Docker:

```bash
docker-compose up
```

That's it! Everything will be running:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Database: localhost:5432

## Next Steps

1. **Build Authentication**
   - Implement auth controllers in `server/src/controllers/auth.controller.ts`
   - Add login/register forms in client

2. **Implement Trip Creation**
   - Create trip controller
   - Build onboarding form

3. **Add AI Integration**
   - Implement OpenAI service for itinerary generation
   - Build safety report generator

4. **Setup Payments**
   - Configure Stripe
   - Implement checkout flow

## Common Commands

```bash
# Development
npm run dev              # Run both client & server
npm run dev:client       # Run only frontend
npm run dev:server       # Run only backend

# Database
cd server
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio GUI

# Build
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run linters
npm run format           # Format code
```

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running: `pg_isadmin`
- Verify DATABASE_URL in server/.env
- Make sure database exists: `psql -l`

### "Port 3000 already in use"
- Change PORT in server/.env
- Update VITE_API_URL in client/.env

### "Module not found"
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Clear cache: `npm cache clean --force`

## Project Structure Overview

```
wanderwise/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── services/   # API calls
│   │   └── App.tsx     # Main app
│   └── package.json
│
├── server/              # Express backend
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── controllers/# Business logic
│   │   ├── middleware/ # Auth, errors, etc.
│   │   └── index.ts    # Server entry
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
│
└── shared/              # Shared types
    └── types/
```

## Development Workflow

1. **Make changes** to code
2. **Hot reload** kicks in automatically
3. **Check browser** for frontend changes
4. **Check terminal** for backend logs
5. **Test API** endpoints using the app or Postman

## Need Help?

- Check README.md for detailed documentation
- Review Prisma schema in server/prisma/schema.prisma
- Explore API routes in server/src/routes/
- See component structure in client/src/

Happy coding! 🚀
