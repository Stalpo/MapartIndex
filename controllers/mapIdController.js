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
  getMapById,
  getAllMaps,
  getPaginatedMaps,
  createMapId,
  updateMapId,
  getMapIdByHash,
};
