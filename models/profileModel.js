const db = require('../util/db');
const prisma = db.prisma;

const getProfileById = async (userId) => {
  try {
    return await prisma.profile.findUnique({
      where: { userId }
    });
  } catch (error) {
    console.error('Error in getProfileById:', error);
    return null;
  }
};

const createProfile = async ({ userId, username }) => {
  try {
    // Create the profile with the provided userId and username
    await prisma.profile.create({ data: { userId, username } });
  } catch (error) {
    console.error('Error in createProfile:', error);
    throw error;
  }
};

const updateProfile = async (userId, {
  username,
  location,
  email,
  mcUuid,
  lastSeen,
  bio,
  avatar,
}) => {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: {
        username,
        location,
        email,
        mcUuid,
        lastSeen,
        bio,
        avatar,
      }
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return null;
  }
};

const incrementProfileViews = async (userId) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: userId }
    });
    const views = profile.views + 1;
    return await prisma.profile.update({
      where: { id: userId },
      data: {
        views,
      },
    });
  } catch (error) {
    console.error('Error in incrementProfileViews:', error);
    throw error;
  }
};


const updateUsername = async (userId, username) => {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: { username }
    });
  } catch (error) {
    console.error('Error in updateUsername:', error);
    return null;
  }
};

const updateLocation = async (userId, location) => {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: { location }
    });
  } catch (error) {
    console.error('Error in updateLocation:', error);
    return null;
  }
};

const updateEmail = async (userId, email) => {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: { email }
    });
  } catch (error) {
    console.error('Error in updateEmail:', error);
    return null;
  }
};

const updateMcUuid = async (userId, mcUuid) => {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: { mcUuid }
    });
  } catch (error) {
    console.error('Error in updateMcUuid:', error);
    return null;
  }
};

const updateLastSeen = async (userId, lastSeen) => {
    try {
      // Check if the profile exists
      const existingProfile = await prisma.profile.findUnique({
        where: { userId },
      });
  
      // If the profile doesn't exist, handle the error accordingly
      if (!existingProfile) {
        console.error(`Profile not found for userId: ${userId}`);
        throw new Error(`Profile not found for userId: ${userId}`);
      }
  
      // Update the lastSeen field
      return await prisma.profile.update({
        where: { userId },
        data: { lastSeen },
      });
    } catch (error) {
      console.error('Error in updateLastSeen:', error);
      throw error;
    }
  };

const updateBio = async (userId, bio) => {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: { bio }
    });
  } catch (error) {
    console.error('Error in updateBio:', error);
    return null;
  }
};

const updateAvatar = async (userId, avatar) => {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: { avatar }
    });
  } catch (error) {
    console.error('Error in updateAvatar:', error);
    return null;
  }
};

const updateLinks = async (userId, links) => {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: { links }
    });
  } catch (error) {
    console.error('Error in updateLinks:', error);
    return null;
  }
};

module.exports = {
  getProfileById,
  createProfile,
  updateProfile,
  incrementProfileViews,
  updateUsername,
  updateLocation,
  updateEmail,
  updateMcUuid,
  updateLastSeen,
  updateBio,
  updateAvatar,
  updateLinks,
};