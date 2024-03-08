const profileModel = require('../models/profileModel');

const getProfileById = async (userId) => {
  return profileModel.getProfileById(userId);
};

const createProfile = async ({
  userId,
  username,
  location,
  email,
  mcUid,
  joinDate,
  lastSeenDate
}) => {
  await profileModel.createProfile({
    userId,
    username,
    location,
    email,
    mcUid,
    joinDate,
    lastSeenDate
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
  await profileModel.updateProfile(userId, {
    username,
    location,
    email,
    discordId,
    mcUid,
    lastSeenDate
  });
};

module.exports = {
  getProfileById,
  createProfile,
  updateProfile,
};