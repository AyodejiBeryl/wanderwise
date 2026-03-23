import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { ApiError } from './errorHandler.js';

const LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const limits = new Map<string, RateLimitEntry>();

export const aiRateLimit = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const now = Date.now();

  const entry = limits.get(userId);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    limits.set(userId, { count: 1, windowStart: now });
    return next();
  }

  if (entry.count >= LIMIT) {
    const resetIn = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 60000);
    throw new ApiError(
      429,
      `AI generation limit reached (${LIMIT}/hour). Resets in ${resetIn} minute${resetIn === 1 ? '' : 's'}.`
    );
  }

  entry.count += 1;
  next();
};
