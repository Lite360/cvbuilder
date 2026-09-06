module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const payload = {
    success: true,
    message: 'CV Builder API Service is operational',
    data: {
      name: 'CV Builder API',
      version: '1.0.0',
      status: 'online',
      timestamp: new Date().toISOString(),
      routes: {
        auth: {
          login: 'POST /api/auth/login',
          register: 'POST /api/auth/register'
        },
        cvs: {
          list: 'GET /api/cvs',
          create: 'POST /api/cvs'
        },
        templates: {
          list: 'GET /api/templates'
        },
        pdf: {
          generate: 'POST /api/pdf/generate'
        },
        payments: {
          checkout: 'POST /api/payments'
        },
        ai: {
          enhance: 'POST /api/ai/enhance'
        }
      }
    }
  };

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(200).json(payload);
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  return res.end(JSON.stringify(payload));
};
