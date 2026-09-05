import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const AUTH_SECRET = process.env.AUTH_SECRET || 'fallback-super-secret-jwt-key';

export interface UserTokenPayload {
  userId: string;
  email: string;
  type: 'user';
}

export interface AdminTokenPayload {
  adminId: string;
  email: string;
  role: string;
  type: 'admin';
}

export type TokenPayload = UserTokenPayload | AdminTokenPayload;

// Password Hashing using Argon2id style / bcrypt algorithm
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Token Generation
export function generateUserToken(payload: Omit<UserTokenPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'user' }, AUTH_SECRET, { expiresIn: '7d' });
}

export function generateAdminToken(payload: Omit<AdminTokenPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'admin' }, AUTH_SECRET, { expiresIn: '1d' });
}

// Token Verification
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

// Extract Bearer Token from Authorization Header
export function extractBearerToken(authHeader?: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7).trim();
}
