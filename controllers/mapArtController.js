const mapArtModel = require('../models/mapArtModel');

const getAllMapArts = async () => {
  try {
    return await mapArtModel.getAllMapArts();
  } catch (error) {
    console.error('Error fetching map by ID:', error);
    throw error;
  }
};

const getMapById = async (mapId) => {
  try {
    return await mapArtModel.getMapById(mapId);
  } catch (error) {
    console.error('Error fetching map by ID:', error);
    throw error;
  }
};

const countAllMapArts = async () => {
  try {
    const count = await mapArtModel.countAllMapArts();
    return count;
  } catch (error) {
    console.error('Error counting all map arts:', error);
    throw error;
  }
};

const getMaps = async (page, perPage, user, artist, sort, server, tag) => {
  try {
    const maps = await mapArtModel.getMaps(page, perPage, user, artist, sort, server, tag);
    return maps;
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

const getUniqueUsernames = async () => {
  try {
    const uniqueUsernames = await mapArtModel.getUniqueUsernames();
    return uniqueUsernames;
  } catch (error) {
    console.error('Error fetching unique usernames:', error);
    throw error;
  }
};

const getUniqueArtists = async () => {
  try {
    const uniqueArtists = await mapArtModel.getUniqueArtists();
    return uniqueArtists;
  } catch (error) {
    console.error('Error fetching unique artists:', error);
    throw error;
  }
};

const getUniqueServers = async () => {
  try {
    const uniqueServers = await mapArtModel.getUniqueServers();
    return uniqueServers;
  } catch (error) {
    console.error('Error fetching unique servers:', error);
    throw error;
  }
};

const getUniqueTags = async () => {
  try {
    const uniqueTags = await mapArtModel.getUniqueTags();
    return uniqueTags;
  } catch (error) {
    console.error('Error fetching unique servers:', error);
    throw error;
  }
};

const createMapId = async ({ userId, username, artist, name, description, mapIds, width, height, tags, imgUrl, displayName, hash, server, serverId, nsfw }) => {
  try {
    return await mapArtModel.createMapId({
      userId,
      username,
      artist,
      name,
      description,
      mapIds,
      width,
      height,
      tags,
      imgUrl,
      displayName,
      hash,
      server,
      serverId,
      nsfw,
    });
  } catch (error) {
    console.error('Error creating map ID:', error);
    throw error;
  }
};

const countMapIdsByServer = async (server) => {
  try {
    return await mapArtModel.countMapIdsByServer(server);
  } catch (error) {
    console.error('Error counting map IDs by server:', error);
    throw error;
  }
};

const updateMapById = async (mapId, { artist, name, description, nsfw, tags }) => {
  try {
    return await mapArtModel.updateMapById(mapId, {
      artist,
      name,
      description,
      nsfw,
      tags,
    });
  } catch (error) {
    console.error('Error updating map by ID:', error);
    throw error;
  }
};

const incrementMapViews = async (mapId) => {
  try {
    return await mapArtModel.incrementMapViews(mapId);
  } catch (error) {
    console.error('Error incrementing map views:', error);
    throw error;
  }
};

const setFavoriteMapArtId = async (userId, mapId) => {
  try {
    return await mapArtModel.setFavoriteMapArtId(userId, mapId);
  } catch (error) {
    console.error('Error setting favorite mapart:', error);
    throw error;
  }
};

const removeFavoriteMapArtId = async (userId, mapId) => {
  try {
    return await mapArtModel.removeFavoriteMapArtId(userId, mapId);
  } catch (error) {
    console.error('Error setting favorite mapart:', error);
    throw error;
  }
};

const isMapArtFavorite = async (userId, mapArtId) => {
  try {
    return await mapArtModel.isMapArtFavorite(userId, mapArtId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    throw error;
  }
}

const likeMapArtId = async (userId, mapArtId) => {
  try {
    return await mapArtModel.likeMapArtId(userId, mapArtId);
  } catch (error) {
    console.error('Error liking map art:', error);
    throw error;
  }
}

const unlikeMapArtId = async (userId, mapArtId) => {
  try {
    return await mapArtModel.unlikeMapArtId(userId, mapArtId);
  } catch (error) {
    console.error('Error unliking map art:', error);
    throw error;
  }
}

const isMapArtIdLiked = async (userId, mapArtId) => {
  try {
    return await mapArtModel.isMapArtIdLiked(userId, mapArtId);
  } catch (error) {
    console.error('Error finding if map art was liked:', error);
    throw error;
  }
}

const generateFilename = async (server) => {
  try {
    const mapCount = await getLatestServerIdByServer(server) + 1;
    // Construct the filename
    const filename = `${server}_MAPART_${mapCount}.png`;

    return filename;
  } catch (error) {
    console.error('Error generating filename:', error);
    throw error;
  }
};

const fetchMapsMissingInfo = async (type) => {
  try {
    return await mapArtModel.fetchMapsMissingInfo(type);
  } catch (error) {
    console.error('Error finding maps missing info:', error);
    throw error;
  }
}

const fetchLatestUpdatedAt = async (limit) => {
  try {
    return await mapArtModel.fetchLatestUpdatedAt(limit);
  } catch (error) {
    console.error('Error finding latest updated maps:', error);
    throw error;
  }
};

const deleteMapById = async (mapId) => {
  try {
    return await mapArtModel.deleteMapById(mapId);
  } catch (error) {
    console.error('Error deleting map by ID:', error);
    throw error;
  }
};

const getLatestServerIdByServer = async (server) => {
  try {
    return await mapArtModel.getLatestServerIdByServer(server);
  } catch (error) {
    console.error('Error counting map IDs by server:', error);
    throw error;
  }
};

module.exports = {
  getAllMapArts,
  getMaps,
  getMapById,
  countAllMapArts,
  getUniqueArtists,
  getUniqueUsernames,
  getUniqueServers,
  getUniqueTags,
  createMapId,
  countMapIdsByServer,
  updateMapById,
  incrementMapViews,
  setFavoriteMapArtId,
  removeFavoriteMapArtId,
  isMapArtFavorite,
  likeMapArtId,
  unlikeMapArtId,
  isMapArtIdLiked,
  generateFilename,
  fetchMapsMissingInfo,
  fetchLatestUpdatedAt,
  deleteMapById,
  getLatestServerIdByServer,
}