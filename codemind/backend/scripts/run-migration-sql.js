/**
 * Run the initial migration SQL against DATABASE_URL.
 * Use this if "prisma db push" or "prisma migrate deploy" fail (e.g. with pooler).
 * From backend folder: node scripts/run-migration-sql.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Missing DATABASE_URL in .env');
  process.exit(1);
}

const sqlPath = path.join(__dirname, '../prisma/migrations/0_init/migration.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

async function main() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));
  try {
    for (const statement of statements) {
      if (!statement) continue;
      try {
        await prisma.$executeRawUnsafe(statement + ';');
      } catch (e) {
        if (e.message && (e.message.includes('already exists') || e.message.includes('duplicate key'))) {
          // ignore
        } else throw e;
      }
    }
    console.log('Migration SQL applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
