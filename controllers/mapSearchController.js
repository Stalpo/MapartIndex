const mapSearchModel = require('../models/mapSearchModel');

const searchMaps = async (req, res, next) => {
  try {
    // Extract query parameters from request object
    const { page, perPage, user, artist, sort, server, query } = req.query;

    // Call the searchMaps function from mapSearchModel.js
    const maps = await mapSearchModel.searchMaps(page, perPage, user, artist, sort, server, query);

    // Send the response
    return JSON.stringify(maps);
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

module.exports = {
  searchMaps,
};
