/**
 * Run from backend folder: node scripts/check-db.js
 * Checks DATABASE_URL and Prisma connection (does not print secrets).
 */
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.log('Missing DATABASE_URL in .env');
  process.exit(1);
}

async function main() {
  const { getPrisma } = require('../config/prisma');
  const prisma = getPrisma();

  // Simple connectivity check
  await prisma.$queryRaw`SELECT 1`;
  console.log('Prisma OK – connected');
}

main().catch((err) => {
  console.log('DB check failed:', err.message);
  process.exit(1);
});

