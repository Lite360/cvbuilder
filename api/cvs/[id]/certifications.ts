import { db } from '../../../db/client';
import { cvs, certifications } from '../../../db/schema';
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
      const { name, issuingOrganization, issueDate, expirationDate, credentialId, credentialUrl, sortOrder } = req.body || {};
      if (!name) return res.status(400).json(errorResponse('Certification name is required'));

      const [newCert] = await db.insert(certifications).values({
        cvId,
        name,
        issuingOrganization: issuingOrganization || null,
        issueDate: issueDate || null,
        expirationDate: expirationDate || null,
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
        sortOrder: sortOrder || 0,
      }).returning();

      await db.update(cvs).set({ updatedAt: new Date() }).where(eq(cvs.id, cvId));
      return res.status(201).json(successResponse(newCert, 'Certification added'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to add certification', err?.message));
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { certId } = req.body || req.query || {};
      if (!certId) return res.status(400).json(errorResponse('certId is required'));

      await db.delete(certifications).where(and(eq(certifications.id, certId), eq(certifications.cvId, cvId)));
      await db.update(cvs).set({ updatedAt: new Date() }).where(eq(cvs.id, cvId));
      return res.status(200).json(successResponse(null, 'Certification removed'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to delete certification', err?.message));
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'));
}
