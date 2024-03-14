const mapIdModel = require('../models/mapIdModel');

const getMapById = async (mapId) => {
  return await mapIdModel.getMapIdById(mapId);
};

const getAllMaps = async () => {
  return await mapIdModel.getAllMaps();
};

// New method for api call
const getMaps = async (page, perPage, user, artist, sort) => {
  try {
    const maps = await mapIdModel.getMaps(page, perPage, user, artist, sort);
    return maps;
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

const createMapId = async ({ userId, username, mapId, imgUrl, hash }) => {
  return await mapIdModel.createMapId({
    userId,
    username,
    mapId,
    imgUrl,
    hash
  });
};

const updateMapById = async (mapId, { artist, nsfw, mapArtData }) => {
  try {
    const result = await mapIdModel.updateMapById(mapId, {
      artist,
      nsfw,
      mapArtData,
    });

    return result;
  } catch (error) {
    console.error('Error updating map:', error);
    throw error;
  }
};

const deleteMapById = async (mapId) => {
  try {
    return await mapIdModel.deleteMapById(mapId);
  } catch (error) {
    console.error('Error in deleteMapId:', error);
    throw error;
  }
};

const getMapIdByHash = async (hash) => {
  return await mapIdModel.getMapIdByHash(hash);
};

const getMapsByOwnerId = async (ownerId) => {
  return mapIdModel.getMapsByOwnerId(ownerId);
};

module.exports = {
  getMapById,
  getAllMaps,
  getMaps,
  createMapId,
  updateMapById,
  deleteMapById,
  getMapIdByHash,
  getMapsByOwnerId,
};
