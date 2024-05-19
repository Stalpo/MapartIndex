const db = require('../util/db');
const prisma = db.prisma;

const createServer = async ({ name, discord }) => {
  try {
    const user = await prisma.server.create({
      data: { name, discord },
    });
    return user;
  } catch (error) {
    console.error('Error in createServer:', error);
    return null;
  }
};

const getServerByName = async (name) => {
  try {
    return await prisma.server.findUnique({
      where: { name }
    });
  } catch (error) {
    console.error('Error in getServerByName:', error);
    return null;
  }
};

module.exports = {
  getServerByName,
  createServer,
};