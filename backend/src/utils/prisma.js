const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

/**
 * Singleton pattern for PrismaClient to prevent multiple instances
 * and connection pool leaks in serverless / Vercel environments.
 */
if (!global.prismaInstance) {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const obscuredUrl = dbUrl.replace(/\/\/.*@/, '//****:****@');
    console.log(`[Database] Initializing with URL: ${obscuredUrl}`);
  } else {
    console.error('[Database] CRITICAL: DATABASE_URL is missing!');
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }, // Required for AWS RDS
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 10000,
    max: 10 // Limit pool size for serverless
  });

  pool.on('error', (err) => {
    console.error('[Database] Unexpected pool error:', err.message);
  });

  const adapter = new PrismaPg(pool);
  global.prismaInstance = new PrismaClient({ 
    adapter,
    log: ['error', 'warn']
  });

  // Warm up connection
  global.prismaInstance.$connect()
    .then(() => console.log('[Database] Connected successfully'))
    .catch((err) => console.error('[Database] Connection failed:', err.message));
}

module.exports = global.prismaInstance;
