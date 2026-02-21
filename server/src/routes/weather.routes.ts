import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getWeatherForecast } from '../controllers/weather.controller.js';

const router = Router();
router.use(authenticate);

// GET /api/weather/:tripId - Get weather for trip destination and dates
router.get('/:tripId', getWeatherForecast);

export default router;
