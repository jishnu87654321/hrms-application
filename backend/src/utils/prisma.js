const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// SSL Certificate for RDS
const possibleCertPaths = [
  path.resolve(__dirname, '../../certs/global-bundle.pem'),
  path.resolve(process.cwd(), 'certs/global-bundle.pem'),
  path.resolve(process.cwd(), 'backend/certs/global-bundle.pem')
];

let ca;
for (const p of possibleCertPaths) {
  if (fs.existsSync(p)) {
    ca = fs.readFileSync(p).toString();
    console.log(`Found certificate at: ${p}`);
    break;
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: ca ? { rejectUnauthorized: false, ca } : false
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ['error', 'warn'] });

module.exports = prisma;
