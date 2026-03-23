import { Router } from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

// GET /api/auth/me
router.get('/me', authenticate, getCurrentUser);

// POST /api/auth/refresh — sliding-window token refresh
router.post('/refresh', authenticate, refreshToken);

export default router;
