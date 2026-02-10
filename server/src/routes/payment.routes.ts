import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

// Payments disabled during beta - all features are free
router.post('/create-checkout', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message:
      'Payments are disabled during beta. All features are free to use!',
  });
});

router.post('/webhook', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Webhook disabled during beta.' });
});

export default router;
