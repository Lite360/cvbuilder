import {db} from '../../../db/client';
import {cvs, cvProfiles} from '../../../db/schema';
import {eq, and} from 'drizzle-orm';
import {extractBearerToken, verifyToken} from '../../../lib/auth';
import {successResponse, errorResponse} from '../../../lib/api-response';

export default async function handler(req : any, res : any) {
    if (req.method !== 'PUT') {
        return res.status(405).json(errorResponse('Method not allowed'));
    }

    const token = extractBearerToken(req.headers.authorization);
    const auth = token ? verifyToken(token) : null;

    if (! auth || auth.type !== 'user') {
        return res.status(401).json(errorResponse('Unauthorized access'));
    }

    const {id: cvId} = req.query || {};

    // Check ownership
    const [cv] = await db.select().from(cvs).where(and(eq(cvs.id, cvId), eq(cvs.userId, auth.userId))).limit(1);
    if (!cv) {
        return res.status(404).json(errorResponse('CV not found or access denied'));
    }

    try {
        const {
            fullName,
            professionalTitle,
            email,
            phone,
            location,
            linkedinUrl,
            websiteUrl,
            profilePhotoUrl,
            professionalSummary
        } = req.body || {};

        const profileData = {
            fullName,
            professionalTitle,
            email,
            phone,
            location,
            linkedinUrl,
            websiteUrl,
            profilePhotoUrl,
            professionalSummary,
            updatedAt: new Date()
        };

        const existingProfile = await db.select().from(cvProfiles).where(eq(cvProfiles.cvId, cvId)).limit(1);

        let updatedProfile;
        if (existingProfile.length > 0) {
            [updatedProfile] = await db.update(cvProfiles).set(profileData).where(eq(cvProfiles.cvId, cvId)).returning();
        } else {
            [updatedProfile] = await db.insert(cvProfiles).values({
                cvId,
                ... profileData
            }).returning();
        }

        // Touch CV updated_at timestamp
        await db.update(cvs).set({updatedAt: new Date()}).where(eq(cvs.id, cvId));

        return res.status(200).json(successResponse(updatedProfile, 'Personal information updated'));
    } catch (err : any) {
        return res.status(500).json(errorResponse('Failed to update profile', err ?. message));
    }
}
