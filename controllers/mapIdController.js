const mapIdModel = require('../models/mapIdModel');

const getMapIdById = async (mapId) => {
  return await mapIdModel.getMapIdById(mapId);
};

const getAllMaps = async () => {
  return await mapIdModel.getAllMaps();
};

const createMapId = async ({ userId, mapId, imgUrl, hash }) => {
  return await mapIdModel.createMapId({
    userId,
    mapId,
    imgUrl,
    hash
  });
};

const updateMapId = async (mapId, { creatorId, imgUrl, data }) => {
  return await mapIdModel.updateMapId(mapId, {
    creatorId,
    imgUrl,
    data
  });
};

const getMapIdByHash = async (hash) => {
  return await mapIdModel.getMapIdByHash(hash);
};

module.exports = {
  getMapIdById,
  getAllMaps,
  createMapId,
  updateMapId,
  getMapIdByHash,
};
