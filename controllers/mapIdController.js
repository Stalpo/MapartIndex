const mapIdModel = require('../models/mapIdModel');

const getMapIdById = async (mapId) => {
  return await mapIdModel.getMapIdById(mapId);
};

const createMapId = async ({ creatorId, mapId, imgUrl, data, hash }) => {
  return await mapIdModel.createMapId({
    creatorId,
    mapId,
    imgUrl,
    data,
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

const getAllMapIds = async () => {
  return mapIdModel.getAllMapIds();
};

const getMapsByOwnerId = async (ownerId) => {
  return mapIdModel.getMapsByOwnerId(ownerId);
};

module.exports = {
  getMapIdById,
  createMapId,
  updateMapId,
  getMapIdByHash,
  getAllMapIds,
  getMapsByOwnerId,
};
