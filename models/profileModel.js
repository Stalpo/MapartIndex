const db = require('../util/db');
const prisma = db.prisma;

const getProfileById = async (userId) => {
  return prisma.profile.findUnique({
    where: {
      userId
    }
  });
};

const createProfile = async ({
  userId,
  username,
  location,
  email,
  discordId,
  mcUid,
  joinDate,
  lastSeenDate
}) => {
  await prisma.profile.create({
    data: {
      userId,
      username,
      location,
      email,
      discordId,
      mcUid,
      joinDate,
      lastSeenDate
    }
  });
};

const updateProfile = async (userId, {
  username,
  location,
  email,
  discordId,
  mcUid,
  lastSeenDate
}) => {
  await prisma.profile.update({
    where: {
      userId
    },
    data: {
      username,
      location,
      email,
      discordId,
      mcUid,
      lastSeenDate
    }
  });
};

module.exports = {
  getProfileById,
  createProfile,
  updateProfile,
};