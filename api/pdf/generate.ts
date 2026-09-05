import { db } from '../../db/client';
import { cvs, cvProfiles, educations, experiences, cvSkills, projects, certifications, templates, purchases } from '../../db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { extractBearerToken, verifyToken } from '../../lib/auth';
import { renderCVTemplate } from '../../templates';
import { uploadToBlob } from '../../lib/blob';
import { successResponse, errorResponse } from '../../lib/api-response';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json(errorResponse('Method not allowed'));
  }

  const token = extractBearerToken(req.headers.authorization);
  const auth = token ? verifyToken(token) : null;
  if (!auth || auth.type !== 'user') {
    return res.status(401).json(errorResponse('Unauthorized access'));
  }

  const { cvId } = req.body || {};
  if (!cvId) {
    return res.status(400).json(errorResponse('cvId is required'));
  }

  try {
    // 1. Fetch CV & Check Ownership
    const [cv] = await db.select().from(cvs).where(and(eq(cvs.id, cvId), eq(cvs.userId, auth.userId))).limit(1);
    if (!cv) {
      return res.status(404).json(errorResponse('CV not found'));
    }

    // 2. Fetch Selected Template & Check Premium Access
    const [template] = await db.select().from(templates).where(eq(templates.id, cv.templateId)).limit(1);
    if (template?.isPremium) {
      const userPurchases = await db.select().from(purchases).where(and(
        eq(purchases.userId, auth.userId),
        eq(purchases.templateId, template.id)
      )).limit(1);

      if (userPurchases.length === 0) {
        return res.status(403).json(errorResponse(`Template '${template.name}' is premium and must be purchased before PDF export.`));
      }
    }

    // 3. Assemble Structured CV Model
    const [profile] = await db.select().from(cvProfiles).where(eq(cvProfiles.cvId, cvId)).limit(1);
    const eduList = await db.select().from(educations).where(eq(educations.cvId, cvId)).orderBy(asc(educations.sortOrder));
    const expList = await db.select().from(experiences).where(eq(experiences.cvId, cvId)).orderBy(asc(experiences.sortOrder));
    const skillList = await db.select().from(cvSkills).where(eq(cvSkills.cvId, cvId)).orderBy(asc(cvSkills.sortOrder));
    const projList = await db.select().from(projects).where(eq(projects.cvId, cvId)).orderBy(asc(projects.sortOrder));
    const certList = await db.select().from(certifications).where(eq(certifications.cvId, cvId)).orderBy(asc(certifications.sortOrder));

    const cvData = {
      profile: profile || { fullName: 'CV Owner' },
      education: eduList.map(e => ({ ...e, id: e.id })),
      experience: expList.map(e => ({ ...e, id: e.id, bulletPoints: (e.bulletPoints as string[]) || [] })),
      skills: skillList.map(s => ({ ...s, id: s.id })),
      projects: projList.map(p => ({ ...p, id: p.id })),
      certifications: certList.map(c => ({ ...c, id: c.id })),
    };

    // 4. Render HTML string
    const htmlContent = renderCVTemplate(template?.slug || 'classic', cvData);

    // 5. Upload document to Vercel Blob (or return printable document URL)
    const filename = `cv_${cvId}_${Date.now()}.html`;
    const blobUrl = await uploadToBlob(filename, Buffer.from(htmlContent, 'utf-8'), 'text/html');

    return res.status(200).json(successResponse({
      pdfUrl: blobUrl,
      htmlContent,
      template: template?.name || 'Classic',
      cvTitle: cv.title,
    }, 'PDF document generated successfully'));
  } catch (err: any) {
    console.error('PDF Generation error:', err);
    return res.status(500).json(errorResponse('Failed to generate PDF document', err?.message));
  }
}
