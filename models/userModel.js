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

const isMod = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user?.mod || false;
  } catch (error) {
    console.error('Error in isMod:', error);
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

const getUsernameById = async (id) => {
  try {
    if (!id) {
      return null;
    }
    const user = await prisma.user.findUnique({
      where: {
        id: String(id)
      }
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user.username;
  } catch (error) {
    console.error('Error in getUsernameById:', error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    if (!id) {
      return null;
    }
    return await prisma.user.findUnique({
      where: {
        id: String(id)
      }
    });
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
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
      data: {
        discordId,
        username,
        apiKey,
        Profile: {
          create: {
            email,
            username,
            avatar
          }
        }
      },
    });
    return user;
  } catch (error) {
    console.error('Error in createUserDiscord:', error);
    return null;
  }
};

const updateUserDiscordInfo = async (userId, { discordId, username, avatar, email }) => {
  try {
    // Update user information with Discord data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        discordId: discordId,
        username: username,
        hashedPw: null,
        Profile: {
          update: {
            username,
            avatar,
            email
          }
        }
      },
    });
    return updatedUser;
  } catch (error) {
    console.error('Error in updateUserDiscordInfo:', error);
    throw error;
  }
};

const updateUserPassword = async (userId, hashedPassword) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { hashedPw: hashedPassword },
    });

    return updatedUser;
  } catch (error) {
    console.error('Error in updateUserPassword:', error);
    return null;
  }
};

const deleteUserById = async (userId) => {
  try {
    await prisma.user.delete({ where: { id: userId } });
    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error in deleteUserById:', error);
    return { error: 'Error deleting user' };
  }
};

module.exports = {
  isAdmin,
  isMod,
  getApiKeyById,
  verifyApiKey,
  getUserByApiKey,
  newApiKey,
  getUserByUsername,
  getUsernameById,
  getUserById,
  getUserByDiscordId,
  getAllUsers,
  createUser,
  createUserDiscord,
  updateUserDiscordInfo,
  updateUserPassword,
  deleteUserById,
};
