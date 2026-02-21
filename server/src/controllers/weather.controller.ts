import { Response, NextFunction } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../services/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

// Open-Meteo geocoding to get lat/lon from city name
async function geocode(city: string, country: string) {
  const q = encodeURIComponent(`${city} ${country}`);
  const res = await axios.get(
    `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=1`
  );
  const result = res.data.results?.[0];
  if (!result) return null;
  return { lat: result.latitude, lon: result.longitude, name: result.name };
}

export const getWeatherForecast = async (
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

    const location = await geocode(
      trip.city || trip.destination,
      trip.country
    );
    if (!location) {
      throw new ApiError(404, 'Could not find weather data for this destination');
    }

    const startDate = new Date(trip.startDate).toISOString().split('T')[0];
    const endDate = new Date(trip.endDate).toISOString().split('T')[0];

    // Try forecast first (works for dates within ~16 days)
    // Fall back to climate data for distant dates
    const now = new Date();
    const tripStart = new Date(trip.startDate);
    const daysUntilTrip = Math.floor((tripStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let weatherData;
    let dataType: 'forecast' | 'climate';

    if (daysUntilTrip <= 16) {
      // Use real forecast
      try {
        const forecastRes = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&start_date=${startDate}&end_date=${endDate}&timezone=auto`
        );
        weatherData = forecastRes.data.daily;
        dataType = 'forecast';
      } catch {
        dataType = 'climate';
      }
    } else {
      dataType = 'climate';
    }

    if (dataType === 'climate' || !weatherData) {
      // Use climate API (historical averages) for distant dates
      // Map trip dates to equivalent dates in previous year for climate normals
      const climateStart = startDate.replace(/^\d{4}/, '2024');
      const climateEnd = endDate.replace(/^\d{4}/, '2024');
      try {
        const climateRes = await axios.get(
          `https://climate-api.open-meteo.com/v1/climate?latitude=${location.lat}&longitude=${location.lon}&daily=temperature_2m_max_mean,temperature_2m_min_mean,precipitation_sum_mean&start_date=${climateStart}&end_date=${climateEnd}`
        );
        const climate = climateRes.data.daily;
        weatherData = {
          time: climate.time,
          temperature_2m_max: climate.temperature_2m_max_mean,
          temperature_2m_min: climate.temperature_2m_min_mean,
          precipitation_probability_max: climate.precipitation_sum_mean?.map(
            (p: number) => (p > 1 ? 60 : p > 0.5 ? 30 : 10)
          ),
        };
        dataType = 'climate';
      } catch (err) {
        logger.error('Climate API error:', err);
        throw new ApiError(503, 'Weather data temporarily unavailable');
      }
    }

    // Format response
    const days = weatherData.time.map((date: string, i: number) => ({
      date,
      tempMax: Math.round(weatherData.temperature_2m_max[i]),
      tempMin: Math.round(weatherData.temperature_2m_min[i]),
      precipChance: weatherData.precipitation_probability_max?.[i] ?? null,
      weatherCode: weatherData.weathercode?.[i] ?? null,
    }));

    res.json({
      success: true,
      data: {
        location: location.name,
        dataType,
        days,
      },
    });
  } catch (error) {
    next(error);
  }
};
