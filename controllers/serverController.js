const serverModel = require('../models/serverModel');

const getServerByName = async (name) => {
  try {
    return await serverModel.getServerByName(name);
  } catch (error) {
    console.error('Error in getServerByName:', error);
    throw error;
  }
};

const createServer = async ({
  name,
  discord
}) => {
  try {
    return await serverModel.createServer({
      name,
      discord
    });
  } catch (error) {
    console.error('Error in createServer:', error);
    throw error;
  }
};

module.exports = {
  getServerByName,
  createServer,
};