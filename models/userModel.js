const db = require('../util/db');
const prisma = db.prisma;
const getUserByUsername = async (username) => {
  return prisma.user.findUnique({ where: { username: username }});
};

const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id : id }});
};

const createUser = async ({ username, hashedPw }) => {
  await prisma.user.create({ data: { username, hashedPw }});
};

module.exports = {
  getUserByUsername,
  createUser,
  getUserById,
};