import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getUserProfile,
  updateUserProfile,
  updateSafetyProfile,
} from '../controllers/user.controller.js';

const router = Router();
router.use(authenticate);

// GET /api/users/profile - Get user profile
router.get('/profile', getUserProfile);

// PATCH /api/users/profile - Update user profile
router.patch('/profile', updateUserProfile);

// POST /api/users/safety-profile - Create/update safety profile
router.post('/safety-profile', updateSafetyProfile);

export default router;
