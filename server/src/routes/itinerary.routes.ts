import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { aiRateLimit } from '../middleware/aiRateLimit.js';
import {
  generateItinerary,
  getItinerary,
} from '../controllers/itinerary.controller.js';

const router = Router();
router.use(authenticate);

// POST /api/itineraries/generate - Generate AI itinerary
router.post('/generate', aiRateLimit, generateItinerary);

// GET /api/itineraries/:tripId - Get itinerary for trip
router.get('/:tripId', getItinerary);

export default router;
