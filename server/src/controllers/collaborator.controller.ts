import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../services/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { sendCollaboratorInviteEmail } from '../services/email.service.js';

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['viewer', 'editor']).default('viewer'),
});

export const inviteCollaborator = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const tripId = req.params.tripId;
    const { email, role } = inviteSchema.parse(req.body);

    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    // Check if already invited
    const existing = await prisma.tripCollaborator.findUnique({
      where: { tripId_email: { tripId, email } },
    });
    if (existing) {
      throw new ApiError(400, 'This person has already been invited');
    }

    // Check if inviting yourself
    const owner = await prisma.user.findUnique({ where: { id: userId } });
    if (owner?.email === email) {
      throw new ApiError(400, 'You cannot invite yourself');
    }

    // Look up if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    const collaborator = await prisma.tripCollaborator.create({
      data: {
        tripId,
        email,
        role,
        userId: existingUser?.id || null,
        status: existingUser ? 'accepted' : 'pending',
      },
    });

    // Send invite email (non-blocking)
    const inviterName = owner ? `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || owner.email : 'Someone';
    const appUrl = process.env.CLIENT_URL?.split(',')[0]?.trim() || 'https://wanderwise-client-u7qr.vercel.app';
    sendCollaboratorInviteEmail(email, inviterName, trip.destination, appUrl);

    res.status(201).json({ success: true, data: { collaborator } });
  } catch (error) {
    next(error);
  }
};

export const getCollaborators = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const tripId = req.params.tripId;

    // Check ownership or collaboration
    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
    const collab = await prisma.tripCollaborator.findFirst({
      where: { tripId, userId, status: 'accepted' },
    });

    if (!trip && !collab) {
      throw new ApiError(404, 'Trip not found');
    }

    const collaborators = await prisma.tripCollaborator.findMany({
      where: { tripId },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ success: true, data: { collaborators } });
  } catch (error) {
    next(error);
  }
};

export const removeCollaborator = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { tripId, collaboratorId } = req.params;

    // Only trip owner can remove
    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    await prisma.tripCollaborator.delete({ where: { id: collaboratorId } });

    res.json({ success: true, message: 'Collaborator removed' });
  } catch (error) {
    next(error);
  }
};

export const getSharedTrips = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const userEmail = req.user!.email;

    const collaborations = await prisma.tripCollaborator.findMany({
      where: {
        OR: [
          { userId },
          { email: userEmail },
        ],
        status: 'accepted',
      },
      include: {
        trip: true,
      },
    });

    const trips = collaborations.map((c) => ({
      ...c.trip,
      myRole: c.role,
    }));

    res.json({ success: true, data: { trips } });
  } catch (error) {
    next(error);
  }
};
