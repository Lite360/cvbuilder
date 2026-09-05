import { db } from '../../../db/client';
import { cvs, projects } from '../../../db/schema';
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
      const { projectName, description, technologies, projectUrl, sortOrder } = req.body || {};
      if (!projectName) return res.status(400).json(errorResponse('projectName is required'));

      const [newProj] = await db.insert(projects).values({
        cvId,
        projectName,
        description: description || null,
        technologies: technologies || null,
        projectUrl: projectUrl || null,
        sortOrder: sortOrder || 0,
      }).returning();

      await db.update(cvs).set({ updatedAt: new Date() }).where(eq(cvs.id, cvId));
      return res.status(201).json(successResponse(newProj, 'Project added'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to add project', err?.message));
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { projectId } = req.body || req.query || {};
      if (!projectId) return res.status(400).json(errorResponse('projectId is required'));

      await db.delete(projects).where(and(eq(projects.id, projectId), eq(projects.cvId, cvId)));
      await db.update(cvs).set({ updatedAt: new Date() }).where(eq(cvs.id, cvId));
      return res.status(200).json(successResponse(null, 'Project removed'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to delete project', err?.message));
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'));
}
