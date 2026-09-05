import { db } from '../../db/client';
import { cvs, cvProfiles, educations, experiences, cvSkills, projects, certifications, templates } from '../../db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { extractBearerToken, verifyToken } from '../../lib/auth';
import { successResponse, errorResponse } from '../../lib/api-response';

export default async function handler(req: any, res: any) {
  const token = extractBearerToken(req.headers.authorization);
  const auth = token ? verifyToken(token) : null;

  if (!auth || auth.type !== 'user') {
    return res.status(401).json(errorResponse('Unauthorized access'));
  }

  const { id: cvId } = req.query || {};
  if (!cvId) {
    return res.status(400).json(errorResponse('CV ID is required'));
  }

  // 1. Verify Ownership
  const [cv] = await db.select().from(cvs).where(and(eq(cvs.id, cvId), eq(cvs.userId, auth.userId))).limit(1);
  if (!cv) {
    return res.status(404).json(errorResponse('CV not found or access denied'));
  }

  // GET: Return complete structured CV model
  if (req.method === 'GET') {
    try {
      const [template] = await db.select().from(templates).where(eq(templates.id, cv.templateId)).limit(1);
      const [profile] = await db.select().from(cvProfiles).where(eq(cvProfiles.cvId, cvId)).limit(1);
      const eduList = await db.select().from(educations).where(eq(educations.cvId, cvId)).orderBy(asc(educations.sortOrder));
      const expList = await db.select().from(experiences).where(eq(experiences.cvId, cvId)).orderBy(asc(experiences.sortOrder));
      const skillList = await db.select().from(cvSkills).where(eq(cvSkills.cvId, cvId)).orderBy(asc(cvSkills.sortOrder));
      const projList = await db.select().from(projects).where(eq(projects.cvId, cvId)).orderBy(asc(projects.sortOrder));
      const certList = await db.select().from(certifications).where(eq(certifications.cvId, cvId)).orderBy(asc(certifications.sortOrder));

      return res.status(200).json(successResponse({
        cv,
        template,
        profile: profile || {},
        education: eduList,
        experience: expList,
        skills: skillList,
        projects: projList,
        certifications: certList,
      }, 'CV loaded successfully'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to fetch CV details', err?.message));
    }
  }

  // PATCH: Update CV metadata or template
  if (req.method === 'PATCH') {
    try {
      const { title, templateId, cvType } = req.body || {};
      const updates: any = { updatedAt: new Date() };

      if (title) updates.title = title;
      if (templateId) updates.templateId = templateId;
      if (cvType) updates.cvType = cvType;

      const [updatedCv] = await db.update(cvs).set(updates).where(eq(cvs.id, cvId)).returning();
      return res.status(200).json(successResponse(updatedCv, 'CV updated successfully'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to update CV', err?.message));
    }
  }

  // DELETE: Remove CV and cascade delete sections
  if (req.method === 'DELETE') {
    try {
      await db.delete(cvs).where(eq(cvs.id, cvId));
      return res.status(200).json(successResponse(null, 'CV deleted successfully'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to delete CV', err?.message));
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'));
}
