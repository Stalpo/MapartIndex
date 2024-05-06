const prisma = require('../util/db').prisma;

// Helper function to create filter objects for queries
const createFilter = (user, artist, server, searchTerm, includeTags = false, includeNames = false) => {
  const filter = { nsfw: false }; // Ensure NSFW items are excluded
  if (user) filter.username = user;
  if (artist) filter.artist = artist;
  if (server) filter.server = server;
  if (searchTerm) {
    filter.OR = [
      { displayName: { contains: searchTerm, mode: 'insensitive' } },
      { artist: { contains: searchTerm, mode: 'insensitive' } },
      { server: { contains: searchTerm, mode: 'insensitive' } },
    ];
    if (includeNames) {
      filter.OR.push({ name: { contains: searchTerm, mode: 'insensitive' } });
    }
    if (includeTags) {
      filter.OR.push({ tags: { hasSome: [searchTerm] } });
    }
  }
  return filter;
}

// Helper function to create sorting object for queries
const getOrderBy = (sort) => {
  switch (sort) {
    case 'nameAsc': return { artist: 'asc' };
    case 'nameDesc': return { artist: 'desc' };
    case 'dateAsc': return { createdAt: 'asc' };
    case 'dateDesc':
    default: return { createdAt: 'desc' };
  }
}

// searchMaps with pagination for search page
const searchMaps = async (page = 1, perPage = 25, user, artist, sort, server, searchTerm) => {
  try {
    const whereMapArt = createFilter(user, artist, server, searchTerm, true, true);
    const whereMapId = createFilter(user, artist, server, searchTerm);

    // Fetch data from both models
    const mapsArt = await prisma.mapArt.findMany({
      where: whereMapArt,
      orderBy: getOrderBy(sort)
    });

    const mapsId = await prisma.mapId.findMany({
      where: whereMapId,
      orderBy: getOrderBy(sort)
    });

    // Combine and sort the results from both models
    const combinedMaps = [...mapsArt, ...mapsId].sort((a, b) => b.createdAt - a.createdAt);

    // Manually apply pagination
    const startIndex = (page - 1) * perPage;
    const paginatedMaps = combinedMaps.slice(startIndex, startIndex + perPage);
    const totalPages = Math.ceil(combinedMaps.length / perPage);

    return { maps: paginatedMaps, totalPages };
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

module.exports = { searchMaps };