import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  generateItinerary,
  getItinerary,
} from '../controllers/itinerary.controller.js';

const router = Router();
router.use(authenticate);

// POST /api/itineraries/generate - Generate AI itinerary
router.post('/generate', generateItinerary);

// GET /api/itineraries/:tripId - Get itinerary for trip
router.get('/:tripId', getItinerary);

export default router;
