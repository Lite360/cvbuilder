import {db} from '../../../db/client';
import {cvs, experiences} from '../../../db/schema';
import {eq, and} from 'drizzle-orm';
import {extractBearerToken, verifyToken} from '../../../lib/auth';
import {successResponse, errorResponse} from '../../../lib/api-response';

export default async function handler(req : any, res : any) {
    const token = extractBearerToken(req.headers.authorization);
    const auth = token ? verifyToken(token) : null;
    if (! auth || auth.type !== 'user') 
        return res.status(401).json(errorResponse('Unauthorized access'));
    

    const {id: cvId} = req.query || {};
    const [cv] = await db.select().from(cvs).where(and(eq(cvs.id, cvId), eq(cvs.userId, auth.userId))).limit(1);
    if (!cv) 
        return res.status(404).json(errorResponse('CV not found'));
    

    if (req.method === 'POST') {
        try {
            const {
                company,
                jobTitle,
                location,
                startDate,
                endDate,
                isCurrent,
                description,
                bulletPoints,
                sortOrder
            } = req.body || {};
            if (!company || !jobTitle) 
                return res.status(400).json(errorResponse('Company and jobTitle are required'));
            

            const [newExp] = await db.insert(experiences).values({
                cvId,
                company,
                jobTitle,
                location: location || null,
                startDate: startDate || null,
                endDate: endDate || null,
                isCurrent: isCurrent || false,
                description: description || null,
                bulletPoints: bulletPoints || [],
                sortOrder: sortOrder || 0
            }).returning();

            await db.update(cvs).set({updatedAt: new Date()}).where(eq(cvs.id, cvId));
            return res.status(201).json(successResponse(newExp, 'Experience entry added'));
        } catch (err : any) {
            return res.status(500).json(errorResponse('Failed to add experience', err ?. message));
        }
    }

    if (req.method === 'PATCH') {
        try {
            const {
                expId,
                ...updates
            } = req.body || {};
            if (!expId) 
                return res.status(400).json(errorResponse('expId is required'));
            

            const [updated] = await db.update(experiences).set(updates).where(and(eq(experiences.id, expId), eq(experiences.cvId, cvId))).returning();
            await db.update(cvs).set({updatedAt: new Date()}).where(eq(cvs.id, cvId));
            return res.status(200).json(successResponse(updated, 'Experience entry updated'));
        } catch (err : any) {
            return res.status(500).json(errorResponse('Failed to update experience', err ?. message));
        }
    }

    if (req.method === 'DELETE') {
        try {
            const {expId} = req.body || req.query || {};
            if (!expId) 
                return res.status(400).json(errorResponse('expId is required'));
            

            await db.delete(experiences).where(and(eq(experiences.id, expId), eq(experiences.cvId, cvId)));
            await db.update(cvs).set({updatedAt: new Date()}).where(eq(cvs.id, cvId));
            return res.status(200).json(successResponse(null, 'Experience entry deleted'));
        } catch (err : any) {
            return res.status(500).json(errorResponse('Failed to delete experience', err ?. message));
        }
    }

    return res.status(405).json(errorResponse('Method not allowed'));
}
