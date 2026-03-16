const { PrismaClient } = require('@prisma/client');

let _prisma = null;

function getPrisma() {
  if (!_prisma) _prisma = new PrismaClient();
  return _prisma;
}

module.exports = { getPrisma };

