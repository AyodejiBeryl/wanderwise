import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../services/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { generateSuggestionsSchema } from '../utils/validation.js';
import {
  generateHotelSuggestionsWithAI,
  generateFlightSuggestionsWithAI,
} from '../services/ai.service.js';

export const generateHotelSuggestions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const validatedData = generateSuggestionsSchema.parse(req.body);

    const trip = await prisma.trip.findFirst({
      where: { id: validatedData.tripId, userId },
    });

    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    let aiResult;
    try {
      aiResult = await generateHotelSuggestionsWithAI({
        destination: trip.destination,
        country: trip.country,
        city: trip.city,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
        currency: trip.currency,
        numberOfTravelers: trip.numberOfTravelers,
      });
    } catch (aiError: any) {
      throw new ApiError(503, aiError.message || 'Failed to generate hotel suggestions. Please try again.');
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: trip.id },
      data: { hotelSuggestions: aiResult as any },
    });

    res.status(201).json({ success: true, data: { hotelSuggestions: updatedTrip.hotelSuggestions } });
  } catch (error) {
    next(error);
  }
};

export const generateFlightSuggestions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const validatedData = generateSuggestionsSchema.parse(req.body);

    const trip = await prisma.trip.findFirst({
      where: { id: validatedData.tripId, userId },
    });

    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    let aiResult;
    try {
      aiResult = await generateFlightSuggestionsWithAI({
        destination: trip.destination,
        country: trip.country,
        city: trip.city,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
        currency: trip.currency,
        numberOfTravelers: trip.numberOfTravelers,
      });
    } catch (aiError: any) {
      throw new ApiError(503, aiError.message || 'Failed to generate flight suggestions. Please try again.');
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: trip.id },
      data: { flightSuggestions: aiResult as any },
    });

    res.status(201).json({ success: true, data: { flightSuggestions: updatedTrip.flightSuggestions } });
  } catch (error) {
    next(error);
  }
};

export const getHotelSuggestions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const tripId = req.params.tripId;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });
    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    if (!trip.hotelSuggestions) {
      throw new ApiError(404, 'Hotel suggestions not found. Generate them first.');
    }

    res.json({ success: true, data: { hotelSuggestions: trip.hotelSuggestions } });
  } catch (error) {
    next(error);
  }
};

export const getFlightSuggestions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const tripId = req.params.tripId;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });
    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    if (!trip.flightSuggestions) {
      throw new ApiError(404, 'Flight suggestions not found. Generate them first.');
    }

    res.json({ success: true, data: { flightSuggestions: trip.flightSuggestions } });
  } catch (error) {
    next(error);
  }
};
