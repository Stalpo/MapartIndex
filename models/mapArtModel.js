const prisma = require('../util/db').prisma;

const getAllMapArts = async () => {
  try {
    const maps = await prisma.mapArt.findMany({
      where: {
        userId: {
          not: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return maps;
  } catch (error) {
    console.error('Error fetching all maparts:', error);
    throw error;
  }
};

const getMaps = async (page, perPage, user, artist, sort, server, tag) => {
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
    if (tag) {
      where.tags = {
        has: tag
      };
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
        orderBy = { createdAt: 'desc' };
        break;
      case 'mapIdsAsc':
        orderBy = { mapIdsCount: 'asc' };
        break;
      case 'mapIdsDesc':
        orderBy = { mapIdsCount: 'desc' };
        break;
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
    const maps = await prisma.mapArt.findMany({
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

const countAllMapArts = async () => {
  try {
    const count = await prisma.mapArt.count();

    return count;
  } catch (error) {
    console.error('Error counting all map arts:', error);
    throw error;
  }
};

const getMapById = async (mapId) => {
  try {
    return await prisma.mapArt.findUnique({
      where: { id: mapId },
      include: { favorites: true },
    });
  } catch (error) {
    console.error('Error in getMapIdById:', error);
    throw error;
  }
};

const getUniqueUsernames = async () => {
  try {
    const uniqueUsernames = await prisma.mapArt.findMany({
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
    const uniqueArtists = await prisma.mapArt.findMany({
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
    const uniqueServers = await prisma.mapArt.findMany({
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

const getUniqueTags = async () => {
  try {
    const mapArtRecords = await prisma.mapArt.findMany({
      select: {
        tags: true,
      },
    });

    // Flatten the tags arrays and filter out null or undefined values
    const allTags = mapArtRecords.flatMap(record => record.tags || []).filter(tag => tag);

    // Create a Set to ensure uniqueness, then convert it back to an array
    const uniqueTags = [...new Set(allTags)];

    return uniqueTags;
  } catch (error) {
    console.error('Error fetching unique tags:', error);
    throw error;
  }
};

const createMapId = async ({ userId, username, artist, name, description, mapIds, tags, imgUrl, displayName, hash, server, serverId }) => {
  try {
    const mapIdsCount = mapIds.length;
    return await prisma.mapArt.create({
      data: {
        user: {
          connect: {
            id: userId
          }
        },
        username,
        artist,
        name,
        description,
        mapIds: {
          connect: mapIds.map(id => ({ id }))
        },
        mapIdsCount,
        tags,
        imgUrl,
        displayName,
        hash,
        server,
        serverId
      }
    });
  } catch (error) {
    console.error('Error creating map ID:', error);
    throw error;
  }
};

const updateMapById = async (mapId, { artist, name, description, nsfw, tags }) => {
  try {
    return await prisma.mapArt.update({
      where: { id: mapId },
      data: {
        artist,
        name,
        description,
        nsfw,
        tags,
      },
    });
  } catch (error) {
    console.error('Error in updateMapById:', error);
    throw error;
  }
};

const incrementMapViews = async (mapId) => {
  try {
    const mapArt = await prisma.mapArt.findUnique({
      where: { id: mapId }
    });
    const views = mapArt.views + 1;
    return await prisma.mapArt.update({
      where: { id: mapId },
      data: {
        views,
      },
    });
  } catch (error) {
    console.error('Error in incrementMapViews:', error);
    throw error;
  }
};

const setFavoriteMapArt = async (userId, mapArtId) => {
  try {
    // Retrieve the profile associated with the userId
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { favorites: true },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Check if the mapArtId is already in favorites
    const isMapArtFavorited = profile.favorites.some(favorite => favorite.mapArtId === mapArtId);
    if (isMapArtFavorited) {
      throw new Error('MapArt already favorited');
    }

    // Create a new entry in the Favorite table
    const newFavorite = await prisma.favorites.create({
      data: {
        profileId: userId,
        mapArtId: mapArtId,
      },
    });

    return newFavorite;
  } catch (error) {
    console.error('Error setting favorite mapArt:', error);
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

const getLatestServerIdByServer = async (server) => {
  try {
    const allEntries = await prisma.mapArt.findMany({
      where: {
        server: server
      },
      select: {
        serverId: true
      }
    });

    const serverIds = allEntries.map(entry => entry.serverId);
    serverIds.sort((a, b) => b - a);
    if (serverIds[0] === undefined) {
      serverIds[0] = 0;
    }
    return serverIds[0];
  } catch (error) {
    console.error('Error fetching highest serverId:', error);
    throw error;
  }
};

const deleteMapById = async (mapId) => {
  try {
    return await prisma.mapArt.delete({ where: { id: mapId } });
  } catch (error) {
    console.error('Error in deleteMapId:', error);
    throw error;
  }
};

module.exports = {
  getAllMapArts,
  getMaps,
  countAllMapArts,
  getMapById,
  getUniqueArtists,
  getUniqueUsernames,
  getUniqueServers,
  getUniqueTags,
  createMapId,
  updateMapById,
  incrementMapViews,
  setFavoriteMapArt,
  countMapIdsByServer,
  getLatestServerIdByServer,
  deleteMapById,
};