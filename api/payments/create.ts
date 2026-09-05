import { db } from '../../db/client';
import { templates, payments } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { extractBearerToken, verifyToken } from '../../lib/auth';
import { initializePaystackPayment } from '../../lib/payments';
import { successResponse, errorResponse } from '../../lib/api-response';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  const token = extractBearerToken(req.headers.authorization);
  const auth = token ? verifyToken(token) : null;
  if (!auth || auth.type !== 'user') {
    return res.status(401).json(errorResponse('Unauthorized access'));
  }

  const { templateId } = req.body || {};
  if (!templateId) {
    return res.status(400).json(errorResponse('templateId is required'));
  }

  try {
    const [template] = await db.select().from(templates).where(eq(templates.id, templateId)).limit(1);
    if (!template) {
      return res.status(404).json(errorResponse('Template not found'));
    }

    if (!template.isPremium) {
      return res.status(400).json(errorResponse('This template is free and does not require purchase'));
    }

    const reference = `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const amountNumber = parseFloat(template.price);

    // Save pending payment record in database
    await db.insert(payments).values({
      userId: auth.userId,
      reference,
      provider: 'paystack',
      status: 'pending',
      amount: template.price,
      metadata: { templateId: template.id, templateName: template.name },
    });

    const paymentResult = await initializePaystackPayment({
      email: auth.email,
      amount: amountNumber,
      reference,
      metadata: { userId: auth.userId, templateId: template.id },
    });

    return res.status(200).json(successResponse(paymentResult, 'Payment initialized successfully'));
  } catch (err: any) {
    return res.status(500).json(errorResponse('Failed to initialize payment transaction', err?.message));
  }
}
