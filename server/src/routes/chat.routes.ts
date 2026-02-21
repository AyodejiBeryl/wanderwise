import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { chatWithConcierge } from '../controllers/chat.controller.js';

const router = Router();
router.use(authenticate);

// POST /api/chat - Send a message to the AI concierge
router.post('/', chatWithConcierge);

export default router;
