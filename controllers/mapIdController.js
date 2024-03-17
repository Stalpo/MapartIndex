const mapIdModel = require('../models/mapIdModel');

const getMaps = async (page, perPage, user, artist, sort, server) => {
  try {
    const maps = await mapIdModel.getMaps(page, perPage, user, artist, sort, server);
    return maps;
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

const getAllMaps = async () => {
  try {
    return await mapIdModel.getAllMaps();
  } catch (error) {
    console.error('Error fetching all maps:', error);
    throw error;
  }
};

const getMapById = async (mapId) => {
  try {
    return await mapIdModel.getMapIdById(mapId);
  } catch (error) {
    console.error('Error fetching map by ID:', error);
    throw error;
  }
};

const countMapIdsByServer = async (server) => {
  try {
    return await mapIdModel.countMapIdsByServer(server);
  } catch (error) {
    console.error('Error counting map IDs by server:', error);
    throw error;
  }
};

const generateFilename = async (server) => {
  try {
    const mapCount = await countMapIdsByServer(server) + 1;
    // Construct the filename
    const filename = `${server}_${mapCount}.png`;

    return filename;
  } catch (error) {
    console.error('Error generating filename:', error);
    throw error;
  }
};

const createMapId = async ({ userId, username, mapId, imgUrl, hash, server, serverId }) => {
  try {
    return await mapIdModel.createMapId({
      userId,
      username,
      mapId,
      imgUrl,
      hash,
      server,
      serverId,
    });
  } catch (error) {
    console.error('Error creating map ID:', error);
    throw error;
  }
};

const updateMapById = async (mapId, { artist, nsfw, tags }) => {
  try {
    const tagsArray = tags.split(',').map(tag => tag.trim());

    return await mapIdModel.updateMapById(mapId, {
      artist,
      nsfw,
      tags: tagsArray,
    });
  } catch (error) {
    console.error('Error updating map by ID:', error);
    throw error;
  }
};

const deleteMapById = async (mapId) => {
  try {
    return await mapIdModel.deleteMapById(mapId);
  } catch (error) {
    console.error('Error deleting map by ID:', error);
    throw error;
  }
};

const getUniqueUsernames = async () => {
  try {
    const uniqueUsernames = await mapIdModel.getUniqueUsernames();
    return uniqueUsernames;
  } catch (error) {
    console.error('Error fetching unique usernames:', error);
    throw error;
  }
};

const getUniqueArtists = async () => {
  try {
    const uniqueArtists = await mapIdModel.getUniqueArtists();
    return uniqueArtists;
  } catch (error) {
    console.error('Error fetching unique artists:', error);
    throw error;
  }
};

const getUniqueServers = async () => {
  try {
    const uniqueServers = await mapIdModel.getUniqueServers();
    return uniqueServers;
  } catch (error) {
    console.error('Error fetching unique servers:', error);
    throw error;
  }
};

const getMapIdByHash = async (hash) => {
  try {
    return await mapIdModel.getMapIdByHash(hash);
  } catch (error) {
    console.error('Error fetching map ID by hash:', error);
    throw error;
  }
};

const getMapsByOwnerId = async (ownerId) => {
  try {
    return await mapIdModel.getMapsByOwnerId(ownerId);
  } catch (error) {
    console.error('Error fetching maps by owner ID:', error);
    throw error;
  }
};

module.exports = {
  getMapById,
  getAllMaps,
  getMaps,
  countMapIdsByServer,
  generateFilename,
  createMapId,
  updateMapById,
  deleteMapById,
  getUniqueUsernames,
  getUniqueArtists,
  getUniqueServers,
  getMapIdByHash,
  getMapsByOwnerId,
};
