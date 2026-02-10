import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../services/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { generateSafetyReportSchema } from '../utils/validation.js';
import { generateSafetyReportWithAI } from '../services/ai.service.js';

export const generateSafetyReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const validatedData = generateSafetyReportSchema.parse(req.body);

    const trip = await prisma.trip.findFirst({
      where: { id: validatedData.tripId, userId },
    });

    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    // Fetch user's safety profile
    const safetyProfile = await prisma.safetyProfile.findUnique({
      where: { userId },
    });

    // Delete existing report if regenerating
    const existing = await prisma.safetyReport.findUnique({
      where: { tripId: trip.id },
    });
    if (existing) {
      await prisma.safetyReport.delete({ where: { id: existing.id } });
    }

    // Generate with AI
    const aiResult = await generateSafetyReportWithAI(
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
      safetyProfile
    );

    // Validate safety levels
    const validLevels = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];
    const overallLevel = validLevels.includes(aiResult.overallLevel)
      ? aiResult.overallLevel
      : 'MODERATE';

    // Save to database
    const safetyReport = await prisma.safetyReport.create({
      data: {
        tripId: trip.id,
        overallLevel: overallLevel as any,
        summary: aiResult.summary,
        aiModel: 'gemini-2.0-flash',
        sections: {
          create: aiResult.sections.map((section, idx) => ({
            title: section.title,
            level: (validLevels.includes(section.level)
              ? section.level
              : 'MODERATE') as any,
            content: section.content,
            tips: section.tips || [],
            resources: section.resources || [],
            order: idx,
          })),
        },
      },
      include: {
        sections: { orderBy: { order: 'asc' } },
      },
    });

    res.status(201).json({ success: true, data: { safetyReport } });
  } catch (error) {
    next(error);
  }
};

export const getSafetyReport = async (
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

    const safetyReport = await prisma.safetyReport.findUnique({
      where: { tripId },
      include: {
        sections: { orderBy: { order: 'asc' } },
      },
    });

    if (!safetyReport) {
      throw new ApiError(404, 'Safety report not found. Generate one first.');
    }

    res.json({ success: true, data: { safetyReport } });
  } catch (error) {
    next(error);
  }
};
