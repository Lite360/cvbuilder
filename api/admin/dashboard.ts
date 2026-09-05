import { db } from '../../db/client';
import { users, cvs, purchases, payments } from '../../db/schema';
import { count, sum, eq } from 'drizzle-orm';
import { extractBearerToken, verifyToken } from '../../lib/auth';
import { successResponse, errorResponse } from '../../lib/api-response';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  const token = extractBearerToken(req.headers.authorization);
  const auth = token ? verifyToken(token) : null;
  if (!auth || auth.type !== 'admin') {
    return res.status(403).json(errorResponse('Forbidden: Admin privilege required'));
  }

  try {
    const [{ value: userCount }] = await db.select({ value: count() }).from(users);
    const [{ value: cvCount }] = await db.select({ value: count() }).from(cvs);
    const [{ value: purchaseCount }] = await db.select({ value: count() }).from(purchases);
    const [{ totalRevenue }] = await db.select({ totalRevenue: sum(purchases.amount) }).from(purchases);

    const recentPurchases = await db.select().from(purchases).limit(10);

    return res.status(200).json(successResponse({
      stats: {
        totalUsers: userCount || 0,
        totalCvs: cvCount || 0,
        totalPurchases: purchaseCount || 0,
        totalRevenue: totalRevenue ? parseFloat(totalRevenue as string) : 0,
      },
      recentPurchases,
    }, 'Admin dashboard metrics retrieved'));
  } catch (err: any) {
    return res.status(500).json(errorResponse('Failed to load dashboard metrics', err?.message));
  }
}
