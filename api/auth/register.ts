import type { Request, Response } from 'express';
import { db } from '../../db/client';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, generateUserToken } from '../../lib/auth';
import { successResponse, errorResponse } from '../../lib/api-response';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  try {
    const { email, password, fullName } = req.body || {};

    if (!email || !password) {
      return res.status(400).json(errorResponse('Email and password are required'));
    }

    if (password.length < 6) {
      return res.status(400).json(errorResponse('Password must be at least 6 characters'));
    }

    // Check existing user
    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    if (existing.length > 0) {
      return res.status(400).json(errorResponse('User with this email already exists'));
    }

    // Hash password & save user
    const passwordHash = await hashPassword(password);
    const [newUser] = await db.insert(users).values({
      email: email.toLowerCase().trim(),
      passwordHash,
      fullName: fullName || null,
    }).returning();

    // Generate Auth Token
    const token = generateUserToken({ userId: newUser.id, email: newUser.email });

    return res.status(201).json(successResponse({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
      },
    }, 'Account created successfully'));
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json(errorResponse('Failed to register user', err?.message));
  }
}
