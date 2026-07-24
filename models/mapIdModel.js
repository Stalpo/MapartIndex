const prisma = require('../util/db').prisma;

// MapId has no nsfw field of its own - it always mirrors its linked MapArt's nsfw (false if it
// isn't linked to one). These turn a MapId record fetched with `include: { map: { select: {
// nsfw: true } } }` into the shape callers/templates expect (a plain `nsfw` boolean, no nested
// `map` object leaking into API responses that never exposed one before).
const withDerivedNsfw = (mapId) => {
  if (!mapId) return mapId;
  const { map, ...rest } = mapId;
  return { ...rest, nsfw: map ? map.nsfw : false };
};
const withDerivedNsfwMany = (mapIds) => mapIds.map(withDerivedNsfw);
const NSFW_SOURCE_INCLUDE = { map: { select: { nsfw: true } } };

const getMapIdById = async (mapId) => {
  try {
    const result = await prisma.mapId.findUnique({
      where: { id: mapId },
      include: NSFW_SOURCE_INCLUDE,
    });
    return withDerivedNsfw(result);
  } catch (error) {
    console.error('Error in getMapIdById:', error);
    throw error;
  }
};

const getMapIdByHash = async (hash, server) => {
  try {
    const result = await prisma.mapId.findFirst({
      where: { hash, server },
      include: NSFW_SOURCE_INCLUDE,
    });
    return withDerivedNsfw(result);
  } catch (error) {
    console.error('Error in getMapIdByHash:', error);
    throw error;
  }
};

const getMapIdsByPixelHash = async (pixelHash, { excludeId, server } = {}) => {
  try {
    return await prisma.mapId.findMany({
      where: {
        pixelHash,
        ...(excludeId ? { id: { not: excludeId } } : {}),
        ...(server ? { server } : {}),
      },
    });
  } catch (error) {
    console.error('Error in getMapIdsByPixelHash:', error);
    throw error;
  }
};

const getMapIdsByPixelHashes = async (pixelHashes, { server } = {}) => {
  try {
    if (!pixelHashes || pixelHashes.length === 0) return [];
    return await prisma.mapId.findMany({
      where: {
        pixelHash: { in: pixelHashes },
        ...(server ? { server } : {}),
      },
    });
  } catch (error) {
    console.error('Error in getMapIdsByPixelHashes:', error);
    throw error;
  }
};

const setPixelHash = async (id, pixelHash) => {
  try {
    return await prisma.mapId.update({
      where: { id },
      data: { pixelHash },
    });
  } catch (error) {
    console.error('Error in setPixelHash:', error);
    throw error;
  }
};

const getMapByDisplayName = async (displayName) => {
  try {
    const result = await prisma.mapId.findFirst({
      where: { displayName },
      include: NSFW_SOURCE_INCLUDE,
    });
    return withDerivedNsfw(result);
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
        map: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return withDerivedNsfwMany(maps);
  } catch (error) {
    console.error('Error fetching all maps:', error);
    throw error;
  }
};

const getAllMapsForUserId = async (userId) => {
  try {
    const maps = await prisma.mapId.findMany({
      where: {
        userId: userId,
      },
      include: {
        map: true,
      },
    });
    return withDerivedNsfwMany(maps);
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
      where.artist = {
        contains: artist,
        mode: 'insensitive'
      };
    }
    if (server) {
      where.server = server;
    }

    // Apply sorting criteria
    let orderBy = [{}, { createdAt: 'desc' }];
    switch (sort) {
      case 'nameAsc':
        orderBy[0] = { artist: 'asc' };
        break;
      case 'nameDesc':
        orderBy[0] = { artist: 'desc' };
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
      include: NSFW_SOURCE_INCLUDE,
    });

    return withDerivedNsfwMany(maps);
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

const countMaps = async (user, artist, server) => {
  try {
    const where = {};

    // Apply filtering criteria
    if (user) {
      where.username = user;
    }
    if (artist) {
      where.artist = {
        contains: artist,
        mode: 'insensitive'
      };
    }
    if (server) {
      where.server = server;
    }

    const count = await prisma.mapId.count({
      where,
    });

    return count;
  } catch (error) {
    console.error('Error counting map IDs:', error);
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

const createMapId = async ({ userId, username, mapId, imgUrl, displayName, hash, pixelHash, server, serverId }) => {
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
        pixelHash: pixelHash,
        server: server,
        serverId: serverId,
      }
    });
  } catch (error) {
    console.error('Error in createMapId:', error);
    throw error;
  }
};

// nsfw is intentionally not settable here - a MapId's nsfw always mirrors its linked MapArt's
// nsfw (see withDerivedNsfw above), so it's controlled by editing the MapArt, not the MapId.
const updateMapById = async (mapId, { artist, tags }) => {
  try {
    let uniqueTags = tags;
    if (uniqueTags) {
      uniqueTags = [...new Set(uniqueTags)];
    }

    return await prisma.mapId.update({
      where: { id: mapId },
      data: {
        artist,
        tags: uniqueTags,
      },
    });
  } catch (error) {
    console.error('Error in updateMapById:', error);
    throw error;
  }
};

const incrementMapViews = async (mapId) => {
  try {
    const map = await prisma.mapId.findUnique({
      where: { id: mapId }
    });
    const views = map.views + 1;
    return await prisma.mapId.update({
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

const getLatestServerIdByServer = async (server) => {
  try {
    const allEntries = await prisma.mapId.findMany({
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

const countMapIdsMissingMapArt = async () => {
  try {
    return await prisma.mapId.count({
      where: {
        OR: [
          { mapId: null },
          { mapId: { isSet: false } },
        ],
      },
    });
  } catch (error) {
    console.error('Error counting map ids missing map art:', error);
    throw error;
  }
};

const fetchMapIdsMissingMapArt = async (page, perPage) => {
  try {
    let skip = 0;
    let take = Number.MAX_SAFE_INTEGER;
    if (page && perPage) {
      skip = (page - 1) * perPage;
      take = perPage;
    }

    // Loose MapIds - by definition not linked to a MapArt, so nsfw is trivially false; no need
    // to include/derive it here.
    return await prisma.mapId.findMany({
      where: {
        OR: [
          { mapId: null },
          { mapId: { isSet: false } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });
  } catch (error) {
    console.error('Error fetching map ids missing map art:', error);
    throw error;
  }
};

const fetchLatestUpdatedAt = async (limit) => {
  try {
    const maps = await prisma.mapId.findMany({
      orderBy: {
        updatedAt: 'desc'
      },
      take: limit,
      include: NSFW_SOURCE_INCLUDE,
    });
    return withDerivedNsfwMany(maps);
  } catch (error) {
    console.error('Error in fetchLatestUpdatedAt:', error);
    throw error;
  }
};

const deleteMapById = async (mapId) => {
  try {
    const map = await prisma.mapId.findUnique({ where: { id: mapId } });

    if (map && map.mapId) {
      const error = new Error('This map id has an associated map art and cannot be deleted.');
      error.code = 'MAPID_HAS_MAPART';
      throw error;
    }

    return await prisma.mapId.delete({ where: { id: mapId } });
  } catch (error) {
    console.error('Error in deleteMapId:', error);
    throw error;
  }
};

module.exports = {
  getMapIdById,
  getMapIdByHash,
  getMapIdsByPixelHash,
  getMapIdsByPixelHashes,
  setPixelHash,
  getMapByDisplayName,
  getAllMaps,
  getAllMapsForUserId,
  getMaps,
  countMaps,
  countMapIdsByServer,
  countMapIdsByUserId,
  countMapIds,
  createMapId,
  updateMapById,
  incrementMapViews,
  getUniqueUsernames,
  getUniqueArtists,
  getUniqueServers,
  getLatestServerIdByServer,
  fetchMapIdsMissingMapArt,
  countMapIdsMissingMapArt,
  fetchLatestUpdatedAt,
  deleteMapById,
};
