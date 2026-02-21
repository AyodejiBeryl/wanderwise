import { Resend } from 'resend';
import logger from '../utils/logger.js';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendWelcomeEmail(email: string, firstName?: string | null) {
  if (!process.env.RESEND_API_KEY) {
    logger.warn('RESEND_API_KEY not set — skipping welcome email');
    return;
  }

  const name = firstName || 'Traveler';

  try {
    await resend.emails.send({
      from: 'WanderWise <onboarding@resend.dev>',
      to: email,
      subject: `Welcome to WanderWise, ${name}!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">WanderWise</h1>
            <p style="color: #6b7280; margin-top: 4px;">AI-Powered Travel Planning</p>
          </div>

          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 12px; padding: 30px; color: white; text-align: center; margin-bottom: 24px;">
            <h2 style="margin: 0 0 8px 0; font-size: 24px;">Welcome aboard, ${name}!</h2>
            <p style="margin: 0; opacity: 0.9;">Your next adventure starts here.</p>
          </div>

          <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #111827; margin: 0 0 16px 0;">Here's what you can do:</h3>
            <ul style="color: #374151; padding-left: 20px; line-height: 1.8;">
              <li><strong>Plan trips</strong> with AI-generated day-by-day itineraries</li>
              <li><strong>Stay safe</strong> with personalized safety reports</li>
              <li><strong>Find hotels</strong> that match your budget and style</li>
              <li><strong>Compare flights</strong> with booking deep links</li>
              <li><strong>Get around</strong> with ground transport suggestions</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <p style="color: #6b7280; font-size: 14px;">
              Start by creating your first trip on the dashboard.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            You're receiving this because you signed up for WanderWise.<br />
            Happy travels!
          </p>
        </div>
      `,
    });

    logger.info(`Welcome email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send welcome email to ${email}:`, error);
    // Don't throw — email failure shouldn't block registration
  }
}
