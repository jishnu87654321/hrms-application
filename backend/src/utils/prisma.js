const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const fs = require('fs');
const path = require('path');

// Load the AWS RDS valid certificate
const certPath = path.join(__dirname, '../../certs/global-bundle.pem');
const caCert = fs.existsSync(certPath) ? fs.readFileSync(certPath).toString() : undefined;

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false, 
    ca: caCert 
  }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
