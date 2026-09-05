import { db } from '../../db/client';
import { cvs, cvProfiles, templates } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { extractBearerToken, verifyToken } from '../../lib/auth';
import { successResponse, errorResponse } from '../../lib/api-response';

export default async function handler(req: any, res: any) {
  const token = extractBearerToken(req.headers.authorization);
  const auth = token ? verifyToken(token) : null;

  if (!auth || auth.type !== 'user') {
    return res.status(401).json(errorResponse('Unauthorized access'));
  }

  const userId = auth.userId;

  if (req.method === 'GET') {
    try {
      const userCvs = await db
        .select({
          id: cvs.id,
          title: cvs.title,
          cvType: cvs.cvType,
          templateId: cvs.templateId,
          createdAt: cvs.createdAt,
          updatedAt: cvs.updatedAt,
          templateName: templates.name,
          templateSlug: templates.slug,
          templateIsPremium: templates.isPremium,
          profileName: cvProfiles.fullName,
          profilePhotoUrl: cvProfiles.profilePhotoUrl,
        })
        .from(cvs)
        .leftJoin(templates, eq(cvs.templateId, templates.id))
        .leftJoin(cvProfiles, eq(cvs.id, cvProfiles.cvId))
        .where(eq(cvs.userId, userId))
        .orderBy(desc(cvs.updatedAt));

      return res.status(200).json(successResponse(userCvs, 'CVs retrieved successfully'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to fetch CVs', err?.message));
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, cvType, templateId } = req.body || {};

      if (!title || !templateId) {
        return res.status(400).json(errorResponse('CV title and templateId are required'));
      }

      const [newCv] = await db.insert(cvs).values({
        userId,
        templateId,
        title,
        cvType: cvType || 'Professional CV',
      }).returning();

      // Create initial profile record attached to CV
      await db.insert(cvProfiles).values({
        cvId: newCv.id,
        fullName: 'Your Full Name',
        professionalTitle: 'Professional Title',
        email: auth.email,
      });

      return res.status(201).json(successResponse(newCv, 'CV created successfully'));
    } catch (err: any) {
      return res.status(500).json(errorResponse('Failed to create CV', err?.message));
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'));
}
