import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../services/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { createTripSchema, updateTripSchema } from '../utils/validation.js';

export const getUserTrips = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        itinerary: { select: { id: true, generatedAt: true } },
        safetyReport: { select: { id: true, overallLevel: true } },
      },
    });

    res.json({ success: true, data: { trips } });
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const validatedData = createTripSchema.parse(req.body);

    const trip = await prisma.trip.create({
      data: {
        userId,
        destination: validatedData.destination,
        country: validatedData.country,
        city: validatedData.city,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        budget: validatedData.budget,
        currency: validatedData.currency,
        numberOfTravelers: validatedData.numberOfTravelers,
        status: 'DRAFT',
      },
    });

    res.status(201).json({ success: true, data: { trip } });
  } catch (error) {
    next(error);
  }
};

export const getTripById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const tripId = req.params.id;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
      include: {
        itinerary: {
          include: {
            days: {
              include: { activities: { orderBy: { order: 'asc' } } },
              orderBy: { dayNumber: 'asc' },
            },
          },
        },
        safetyReport: {
          include: {
            sections: { orderBy: { order: 'asc' } },
          },
        },
      },
    });

    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    res.json({ success: true, data: { trip } });
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const tripId = req.params.id;
    const validatedData = updateTripSchema.parse(req.body);

    const existing = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });
    if (!existing) {
      throw new ApiError(404, 'Trip not found');
    }

    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate);
    }
    if (validatedData.endDate) {
      updateData.endDate = new Date(validatedData.endDate);
    }

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
    });

    res.json({ success: true, data: { trip } });
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const tripId = req.params.id;

    const existing = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });
    if (!existing) {
      throw new ApiError(404, 'Trip not found');
    }

    await prisma.trip.delete({ where: { id: tripId } });

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};
