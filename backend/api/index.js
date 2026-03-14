const app = require('../src/app');

const cors = require('cors')({
  origin: "https://hrms-integrated.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
});

module.exports = (req, res) => {
  // Explicitly handle preflight for Vercel
  res.setHeader('Access-Control-Allow-Origin', 'https://hrms-integrated.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Always apply CORS middleware to every Vercel request for safety
  return cors(req, res, () => {
    if (req.url === '/' || req.url === '/api/health') {
      return res.status(200).json({ status: 'ok', message: 'HRMS Backend is running' });
    }
    return app(req, res);
  });
};