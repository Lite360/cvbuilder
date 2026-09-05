import { db } from '../../db/client';
import { templates } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { extractBearerToken, verifyToken } from '../../lib/auth';
import { successResponse, errorResponse } from '../../lib/api-response';

export default async function handler(req: any, res: any) {
  const token = extractBearerToken(req.headers.authorization);
  const auth = token ? verifyToken(token) : null;
  if (!auth || auth.type !== 'admin') {
    return res.status(403).json(errorResponse('Forbidden: Admin privilege required'));
  }

  if (req.method === 'POST') {
    try {
      const { name, slug, description, previewImageUrl, isPremium, price } = req.body || {};
      if (!name || !slug) return res.status(400).json(errorResponse('Template name and slug are required'));

      const [newT] = await db.insert(templates).values({
        name,
        slug,
        description: description || null,
        previewImageUrl: previewImageUrl || null,
        isPremium: !!isPremium,
        price: isPremium ? (price || '2000.00') : '0.00',
        isActive: true,
      }).returning();

      return res.status(201).json(successResponse(newT, 'Template created successfully'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to create template', err?.message));
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { templateId, ...updates } = req.body || {};
      if (!templateId) return res.status(400).json(errorResponse('templateId is required'));

      const [updated] = await db.update(templates).set(updates).where(eq(templates.id, templateId)).returning();
      return res.status(200).json(successResponse(updated, 'Template updated successfully'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to update template', err?.message));
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'));
}
