const prisma = require('../util/db').prisma;

const getMapIdById = async (mapId) => {
  return await prisma.mapId.findUnique({
    where: { id: mapId }
  });
};

const getAllMaps = async () => {
  try {
    const maps = await prisma.mapId.findMany({
      where: {
        userId: {
          not: null,
        },
      },
      include: {
        Map: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return maps;
  } catch (error) {
    console.error('Error fetching all maps:', error);
    throw error;
  }
};

const getPaginatedMaps = async (currentPage, perPage) => {
  try {
    const offset = (currentPage - 1) * perPage;
    const maps = await prisma.mapId.findMany({
      where: {
        userId: {
          not: null,
        },
      },
      skip: offset,
      take: perPage,
      include: {
        Map: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return maps;
  } catch (error) {
    console.error('Error fetching paginated maps:', error);
    throw error;
  }
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

const getAllMapsForUserId = async (userId) => {
  return await prisma.mapId.findMany({
    where: {
      userId: userId,
    },
    include: {
      Map: true, // Include the associated MapArt details
    },
  });
};

module.exports = {
  getMapIdById,
  getAllMaps,
  getPaginatedMaps,
  createMapId,
  updateMapId,
  getMapIdByHash,
  getAllMapsForUserId,
};
