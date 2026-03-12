const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// SSL Certificate for RDS
const certPath = path.resolve(__dirname, '../../certs/global-bundle.pem');
const ca = fs.existsSync(certPath) ? fs.readFileSync(certPath).toString() : undefined;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: ca ? { rejectUnauthorized: false, ca } : false
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ['error', 'warn'] });

module.exports = prisma;
