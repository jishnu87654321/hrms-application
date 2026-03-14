const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// SSL Certificate for RDS
let ca;
const certPath = path.join(process.cwd(), 'certs', 'global-bundle.pem');

if (fs.existsSync(certPath)) {
  try {
    ca = fs.readFileSync(certPath).toString();
    console.log('SSL certificate loaded successfully');
  } catch (err) {
    console.error('Failed to read SSL certificate:', err.message);
  }
} else {
  console.log('SSL certificate not found at:', certPath);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: ca ? { rejectUnauthorized: false, ca } : false
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ['error', 'warn'] });

module.exports = prisma;
