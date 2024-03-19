const prisma = require('../util/db').prisma;

const getMapIdById = async (mapId) => {
  try {
    return await prisma.mapId.findUnique({
      where: { id: mapId }
    });
  } catch (error) {
    console.error('Error in getMapIdById:', error);
    throw error;
  }
};

const getMapIdByHash = async (hash) => {
  try {
    return await prisma.mapId.findFirst({
      where: { hash }
    });
  } catch (error) {
    console.error('Error in getMapIdByHash:', error);
    throw error;
  }
};

const getMapByDisplayName = async (displayName) => {
  console.log(displayName);
  try {
    return await prisma.mapId.findFirst({
      where: { displayName }
    });
  } catch (error) {
    console.error('Error in getMapIdByHash:', error);
    throw error;
  }
};

// Getting replaced by getMaps, still here until all references are removed
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

const getAllMapsForUserId = async (userId) => {
  try {
    return await prisma.mapId.findMany({
      where: {
        userId: userId,
      },
      include: {
        Map: true,
      },
    });
  } catch (error) {
    console.error('Error fetching maps for user:', error);
    throw error;
  }
};

const getMaps = async (page, perPage, user, artist, sort, server) => {
  try {
    const where = {};

    // Apply filtering criteria
    if (user) {
      where.username = user;
    }
    if (artist) {
      where.artist = artist;
    }
    if (server) {
      where.server = server;
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

const countMapIdsByServer = async (server) => {
  try {
    const count = await prisma.mapId.count({
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

const countMapIdsByUserId = async (userId) => {
  try {
    const count = await prisma.mapId.count({
      where: {
        userId: userId,
      },
    });
    return count;
  } catch (error) {
    console.error('Error counting map IDs by server:', error);
    throw error;
  }
};

const countMapIds = async () => {
  try {
    const count = await prisma.mapId.count();
    return count;
  } catch (error) {
    console.error('Error counting map IDs by server:', error);
    throw error;
  }
};

const createMapId = async ({ userId, username, mapId, imgUrl, displayName, hash, server, serverId }) => {
  try {
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
        displayName: displayName,
        hash: hash,
        server: server,
        serverId: serverId,
      }
    });
  } catch (error) {
    console.error('Error in createMapId:', error);
    throw error;
  }
};

const updateMapById = async (mapId, { artist, nsfw, tags }) => {
  try {
    let uniqueTags = tags;
    if (uniqueTags) {
      uniqueTags = [...new Set(uniqueTags)];
    }

    return await prisma.mapId.update({
      where: { id: mapId },
      data: {
        artist,
        nsfw,
        tags: uniqueTags,
      },
    });
  } catch (error) {
    console.error('Error in updateMapById:', error);
    throw error;
  }
};

const getUniqueUsernames = async () => {
  try {
    const uniqueUsernames = await prisma.mapId.findMany({
      distinct: ['username'],
      select: {
        username: true,
      },
    });
    return uniqueUsernames.map(({ username }) => username);
  } catch (error) {
    console.error('Error fetching unique usernames:', error);
    throw error;
  }
};

const getUniqueArtists = async () => {
  try {
    const uniqueArtists = await prisma.mapId.findMany({
      distinct: ['artist'],
      select: {
        artist: true,
      },
    });
    return uniqueArtists.map(({ artist }) => artist);
  } catch (error) {
    console.error('Error fetching unique artists:', error);
    throw error;
  }
};

const getUniqueServers = async () => {
  try {
    const uniqueServers = await prisma.mapId.findMany({
      distinct: ['server'],
      select: {
        server: true,
      },
    });
    const filteredServers = uniqueServers.filter(({ server }) => server !== null);
    return filteredServers.map(({ server }) => server);
  } catch (error) {
    console.error('Error fetching unique servers:', error);
    throw error;
  }
};

let highestServerId = 0; // Initialize highestServerId

const getLatestServerIdByServer = async () => {
  try {
    const maxServerIdEntry = await prisma.mapId.findFirst({
      orderBy: {
        serverId: 'desc'
      }
    });

    if (maxServerIdEntry) {
      highestServerId = maxServerIdEntry.serverId; // Update highestServerId
      return highestServerId + 1;
    }
  } catch (error) {
    console.error('Error fetching highest serverId:', error);
    throw error;
  }
};

const deleteMapById = async (mapId) => {
  try {
    return await prisma.mapId.delete({ where: { id: mapId } });
  } catch (error) {
    console.error('Error in deleteMapId:', error);
    throw error;
  }
};

module.exports = {
  getMapIdById,
  getMapIdByHash,
  getMapByDisplayName,
  getAllMaps,
  getAllMapsForUserId,
  getMaps,
  countMapIdsByServer,
  countMapIdsByUserId,
  countMapIds,
  createMapId,
  updateMapById,
  getUniqueUsernames,
  getUniqueArtists,
  getUniqueServers,
  getLatestServerIdByServer,
  deleteMapById,
};
