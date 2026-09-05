import { db } from '../../db/client';
import { payments, purchases } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { verifyPaystackWebhookSignature } from '../../lib/payments';
import { successResponse, errorResponse } from '../../lib/api-response';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  try {
    const signature = req.headers['x-paystack-signature'] as string;
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    if (signature && !verifyPaystackWebhookSignature(rawBody, signature)) {
      return res.status(401).json(errorResponse('Invalid webhook signature'));
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (event?.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const amount = data.amount / 100;
      const metadata = data.metadata || {};

      // 1. Update Payment Record
      const [existingPayment] = await db.select().from(payments).where(eq(payments.reference, reference)).limit(1);
      if (existingPayment) {
        await db.update(payments).set({
          status: 'success',
          updatedAt: new Date(),
        }).where(eq(payments.id, existingPayment.id));
      }

      // 2. Grant Template Entitlement Purchase
      const userId = metadata.userId || existingPayment?.userId;
      const templateId = metadata.templateId || (existingPayment?.metadata as any)?.templateId;

      if (userId && templateId) {
        await db.insert(purchases).values({
          userId,
          templateId,
          amount: amount.toString(),
          paymentReference: reference,
        }).onConflictDoNothing();
      }
    }

    return res.status(200).json(successResponse(null, 'Webhook processed'));
  } catch (err: any) {
    console.error('Webhook error:', err);
    return res.status(500).json(errorResponse('Failed to process webhook', err?.message));
  }
}
