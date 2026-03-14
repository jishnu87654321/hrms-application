const cors = require('cors')({
  origin: "https://hrms-integrated.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
});

let app;

module.exports = (req, res) => {
  // Explicitly handle preflight for Vercel
  res.setHeader('Access-Control-Allow-Origin', 'https://hrms-integrated.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Defer loading the app for better error visibility and faster preflight responses
  try {
    if (!app) {
      console.log('Loading Express app...');
      app = require('../src/app');
    }
  } catch (err) {
    console.error('CRITICAL: Failed to load Express app:', err.message);
    return res.status(500).json({ 
      error: 'Backend Initialization Error', 
      message: err.message,
      path: err.path || 'unknown',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Apply CORS then delegate to the app
  return cors(req, res, () => {
    if (req.url === '/' || req.url === '/api/health') {
      return res.status(200).json({ status: 'ok', message: 'HRMS Backend is running' });
    }
    return app(req, res);
  });
};