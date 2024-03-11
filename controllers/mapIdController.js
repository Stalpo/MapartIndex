const mapIdModel = require('../models/mapIdModel');

const getMapById = async (mapId) => {
  return await mapIdModel.getMapIdById(mapId);
};

const getAllMaps = async () => {
  return await mapIdModel.getAllMaps();
};

const getPaginatedMaps = async (currentPage, perPage) => {
  return await mapIdModel.getPaginatedMaps(currentPage, perPage);
};

const createMapId = async ({ userId, mapId, imgUrl, hash }) => {
  return await mapIdModel.createMapId({
    userId,
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
    return await mapIdModel.deleteMapId(mapId);
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
  getPaginatedMaps,
  createMapId,
  updateMapById,
  deleteMapById,
  getMapIdByHash,
  getMapsByOwnerId,
};
