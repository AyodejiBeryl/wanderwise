import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { aiRateLimit } from '../middleware/aiRateLimit.js';
import {
  generateHotelSuggestions,
  generateFlightSuggestions,
  getHotelSuggestions,
  getFlightSuggestions,
  generateGroundTransportSuggestions,
  getGroundTransportSuggestions,
} from '../controllers/suggestions.controller.js';

const router = Router();
router.use(authenticate);

// POST /api/suggestions/hotels/generate - Generate AI hotel suggestions
router.post('/hotels/generate', aiRateLimit, generateHotelSuggestions);

// POST /api/suggestions/flights/generate - Generate AI flight suggestions
router.post('/flights/generate', aiRateLimit, generateFlightSuggestions);

// POST /api/suggestions/transport/generate - Generate AI ground transport suggestions
router.post('/transport/generate', aiRateLimit, generateGroundTransportSuggestions);

// GET /api/suggestions/hotels/:tripId - Get hotel suggestions for trip
router.get('/hotels/:tripId', getHotelSuggestions);

// GET /api/suggestions/flights/:tripId - Get flight suggestions for trip
router.get('/flights/:tripId', getFlightSuggestions);

// GET /api/suggestions/transport/:tripId - Get ground transport suggestions for trip
router.get('/transport/:tripId', getGroundTransportSuggestions);

export default router;
