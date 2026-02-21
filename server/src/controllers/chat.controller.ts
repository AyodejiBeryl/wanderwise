import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../services/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { chatConciergeWithAI } from '../services/ai.service.js';

const chatSchema = z.object({
  tripId: z.string().min(1),
  message: z.string().min(1).max(1000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).max(20).default([]),
});

export const chatWithConcierge = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { tripId, message, history } = chatSchema.parse(req.body);

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
      include: {
        itinerary: { include: { days: { include: { activities: true } } } },
        safetyReport: true,
      },
    });

    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    let reply;
    try {
      reply = await chatConciergeWithAI(trip, message, history);
    } catch (aiError: any) {
      throw new ApiError(503, aiError.message || 'AI concierge is temporarily unavailable.');
    }

    res.json({ success: true, data: { reply } });
  } catch (error) {
    next(error);
  }
};
