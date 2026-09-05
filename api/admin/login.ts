import {db} from '../../db/client';
import {admins} from '../../db/schema';
import {eq} from 'drizzle-orm';
import {comparePassword, generateAdminToken} from '../../lib/auth';
import {successResponse, errorResponse} from '../../lib/api-response';

export default async function handler(req : any, res : any) {
    if (req.method !== 'POST') {
        return res.status(405).json(errorResponse('Method not allowed'));
    }

    try {
        const {email, password} = req.body || {};

        if (!email || !password) {
            return res.status(400).json(errorResponse('Email and password are required'));
        }

        const [admin] = await db.select().from(admins).where(eq(admins.email, email.toLowerCase().trim())).limit(1);
        if (!admin) {
            return res.status(401).json(errorResponse('Invalid admin credentials'));
        }

        const isMatch = await comparePassword(password, admin.passwordHash);
        if (! isMatch) {
            return res.status(401).json(errorResponse('Invalid admin credentials'));
        }

        const token = generateAdminToken({adminId: admin.id, email: admin.email, role: admin.role});

        return res.status(200).json(successResponse({
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        }, 'Admin login successful'));
    } catch (err : any) {
        return res.status(500).json(errorResponse('Admin login failed', err ?. message));
    }
}
