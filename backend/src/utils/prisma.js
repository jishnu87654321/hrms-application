console.log('Prisma Utils: Initializing...');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// SSL Certificate for RDS
let ca;
const certPath = path.resolve(__dirname, '../../certs/global-bundle.pem');
console.log('Prisma Utils: Checking for cert at', certPath);

if (fs.existsSync(certPath)) {
  try {
    ca = fs.readFileSync(certPath).toString();
    console.log('SSL certificate loaded successfully');
  } catch (err) {
    console.error('Failed to read SSL certificate:', err.message);
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: ca ? { ca, rejectUnauthorized: false } : { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 10000
});

console.log('Prisma Utils: Creating Prisma client with driver adapter...');
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ['error', 'warn'] });

module.exports = prisma;
