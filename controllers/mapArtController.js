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

const createMapId = async ({ userId, username, artist, name, description, mapIds, tags, imgUrl, displayName, hash, server, serverId }) => {
  try {
    return await mapArtModel.createMapId({
      userId,
      username,
      artist,
      name,
      description,
      mapIds,
      tags,
      imgUrl,
      displayName,
      hash,
      server,
      serverId,
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
  generateFilename,
  deleteMapById,
  getLatestServerIdByServer,
}