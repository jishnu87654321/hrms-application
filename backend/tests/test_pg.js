const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function test() {
  let ca;
  const certPath = path.resolve(__dirname, '../certs/global-bundle.pem');
  if (fs.existsSync(certPath)) {
    ca = fs.readFileSync(certPath).toString();
    console.log('Cert loaded.');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: ca ? { ca, rejectUnauthorized: false } : { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });

  try {
    console.log('Testing PG Pool connection with SSL...');
    const client = await pool.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('QUERY RES:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('PG CONNECTION ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

test();
