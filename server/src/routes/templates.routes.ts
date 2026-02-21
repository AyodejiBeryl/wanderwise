import { Router, Request, Response } from 'express';
import { tripTemplates } from '../data/trip-templates.js';

const router = Router();

// GET /api/templates - Get all trip templates (public, no auth needed)
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: { templates: tripTemplates } });
});

// GET /api/templates/:id - Get a single template
router.get('/:id', (req: Request, res: Response) => {
  const template = tripTemplates.find((t) => t.id === req.params.id);
  if (!template) {
    res.status(404).json({ success: false, message: 'Template not found' });
    return;
  }
  res.json({ success: true, data: { template } });
});

export default router;
