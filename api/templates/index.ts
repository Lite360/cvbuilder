import {db} from '../../db/client';
import {templates} from '../../db/schema';
import {eq} from 'drizzle-orm';
import {successResponse, errorResponse} from '../../lib/api-response';

export default async function handler(req : any, res : any) {
    if (req.method !== 'GET') {
        return res.status(405).json(errorResponse('Method not allowed'));
    }

    try {
        const list = await db.select().from(templates).where(eq(templates.isActive, true));
        return res.status(200).json(successResponse(list, 'Templates retrieved successfully'));
    } catch (err : any) {
        return res.status(500).json(errorResponse('Failed to fetch templates', err ?. message));
    }
}
