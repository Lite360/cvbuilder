import { db } from '../../../db/client';
import { cvs, cvSkills } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { extractBearerToken, verifyToken } from '../../../lib/auth';
import { successResponse, errorResponse } from '../../../lib/api-response';

export default async function handler(req: any, res: any) {
  const token = extractBearerToken(req.headers.authorization);
  const auth = token ? verifyToken(token) : null;
  if (!auth || auth.type !== 'user') return res.status(401).json(errorResponse('Unauthorized access'));

  const { id: cvId } = req.query || {};
  const [cv] = await db.select().from(cvs).where(and(eq(cvs.id, cvId), eq(cvs.userId, auth.userId))).limit(1);
  if (!cv) return res.status(404).json(errorResponse('CV not found'));

  if (req.method === 'POST') {
    try {
      const { skillName, proficiencyLevel, sortOrder } = req.body || {};
      if (!skillName) return res.status(400).json(errorResponse('skillName is required'));

      const [newSkill] = await db.insert(cvSkills).values({
        cvId,
        skillName,
        proficiencyLevel: proficiencyLevel || 'Intermediate',
        sortOrder: sortOrder || 0,
      }).returning();

      await db.update(cvs).set({ updatedAt: new Date() }).where(eq(cvs.id, cvId));
      return res.status(201).json(successResponse(newSkill, 'Skill added'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to add skill', err?.message));
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { skillId } = req.body || req.query || {};
      if (!skillId) return res.status(400).json(errorResponse('skillId is required'));

      await db.delete(cvSkills).where(and(eq(cvSkills.id, skillId), eq(cvSkills.cvId, cvId)));
      await db.update(cvs).set({ updatedAt: new Date() }).where(eq(cvs.id, cvId));
      return res.status(200).json(successResponse(null, 'Skill removed'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to delete skill', err?.message));
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'));
}
