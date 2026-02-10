import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getUserTrips,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
} from '../controllers/trip.controller.js';

const router = Router();

// All trip routes require authentication
router.use(authenticate);

// GET /api/trips - Get all trips for user
router.get('/', getUserTrips);

// POST /api/trips - Create new trip
router.post('/', createTrip);

// GET /api/trips/:id - Get single trip
router.get('/:id', getTripById);

// PATCH /api/trips/:id - Update trip
router.patch('/:id', updateTrip);

// DELETE /api/trips/:id - Delete trip
router.delete('/:id', deleteTrip);

export default router;
