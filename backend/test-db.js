const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const certPath = path.join(__dirname, 'certs', 'global-bundle.pem');
  const caCert = fs.existsSync(certPath) ? fs.readFileSync(certPath).toString() : undefined;

  // Uses values from your script (we also stored this in .env)
  const client = new Client({
    host: 'database-1.c786aiyau0wb.eu-north-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'jishnu1234',
    ssl: { rejectUnauthorized: false, ca: caCert }
  });

  try {
    await client.connect();
    console.log("Successfully connected to the AWS database!");
    const res = await client.query('SELECT version()');
    console.log(res.rows[0].version);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch(console.error);
