const db = require('../util/db');
const prisma = db.prisma;

const getMapIdById = async (mapId) => {
  return await prisma.mapId.findUnique({
    where: { id: mapId }
  });
};

const createMapId = async ({ creatorId, mapId, imgUrl, data, hash }) => {
  return await prisma.mapId.create({
    data: {
      creatorId,
      mapId,
      imgUrl,
      data,
      hash
    }
  });
};

const updateMapId = async (mapId, { creatorId, imgUrl, data }) => {
  return await prisma.mapId.update({
    where: { id: mapId },
    data: {
      creatorId,
      imgUrl,
      data
    }
  });
};

const getMapIdByHash = async (hash) => {
  return await prisma.mapId.findFirst({
    where: { hash }
  });
};

module.exports = {
  getMapIdById,
  createMapId,
  updateMapId,
  getMapIdByHash,
};
