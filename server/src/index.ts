import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import tripRoutes from './routes/trip.routes.js';
import itineraryRoutes from './routes/itinerary.routes.js';
import safetyRoutes from './routes/safety.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import userRoutes from './routes/user.routes.js';
import suggestionsRoutes from './routes/suggestions.routes.js';
import chatRoutes from './routes/chat.routes.js';
import templatesRoutes from './routes/templates.routes.js';
import collaboratorRoutes from './routes/collaborator.routes.js';
import weatherRoutes from './routes/weather.routes.js';

dotenv.config();

// Fail fast on missing required environment variables
const REQUIRED_ENV_VARS = ['JWT_SECRET', 'DATABASE_URL', 'STRIPE_SECRET_KEY'];
const missingVars = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));
app.use(cors({
  origin: (origin, callback) => {
    // In production, allow same-origin (no origin header) requests
    if (!origin) {
      callback(null, true);
      return;
    }
    const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
      .split(',')
      .map(o => o.trim());
    if (allowedOrigins.some(allowed => origin === allowed)) {
      callback(null, origin);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/collaborators', collaboratorRoutes);
app.use('/api/weather', weatherRoutes);

// Root route for health check / basic info
app.get('/', (_req, res) => {
  res.json({ message: 'WanderWise API is running!' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

export default app;
