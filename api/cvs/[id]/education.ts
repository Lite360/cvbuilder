import { db } from '../../../db/client';
import { cvs, educations } from '../../../db/schema';
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

  // POST: Add new education record
  if (req.method === 'POST') {
    try {
      const { institution, degree, fieldOfStudy, startDate, endDate, grade, description, sortOrder } = req.body || {};
      if (!institution || !degree) return res.status(400).json(errorResponse('Institution and degree are required'));

      const [newEdu] = await db.insert(educations).values({
        cvId,
        institution,
        degree,
        fieldOfStudy: fieldOfStudy || null,
        startDate: startDate || null,
        endDate: endDate || null,
        grade: grade || null,
        description: description || null,
        sortOrder: sortOrder || 0,
      }).returning();

      await db.update(cvs).set({ updatedAt: new Date() }).where(eq(cvs.id, cvId));
      return res.status(201).json(successResponse(newEdu, 'Education entry added'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to add education', err?.message));
    }
  }

  // PATCH: Edit education record
  if (req.method === 'PATCH') {
    try {
      const { eduId, ...updates } = req.body || {};
      if (!eduId) return res.status(400).json(errorResponse('eduId is required'));

      const [updated] = await db.update(educations).set(updates).where(and(eq(educations.id, eduId), eq(educations.cvId, cvId))).returning();
      await db.update(cvs).set({ updatedAt: new Date() }).where(eq(cvs.id, cvId));
      return res.status(200).json(successResponse(updated, 'Education entry updated'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to update education', err?.message));
    }
  }

  // DELETE: Delete education record
  if (req.method === 'DELETE') {
    try {
      const { eduId } = req.body || req.query || {};
      if (!eduId) return res.status(400).json(errorResponse('eduId is required'));

      await db.delete(educations).where(and(eq(educations.id, eduId), eq(educations.cvId, cvId)));
      await db.update(cvs).set({ updatedAt: new Date() }).where(eq(cvs.id, cvId));
      return res.status(200).json(successResponse(null, 'Education entry deleted'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to delete education', err?.message));
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'));
}
