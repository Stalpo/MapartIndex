const {PrismaClient} = require("../prisma/src/generated/client");
let prisma = new PrismaClient();
module.exports = { prisma };