const { Pool } = require('pg');
require('dotenv').config();

async function test() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });

  try {
    console.log('Testing PG Pool connection...');
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
