import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { chatWithConcierge, getChatHistory } from '../controllers/chat.controller.js';

const router = Router();
router.use(authenticate);

// POST /api/chat - Send a message to the AI concierge
router.post('/', chatWithConcierge);

// GET /api/chat/history/:tripId - Get persisted chat history for a trip
router.get('/history/:tripId', getChatHistory);

export default router;
