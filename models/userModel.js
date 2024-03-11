const db = require('../util/db');
const prisma = db.prisma;

const { v4: uuidv4 } = require('uuid');

const generateApiKey = () => {
  return uuidv4();
};

const getApiKeyById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user.apiKey;
  } catch (error) {
    console.error('Error in getApiKeyById:', error);
    return null;
  }
};

const verifyApiKey = async (apiKey) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        apiKey: {
          equals: apiKey,
        },
      },
    });
    return !!user;
  } catch (error) {
    console.error('Error in verifyApiKey:', error);
    return false;
  }
};

const getUserByApiKey = async (apiKey) => {
  try {
    return await prisma.user.findFirst({
      where: {
        apiKey: {
          equals: apiKey,
        },
      },
    });
  } catch (error) {
    console.error('Error in getUserByApiKey:', error);
    return false;
  }
};

const newApiKey = async (userId) => {
  try {
    const newApiKey = generateApiKey();
    await prisma.user.update({
      where: { id: userId },
      data: { apiKey: newApiKey },
    });
    return newApiKey;
  } catch (error) {
    console.error('Error in renewApiKey:', error);
    return null;
  }
};

const isAdmin = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user.admin;
  } catch (error) {
    console.error('Error in isAdmin:', error);
    return false;
  }
};

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
        not: null,
      },
    },
  });

  return user;
};

const createUser = async ({ username, hashedPw }) => {
  const apiKey = generateApiKey();
  const user = await prisma.user.create({ data: { username, hashedPw, apiKey }});
  await prisma.profile.create({ data: { userId: user.id, username: username }});
  return user;
};

const createUserDiscord = async ({ discordId, username, avatar, email }) => {
  const apiKey = generateApiKey();
  const user = await prisma.user.create({ data: { discordId, username, apiKey }});
  await prisma.profile.create({ data: { userId: user.id, avatar: avatar, email: email, username: username }});
  return user;
};

module.exports = {
  isAdmin,
  getApiKeyById,
  verifyApiKey,
  newApiKey,
  getUserByUsername,
  createUser,
  getUserById,
  getUserByDiscordId,
  createUserDiscord,
  getUserByApiKey,
};