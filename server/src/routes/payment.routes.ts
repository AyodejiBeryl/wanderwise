import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

const PRICES: Record<string, number> = {
  PER_TRIP: 599,             // $5.99 in cents
  MONTHLY_SUBSCRIPTION: 999, // $9.99 in cents
};

router.post('/create-checkout', async (req: Request, res: Response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const { planType, tripId } = req.body as { planType: string; tripId?: string };

  if (!planType || !PRICES[planType]) {
    res.status(400).json({ success: false, message: 'Invalid plan type.' });
    return;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: planType === 'MONTHLY_SUBSCRIPTION' ? 'subscription' : 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: PRICES[planType],
          ...(planType === 'MONTHLY_SUBSCRIPTION'
            ? { recurring: { interval: 'month' }, product_data: { name: 'WanderWise Monthly' } }
            : { product_data: { name: 'WanderWise — Single Trip' } }),
        },
        quantity: 1,
      },
    ],
    metadata: {
      planType,
      ...(tripId ? { tripId } : {}),
    },
    success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel`,
  });

  res.json({ success: true, url: session.url });
});

router.post('/webhook', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Webhook not yet implemented.' });
});

export default router;
