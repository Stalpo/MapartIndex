const db = require('../util/db');
const prisma = db.prisma;

const getMapIdById = async (mapId) => {
  return await prisma.mapId.findUnique({
    where: { id: mapId }
  });
};

const createMapId = async ({ userId, mapId, imgUrl, hash }) => {
  return await prisma.mapId.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      mapId: mapId,
      imgUrl: imgUrl,
      hash: hash,
    }
  });
};

const updateMapId = async (mapId, { uploaderId, imgUrl, data }) => {
  return await prisma.mapId.update({
    where: { id: mapId },
    data: {
      uploaderId,
      imgUrl
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
