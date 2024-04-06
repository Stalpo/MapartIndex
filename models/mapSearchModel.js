const prisma = require('../util/db').prisma;

/**
 *  There is a problem with pagination because we are doing 25 perPage but we are doing 2 queries to the db for mapart and mapid.
 *  So in the view it is showing 50 results on most pages, which is making the pagination off decently at times.
 *  There may be extra code here for debugging and coming up with a solution to that problem.
 */

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
        { displayName: { equals: searchTerm, mode: 'insensitive' } },
        { username: { equals: searchTerm, mode: 'insensitive' } },
        { artist: { equals: searchTerm, mode: 'insensitive' } },
        { server: { equals: searchTerm, mode: 'insensitive' } },
        { tags: { hasSome: [searchTerm] } }
      ];
      whereMapId.OR = [
        { displayName: { equals: searchTerm, mode: 'insensitive' } },
        { username: { equals: searchTerm, mode: 'insensitive' } },
        { artist: { equals: searchTerm, mode: 'insensitive' } },
        { server: { equals: searchTerm, mode: 'insensitive' } }
      ];
    }

    // Fetch unique map IDs for MapArt
    const uniqueMapIdsArt = await prisma.mapArt.findMany({
      select: { id: true },
      where: whereMapArt,
      distinct: ['id']
    });

    // Fetch unique map IDs for MapId
    const uniqueMapIdsId = await prisma.mapId.findMany({
      select: { id: true },
      where: whereMapId,
      distinct: ['id']
    });

    // Combine the unique map IDs from both models
    const uniqueMapIds = [...new Set([...uniqueMapIdsArt.map(map => map.id), ...uniqueMapIdsId.map(map => map.id)])];

    // Count the total number of unique maps
    const totalCount = uniqueMapIds.length;
    //console.log(totalCount);

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

    // Calculate the total number of pages based on the total count of maps
    const totalPages = Math.ceil(totalCount / perPage);

    return { maps: combinedMaps, totalPages };
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

module.exports = { searchMaps };
