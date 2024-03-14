const { v4: uuidv4 } = require('uuid');
const db = require('../util/db');
const prisma = db.prisma;

const generateApiKey = () => uuidv4();

const isAdmin = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user?.admin || false;
  } catch (error) {
    console.error('Error in isAdmin:', error);
    return false;
  }
};

const getApiKeyById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user?.apiKey;
  } catch (error) {
    console.error('Error in getApiKeyById:', error);
    return null;
  }
};

const verifyApiKey = async (apiKey) => {
  try {
    const user = await prisma.user.findFirst({
      where: { apiKey: apiKey },
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
      where: { apiKey: apiKey },
    });
  } catch (error) {
    console.error('Error in getUserByApiKey:', error);
    return null;
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
    console.error('Error in newApiKey:', error);
    return null;
  }
};

const getUserByUsername = async (username) => {
  try {
    return await prisma.user.findUnique({ where: { username: username }});
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    return null;
  }
};

const getUserById = async (id) => {
  try {
    return await prisma.user.findUnique({ where: { id: id }});
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
};

const getUserByDiscordId = async (discordId) => {
  try {
    return await prisma.user.findFirst({
      where: { discordId: { equals: discordId, not: null } },
    });
  } catch (error) {
    console.error('Error in getUserByDiscordId:', error);
    return null;
  }
};

const getAllUsers = async () => {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return null;
  }
};

const createUser = async ({ username, hashedPw }) => {
  try {
    const apiKey = generateApiKey();
    const user = await prisma.user.create({
      data: { username, hashedPw, apiKey },
      include: { Profile: true },
    });
    return user;
  } catch (error) {
    console.error('Error in createUser:', error);
    return null;
  }
};

const createUserDiscord = async ({ discordId, username, avatar, email }) => {
  try {
    const apiKey = generateApiKey();
    const user = await prisma.user.create({
      data: { discordId, username, apiKey },
      include: { Profile: true },
    });
    return user;
  } catch (error) {
    console.error('Error in createUserDiscord:', error);
    return null;
  }
};

const deleteUserById = async (userId) => {
  try {
    await prisma.user.delete({ where: { id: userId } });
    // Consider deleting profiles too, if needed
    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error in deleteUserById:', error);
    return { error: 'Error deleting user' };
  }
};

module.exports = {
  getApiKeyById,
  verifyApiKey,
  newApiKey,
  getUserByApiKey,
  getUserByUsername,
  getAllUsers,
  createUser,
  getUserById,
  getUserByDiscordId,
  createUserDiscord,
  isAdmin,
  deleteUserById,
};
