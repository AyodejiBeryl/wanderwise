import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  generateHotelSuggestions,
  generateFlightSuggestions,
  getHotelSuggestions,
  getFlightSuggestions,
} from '../controllers/suggestions.controller.js';

const router = Router();
router.use(authenticate);

// POST /api/suggestions/hotels/generate - Generate AI hotel suggestions
router.post('/hotels/generate', generateHotelSuggestions);

// POST /api/suggestions/flights/generate - Generate AI flight suggestions
router.post('/flights/generate', generateFlightSuggestions);

// GET /api/suggestions/hotels/:tripId - Get hotel suggestions for trip
router.get('/hotels/:tripId', getHotelSuggestions);

// GET /api/suggestions/flights/:tripId - Get flight suggestions for trip
router.get('/flights/:tripId', getFlightSuggestions);

export default router;
