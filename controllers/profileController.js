const profileModel = require('../models/profileModel');
const mapIdModel = require('../models/mapIdModel');

const getProfileById = async (userId) => {
  try {
    return await profileModel.getProfileById(userId);
  } catch (error) {
    console.error('Error in getProfileById:', error);
    throw error;
  }
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
  try {
    return await profileModel.createProfile({
      userId,
      username,
      location,
      email,
      mcUid,
      joinDate,
      lastSeenDate
    });
  } catch (error) {
    console.error('Error in createProfile:', error);
    throw error;
  }
};

const updateProfile = async (userId, {
  username,
  location,
  email,
  discordId,
  mcUuid,
  lastSeenDate,
  avatar,
  bio
}) => {
  try {
    return await profileModel.updateProfile(userId, {
      username,
      location,
      email,
      discordId,
      mcUuid,
      lastSeenDate,
      avatar,
      bio
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
};

const incrementMapViews = async (userId) => {
  try {
    return await profileModel.incrementMapViews(userId);
  } catch (error) {
    console.error('Error incrementing profile views:', error);
    throw error;
  }
};

const updateUsername = async (userId, username) => {
  try {
    return await profileModel.updateUsername(userId, username);
  } catch (error) {
    console.error('Error in updateUsername:', error);
    throw error;
  }
};

const updateLocation = async (userId, location) => {
  try {
    return await profileModel.updateLocation(userId, location);
  } catch (error) {
    console.error('Error in updateLocation:', error);
    throw error;
  }
};

const updateEmail = async (userId, email) => {
  try {
    return await profileModel.updateEmail(userId, email);
  } catch (error) {
    console.error('Error in updateEmail:', error);
    throw error;
  }
};

const updateMcUid = async (userId, mcUid) => {
  try {
    return await profileModel.updateMcUid(userId, mcUid);
  } catch (error) {
    console.error('Error in updateMcUid:', error);
    throw error;
  }
};

const updateLastSeen = async (userId, lastSeenDate) => {
  try {
    return await profileModel.updateLastSeen(userId, lastSeenDate);
  } catch (error) {
    console.error('Error in updateLastSeen:', error);
    throw error;
  }
};

const updateBio = async (userId, bio) => {
  try {
    return await profileModel.updateBio(userId, bio);
  } catch (error) {
    console.error('Error in updateBio:', error);
    throw error;
  }
};

const updateAvatar = async (userId, avatar) => {
  try {
    return await profileModel.updateAvatar(userId, avatar);
  } catch (error) {
    console.error('Error in updateAvatar:', error);
    throw error;
  }
};

const updateLinks = async (userId, links) => {
  try {
    return await profileModel.updateLinks(userId, links);
  } catch (error) {
    console.error('Error in updateLinks:', error);
    throw error;
  }
};

const getAllMapsForUserId = async (userId) => {
  try {
    return await mapIdModel.getAllMapsForUserId(userId);
  } catch (error) {
    console.error('Error in getAllMapsForUserId:', error);
    throw error;
  }
};

module.exports = {
  getProfileById,
  createProfile,
  updateProfile,
  incrementMapViews,
  updateUsername,
  updateLocation,
  updateEmail,
  updateMcUid,
  updateLastSeen,
  updateBio,
  updateAvatar,
  updateLinks,
  getAllMapsForUserId,
};