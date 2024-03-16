const prisma = require('../util/db').prisma;

const getMapIdById = async (mapId) => {
  try {
    return await prisma.mapArt.findUnique({
      where: { id: mapId }
    });
  } catch (error) {
    console.error('Error in getMapIdById:', error);
    throw error;
  }
};

const createMapId = async ({ userId, username, name, description, mapId, imgUrl, hash, server }) => {
  try {
    return await prisma.mapArt.create({
      data: {
        user: {
          connect: {
            id: userId
          }
        },
        username: username,
        name: name,
        description: description,
        mapId: mapId,
        imgUrl: imgUrl,
        hash: hash,
        server: server,
      }
    });
  } catch (error) {
    console.error('Error in createMapId:', error);
    throw error;
  }
};

const countMapIdsByServer = async (server) => {
  try {
    const count = await prisma.mapArt.count({
      where: {
        server: server,
      },
    });
    return count;
  } catch (error) {
    console.error('Error counting map IDs by server:', error);
    throw error;
  }
};

module.exports = {
  getMapIdById,
  createMapId,
  countMapIdsByServer,
};