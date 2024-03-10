const { PrismaClient } = require('../prisma/src/generated/client');

const prisma = new PrismaClient();

module.exports = {
  prisma,
};