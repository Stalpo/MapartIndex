const db = require('../util/db');
const prisma = db.prisma;

// const profileModel = require('./profileModel');

const getUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({ where: { username: username }});
  return user;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id : id }});
  return user;
};

const getUserByDiscordId = async (discordId) => {
  const user = await prisma.user.findFirst({
    where: {
      discordId: {
        equals: discordId,
        not: null, // Exclude users with null Discord IDs
      },
    },
  });

  return user;
};

const createUser = async ({ username, hashedPw }) => {
  const user = await prisma.user.create({ data: { username, hashedPw }});
  await prisma.profile.create({ data: { userId: user.id,  username: username }});
  return user;
};

const createUserDiscord = async ({ discordId, username, avatar, email }) => {
  const user = await prisma.user.create({ data: { discordId, username }});
  await prisma.profile.create({ data: { userId: user.id, avatar: avatar, email: email, username: username }});
  return user;
};

module.exports = {
  getUserByUsername,
  createUser,
  getUserById,
  getUserByDiscordId,
  createUserDiscord,
};