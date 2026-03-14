const app = require('../src/app');

// Handle root requests directly for debug
const originalHandle = app.handle || app;
module.exports = (req, res) => {
  if (req.url === '/' || req.url === '/api/health') {
    return res.json({ status: 'ok', message: 'HRMS Backend is running' });
  }
  return app(req, res);
};