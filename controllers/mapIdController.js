const mapIdModel = require('../models/mapIdModel');

const getMaps = async (page, perPage, user, artist, sort) => {
  try {
    const maps = await mapIdModel.getMaps(page, perPage, user, artist, sort);
    return maps;
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

const getAllMaps = async () => {
  try {
    return await mapIdModel.getAllMaps();
  } catch (error) {
    console.error('Error fetching all maps:', error);
    throw error;
  }
};

const getMapById = async (mapId) => {
  try {
    return await mapIdModel.getMapIdById(mapId);
  } catch (error) {
    console.error('Error fetching map by ID:', error);
    throw error;
  }
};

const createMapId = async ({ userId, username, mapId, imgUrl, hash }) => {
  try {
    return await mapIdModel.createMapId({
      userId,
      username,
      mapId,
      imgUrl,
      hash
    });
  } catch (error) {
    console.error('Error creating map ID:', error);
    throw error;
  }
};

const updateMapById = async (mapId, { artist, nsfw, mapArtData }) => {
  try {
    return await mapIdModel.updateMapById(mapId, {
      artist,
      nsfw,
      mapArtData,
    });
  } catch (error) {
    console.error('Error updating map by ID:', error);
    throw error;
  }
};

const deleteMapById = async (mapId) => {
  try {
    return await mapIdModel.deleteMapById(mapId);
  } catch (error) {
    console.error('Error deleting map by ID:', error);
    throw error;
  }
};

const getMapIdByHash = async (hash) => {
  try {
    return await mapIdModel.getMapIdByHash(hash);
  } catch (error) {
    console.error('Error fetching map ID by hash:', error);
    throw error;
  }
};

const getMapsByOwnerId = async (ownerId) => {
  try {
    return await mapIdModel.getMapsByOwnerId(ownerId);
  } catch (error) {
    console.error('Error fetching maps by owner ID:', error);
    throw error;
  }
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