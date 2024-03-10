const profileModel = require('../models/profileModel');
const mapIdModel = require('../models/mapIdModel');

const getProfileById = async (userId) => {
  return await profileModel.getProfileById(userId);
};

const getAllMapsForUserId = async (userId) => {
  return await mapIdModel.getAllMapsForUserId(userId);
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
  return await profileModel.createProfile({
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
  lastSeenDate,
  bio
}) => {
  return await profileModel.updateProfile(userId, {
    username,
    location,
    email,
    discordId,
    mcUid,
    lastSeenDate,
    bio
  });
};

const updateUsername = async (userId, username) => {
  return await profileModel.updateUsername(userId, username);
};

const updateLocation = async (userId, location) => {
  return await profileModel.updateLocation(userId, location);
};

const updateEmail = async (userId, email) => {
  return await profileModel.updateEmail(userId, email);
};

const updateMcUid = async (userId, mcUid) => {
  return await profileModel.updateMcUid(userId, mcUid);
};

const updateLastSeen = async (userId, lastSeenDate) => {
  return await profileModel.updateLastSeen(userId, lastSeenDate);
};

const updateBio = async (userId, bio) => {
  return await profileModel.updateBio(userId, bio);
};

const updateAvatar = async (userId, avatar) => {
  return await profileModel.updateAvatar(userId, avatar);
};

const updateLinks = async (userId, links) => {
  return await profileModel.updateLinks(userId, links);
};

module.exports = {
  getProfileById,
  getAllMapsForUserId,
  createProfile,
  updateProfile,
  updateUsername,
  updateLocation,
  updateEmail,
  updateMcUid,
  updateLastSeen,
  updateBio,
  updateAvatar,
  updateLinks,
};
