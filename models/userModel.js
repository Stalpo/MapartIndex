const db = require('../util/db');
const prisma = db.prisma;
const profileModel = require('./profileModel');
const getUserByUsername = async (username) => {
  return prisma.user.findUnique({ where: { username: username }});
};

const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id : id }});
};

const getUserByDiscordId = async (discordId) => {
return prisma.user.findUnique({ where: { discordId: discordId }});
}

const createUser = async ({ username, hashedPw }) => {
  await prisma.user.create({ data: { username, hashedPw }});
};
const createUserDiscord = async ({ discordId, username, avatar, email }) => {
  const user = await prisma.user.create({ data: { discordId, username }});
  await prisma.profile.create({data: {userId: user.id,avatar: avatar,email: email,username: username}});
}

module.exports = {
  getUserByUsername,
  createUser,
  getUserById,
  getUserByDiscordId,
  createUserDiscord,
};