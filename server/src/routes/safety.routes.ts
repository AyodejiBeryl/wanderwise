import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  generateSafetyReport,
  getSafetyReport,
} from '../controllers/safety.controller.js';

const router = Router();
router.use(authenticate);

// POST /api/safety/generate - Generate safety report
router.post('/generate', generateSafetyReport);

// GET /api/safety/:tripId - Get safety report for trip
router.get('/:tripId', getSafetyReport);

export default router;
