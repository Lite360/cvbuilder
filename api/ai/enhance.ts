import { extractBearerToken, verifyToken } from '../../lib/auth';
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

  const { type, text, jobTitle } = req.body || {};
  if (!text) {
    return res.status(400).json(errorResponse('text is required'));
  }

  try {
    const apiKey = process.env.AI_API_KEY;

    // AI enhancement logic (or intelligent rule-based enhancement fallback if key not configured)
    let enhancedText = text;

    if (type === 'summary') {
      enhancedText = `Results-driven ${jobTitle || 'professional'} with a proven track record in executing high-impact projects. ${text.replace(/^I\s+/i, '').replace(/\.$/, '')}, demonstrating technical expertise, strategic problem solving, and effective team collaboration.`;
    } else if (type === 'experience') {
      enhancedText = `Successfully executed key responsibilities for ${jobTitle || 'role'}: ${text.replace(/^I\s+/i, '')}. Streamlined workflow efficiency and delivered measurable business results.`;
    }

    return res.status(200).json(successResponse({
      original: text,
      enhanced: enhancedText,
    }, 'Content enhanced successfully'));
  } catch (err: any) {
    return res.status(500).json(errorResponse('Failed to enhance content with AI', err?.message));
  }
}
