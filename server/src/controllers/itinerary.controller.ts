import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../services/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { generateItinerarySchema } from '../utils/validation.js';
import { generateItineraryWithAI } from '../services/ai.service.js';

export const generateItinerary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const validatedData = generateItinerarySchema.parse(req.body);

    const trip = await prisma.trip.findFirst({
      where: { id: validatedData.tripId, userId },
    });

    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    // Delete existing itinerary if regenerating
    const existing = await prisma.itinerary.findUnique({
      where: { tripId: trip.id },
    });
    if (existing) {
      await prisma.itinerary.delete({ where: { id: existing.id } });
    }

    // Generate with AI
    const aiResult = await generateItineraryWithAI(
      {
        destination: trip.destination,
        country: trip.country,
        city: trip.city,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
        currency: trip.currency,
        numberOfTravelers: trip.numberOfTravelers,
      },
      validatedData.preferences
    );

    // Save to database
    const itinerary = await prisma.itinerary.create({
      data: {
        tripId: trip.id,
        aiModel: 'gemini-2.0-flash',
        days: {
          create: aiResult.days.map((day) => ({
            dayNumber: day.dayNumber,
            date: new Date(
              new Date(trip.startDate).getTime() +
                (day.dayNumber - 1) * 24 * 60 * 60 * 1000
            ),
            theme: day.theme,
            activities: {
              create: day.activities.map((activity, idx) => ({
                name: activity.name,
                description: activity.description,
                category: activity.category as any,
                location: activity.location,
                address: activity.address,
                startTime: activity.startTime,
                duration: activity.duration,
                estimatedCost: activity.estimatedCost,
                currency: activity.currency || trip.currency,
                safetyNotes: activity.safetyNotes,
                requiresBooking: activity.requiresBooking || false,
                order: idx,
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: { activities: { orderBy: { order: 'asc' } } },
          orderBy: { dayNumber: 'asc' },
        },
      },
    });

    // Update trip status
    await prisma.trip.update({
      where: { id: trip.id },
      data: { status: 'PLANNED' },
    });

    res.status(201).json({ success: true, data: { itinerary } });
  } catch (error) {
    next(error);
  }
};

export const getItinerary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const tripId = req.params.tripId;

    // Verify trip ownership
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });
    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    const itinerary = await prisma.itinerary.findUnique({
      where: { tripId },
      include: {
        days: {
          include: { activities: { orderBy: { order: 'asc' } } },
          orderBy: { dayNumber: 'asc' },
        },
      },
    });

    if (!itinerary) {
      throw new ApiError(404, 'Itinerary not found. Generate one first.');
    }

    res.json({ success: true, data: { itinerary } });
  } catch (error) {
    next(error);
  }
};
