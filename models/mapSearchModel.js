const prisma = require('../util/db').prisma;

const searchMaps = async (page, perPage = 25, user, artist, sort, server, searchTerm) => {
  try {
    const whereMapArt = {};
    const whereMapId = {};

    // Apply filtering criteria for MapArt
    if (user) {
      whereMapArt.username = user;
    }
    if (artist) {
      whereMapArt.artist = artist;
    }
    if (server) {
      whereMapArt.server = server;
    }

    // Apply filtering criteria for MapId
    if (user) {
      whereMapId.username = user;
    }
    if (artist) {
      whereMapId.artist = artist;
    }
    if (server) {
      whereMapId.server = server;
    }

    // Apply search criteria for both models
    if (searchTerm) {
      whereMapArt.OR = [
        { displayName: { contains: searchTerm } },
        { artist: { contains: searchTerm } },
        { server: { contains: searchTerm } }
      ];
      whereMapId.OR = [
        { displayName: { contains: searchTerm } },
        { artist: { contains: searchTerm } },
        { server: { contains: searchTerm } }
      ];
    }

    // Apply sorting criteria (assuming both models have the same sorting options)
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

    // Fetch maps from both models with pagination, filtering, and sorting
    const mapsArt = await prisma.mapArt.findMany({
      where: whereMapArt,
      orderBy,
      skip: page ? (page - 1) * perPage : 0,
      take: perPage || Number.MAX_SAFE_INTEGER
    });

    const mapsId = await prisma.mapId.findMany({
      where: whereMapId,
      orderBy,
      skip: page ? (page - 1) * perPage : 0,
      take: perPage || Number.MAX_SAFE_INTEGER
    });

    // Combine and sort the results from both models
    const combinedMaps = [...mapsArt, ...mapsId].sort((a, b) => a.createdAt - b.createdAt);

    return combinedMaps;
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

module.exports = { searchMaps };