const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

const routes = require('./routes');

// Middleware
app.use(cors({
  origin: ["https://hrms-integrated.vercel.app", "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet({
  crossOriginResourcePolicy: false, // Required if serving assets cross-origin
}));
app.use(morgan('dev'));
app.use(express.json());

// Create uploads directory if not exists
const fs = require('fs');
const path = require('path');
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
const uploadDir = isProduction ? '/tmp/uploads' : path.join(process.cwd(), 'uploads');

if (!isProduction) {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`Created local upload directory: ${uploadDir}`);
    }
  } catch (err) {
    console.warn('Could not ensure upload dir on startup:', err.message);
  }
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.use('/api', routes);

const errorHandler = require('./middleware/errorHandler');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HRMS Backend is running' });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to HRMS API' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
