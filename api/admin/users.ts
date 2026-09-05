import { db } from '../../db/client';
import { users, cvs } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { extractBearerToken, verifyToken } from '../../lib/auth';
import { successResponse, errorResponse } from '../../lib/api-response';

export default async function handler(req: any, res: any) {
  const token = extractBearerToken(req.headers.authorization);
  const auth = token ? verifyToken(token) : null;
  if (!auth || auth.type !== 'admin') {
    return res.status(403).json(errorResponse('Forbidden: Admin privilege required'));
  }

  if (req.method === 'GET') {
    try {
      const userList = await db.select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        isActive: users.isActive,
        createdAt: users.createdAt,
      }).from(users).orderBy(desc(users.createdAt));

      return res.status(200).json(successResponse(userList, 'Users retrieved successfully'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to fetch user list', err?.message));
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { userId, isActive } = req.body || {};
      if (!userId || typeof isActive !== 'boolean') {
        return res.status(400).json(errorResponse('userId and boolean isActive are required'));
      }

      const [updated] = await db.update(users).set({ isActive }).where(eq(users.id, userId)).returning();
      return res.status(200).json(successResponse(updated, `User status updated to ${isActive ? 'active' : 'suspended'}`));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to update user status', err?.message));
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'));
}
