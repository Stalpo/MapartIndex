const mapArtModel = require('../models/mapArtModel');

const createMapId = async ({ userId, username, mapId, imgUrl, hash, server }) => {
  try {
    return await mapArtModel.createMapId({
      userId,
      username,
      mapId,
      imgUrl,
      hash,
      server,
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

const generateFilename = async (server) => {
  try {
    const mapCount = await countMapIdsByServer(server) + 1;
    // Construct the filename
    const filename = `${server}_MAPART_${mapCount}.png`;

    return filename;
  } catch (error) {
    console.error('Error generating filename:', error);
    throw error;
  }
};

module.exports = {
  createMapId,
  countMapIdsByServer,
  generateFilename,
}