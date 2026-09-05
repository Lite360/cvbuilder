import crypto from 'crypto';

export interface InitializePaymentParams {
  email: string;
  amount: number; // in minor currency unit e.g. Kobo for NGN (amount * 100)
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

export async function initializePaystackPayment(params: InitializePaymentParams) {
  const secretKey = process.env.PAYMENT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('PAYMENT_SECRET_KEY is not configured');
  }

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount * 100),
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const data = await response.json();
  if (!data.status) {
    throw new Error(data.message || 'Failed to initialize payment');
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

export async function verifyPaystackPayment(reference: string) {
  const secretKey = process.env.PAYMENT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('PAYMENT_SECRET_KEY is not configured');
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  const data = await response.json();
  if (!data.status) {
    return { success: false, message: data.message };
  }

  return {
    success: data.data.status === 'success',
    amount: data.data.amount / 100,
    reference: data.data.reference,
    metadata: data.data.metadata,
  };
}

export function verifyPaystackWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.PAYMENT_SECRET_KEY || '';
  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
  return hash === signature;
}
