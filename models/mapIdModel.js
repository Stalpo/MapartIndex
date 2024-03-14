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

// New method for api call
const getMaps = async (page, perPage, user, artist, sort) => {
  try {
    const where = {};

    // Apply filtering criteria
    if (user) {
      where.username = user;
    }
    if (artist) {
      where.artist = artist;
    }

    // Apply sorting criteria
    let orderBy;
    switch (sort) {
      case 'nameAsc':
        orderBy = { artist: 'asc' };
        break;
      case 'nameDesc':
        orderBy = { artist: 'desc' };
        break;
      case 'dateAsc':
        orderBy = { createdAt: 'asc' };
        break;
      case 'dateDesc':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Adjust pagination if necessary
    let skip = 0;
    let take = Number.MAX_SAFE_INTEGER; // Maximum safe integer if listing all maps
    if (page && perPage) {
      skip = (page - 1) * perPage;
      take = perPage;
    } else if (page && !perPage) {
      // If page is provided but perPage is not, use a default value for perPage
      take = 25; // Default value for perPage
      skip = (page - 1) * take;
    }

    // Fetch maps with pagination, filtering, and sorting
    const maps = await prisma.mapId.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return maps;
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

const createMapId = async ({ userId, username, mapId, imgUrl, hash }) => {
  return await prisma.mapId.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      username: username,
      mapId: mapId,
      imgUrl: imgUrl,
      hash: hash,
    }
  });
};

const updateMapById = async (mapId, { artist, nsfw, mapArtData }) => {
  return await prisma.mapId.update({
    where: { id: mapId },
    data: {
      artist,
      nsfw,
      Map: {
        update: mapArtData,
      },
    },
  });
};

const deleteMapById = async (mapId) => {
  try {
    return await prisma.mapId.delete({ where: { id: mapId } });
  } catch (error) {
    console.error('Error in deleteMapId:', error);
    throw error;
  }
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
      Map: true,
    },
  });
};

module.exports = {
  getMapIdById,
  getAllMaps,
  getMaps,
  createMapId,
  updateMapById,
  deleteMapById,
  getMapIdByHash,
  getAllMapsForUserId,
};
