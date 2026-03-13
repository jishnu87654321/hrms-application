const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ── Same SSL config the backend uses ─────────────────────────────
const certPath = path.join(__dirname, '../certs/global-bundle.pem');
const caCert = fs.existsSync(certPath) ? fs.readFileSync(certPath).toString() : undefined;

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    ca: caCert,
  },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // ── 1. Create / upsert Admin User ──────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hrms.com' },
    update: {},
    create: {
      email:    'admin@hrms.com',
      fullName: 'Super Admin',
      password: hashedPassword,
      role:     'ADMIN',
    },
  });
  console.log(`✔  User table      → id: ${admin.id}`);

  // ── 2. Create / upsert AdminDetail (separate table in AWS) ─────
  const adminDetail = await prisma.adminDetail.upsert({
    where:  { userId: admin.id },
    update: {},          // don't overwrite existing data
    create: {
      userId:        admin.id,
      phoneNumber:   '+91-9876543210',
      officeAddress: 'HQ, Block A, Tech Park, Bengaluru - 560001',
      permissions: [
        'MANAGE_EMPLOYEES',
        'BULK_UPLOAD',
        'VIEW_AUDIT_LOGS',
        'MANAGE_DEPARTMENTS',
        'MANAGE_USERS',
      ],
      settings: {
        theme:         'dark',
        language:      'en',
        timezone:      'Asia/Kolkata',
        notifications: true,
      },
    },
  });
  console.log(`✔  AdminDetail table → id: ${adminDetail.id}`);

  // ── 3. Verify: read it back ────────────────────────────────────
  const fetched = await prisma.adminDetail.findUnique({
    where:   { userId: admin.id },
    include: { user: { select: { email: true, fullName: true, role: true } } },
  });
  console.log('\n📋 AdminDetail record stored in AWS RDS:');
  console.log(JSON.stringify(fetched, null, 2));

  // ── No separate Departments table in schema ────────────────────

  console.log('\n─────────────────────────────────────────────');
  console.log('  🌱 Seed completed — all data stored in AWS');
  console.log('  Admin email    : admin@hrms.com');
  console.log('  Admin password : admin123');
  console.log('─────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message || e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
