const db = require('../util/db');
const prisma = db.prisma;

const getProfileById = async (userId) => {
  return await prisma.profile.findUnique({
    where: { userId }
  });
};

const createProfile = async ( { userId } ) => { await prisma.profile.create(userId); };

const updateProfile = async (userId, {
  username,
  location,
  email,
  mcUuid,
  lastSeen,
  bio,
  avatar,
}) => {
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
};

const updateUsername = async (userId, username) => {
    return await prisma.profile.update({
        where: { userId },
        data: { username }
    });

}
const updateLocation = async (userId, location) => {
    return await prisma.profile.update({
        where: { userId },
        data: { location }
    });

}
const updateEmail = async (userId, email) => {
    return await prisma.profile.update({
        where: { userId },
        data: { email }
    });
}
const updateMcUuid = async (userId, mcUuid) => {
    return await prisma.profile.update({
        where: { userId },
        data: { mcUuid }
    });
}
const updateLastSeen = async (userId, lastSeen) => {
    return await prisma.profile.update({
        where: { userId },
        data: { lastSeen }
    });
}
const updateBio = async (userId, bio) => {
    return await prisma.profile.update({
        where: { userId },
        data: { bio }
    });
}
const updateAvatar = async (userId, avatar) => {
    return await prisma.profile.update({
        where: { userId },
        data: { avatar }
    });
}
const updateLinks = async (userId, links) => {
    return await prisma.profile.update({
        where: { userId },
        data: { links }
    });
}

module.exports = {
  getProfileById,
  createProfile,
  updateProfile,
  updateUsername,
  updateLocation,
  updateEmail,
  updateMcUuid,
  updateLastSeen,
  updateBio,
  updateAvatar,
  updateLinks,
};