import { db } from '../../db/client';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { comparePassword, generateUserToken } from '../../lib/auth';
import { successResponse, errorResponse } from '../../lib/api-response';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json(errorResponse('Email and password are required'));
    }

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    if (!user) {
      return res.status(401).json(errorResponse('Invalid email or password'));
    }

    if (!user.isActive) {
      return res.status(403).json(errorResponse('Account is suspended. Contact support.'));
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json(errorResponse('Invalid email or password'));
    }

    const token = generateUserToken({ userId: user.id, email: user.email });

    return res.status(200).json(successResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    }, 'Login successful'));
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json(errorResponse('Failed to log in', err?.message));
  }
}
