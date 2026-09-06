import { successResponse } from '../lib/api-response';

export default async function handler(req: any, res: any) {
  return res.status(200).json(successResponse({
    name: 'CV Builder API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: ['/api/auth/login', '/api/auth/register'],
      cvs: ['/api/cvs'],
      templates: ['/api/templates'],
      payments: ['/api/payments'],
      pdf: ['/api/pdf'],
      ai: ['/api/ai'],
    }
  }, 'CV Builder API Service is operational'));
}
